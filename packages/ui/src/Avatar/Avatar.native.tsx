import { useState } from 'react';
import { Image, Text, View } from 'react-native';
import { useTheme } from '../theme/context';
import { fontFor } from '../theme/textStyle';
import { avatarColors, avatarLabel, groupLabel, initials, statusTone, type AvatarGroupProps, type AvatarProps } from './Avatar.shared';

function AvatarBase({ name, src, size = 'md', status, testID, hidden, ring }: AvatarProps & { hidden?: boolean; ring?: boolean }) {
  const theme = useTheme();
  const { colors, components } = theme;
  const [failed, setFailed] = useState(false);
  const look = avatarColors(name, colors);
  const dimension = components.avatar.sizes[size];
  const showPhoto = src && !failed;
  return (
    <View
      testID={testID}
      accessible={!hidden}
      accessibilityRole={hidden ? undefined : 'image'}
      accessibilityLabel={hidden ? undefined : avatarLabel(name, status)}
      importantForAccessibility={hidden ? 'no-hide-descendants' : undefined}
      style={{
        width: dimension,
        height: dimension,
        borderRadius: dimension / 2,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: look.fallback,
        backgroundImage: showPhoto ? undefined : look.background,
        boxShadow: ring ? `0px 0px 0px 2px ${colors.background}` : `inset 0px 0px 0px 1px ${look.edge}`,
      }}
    >
      {showPhoto ? (
        <Image
          testID={testID ? `${testID}-photo` : undefined}
          source={{ uri: src }}
          onError={() => setFailed(true)}
          style={{ width: dimension, height: dimension, borderRadius: dimension / 2 }}
        />
      ) : (
        <Text style={{ color: look.ink, fontSize: dimension * 0.38, ...fontFor(theme, 'semibold') }}>{initials(name)}</Text>
      )}
      {status ? (
        <View
          style={{
            position: 'absolute',
            right: 0,
            bottom: 0,
            width: dimension * 0.28,
            height: dimension * 0.28,
            borderRadius: dimension,
            backgroundColor: colors[statusTone[status]],
            boxShadow: `0px 0px 0px 2px ${colors.background}`,
          }}
        />
      ) : null}
    </View>
  );
}

/** A photo, or initials on a gradient picked from the name, with an optional status dot */
export function Avatar(props: AvatarProps) {
  return <AvatarBase {...props} />;
}

/** Overlapping avatars with "+N" for the rest. Screen readers hear the names once */
export function AvatarGroup({ people, max = 4, size = 'md', testID }: AvatarGroupProps) {
  const theme = useTheme();
  const { colors, components } = theme;
  const dimension = components.avatar.sizes[size];
  const shown = people.slice(0, max);
  const rest = people.length - shown.length;
  return (
    <View testID={testID} accessible accessibilityLabel={groupLabel(people)} style={{ flexDirection: 'row', alignItems: 'center' }}>
      {shown.map((person, index) => (
        <View key={`${person.name}-${index}`} style={{ marginLeft: index ? -dimension * 0.28 : 0 }}>
          <AvatarBase {...person} size={size} hidden ring />
        </View>
      ))}
      {rest > 0 ? (
        <View
          style={{
            marginLeft: -dimension * 0.28,
            width: dimension,
            height: dimension,
            borderRadius: dimension / 2,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: colors.surface,
            boxShadow: `0px 0px 0px 2px ${colors.background}`,
          }}
        >
          <Text style={{ color: colors.textMuted, fontSize: dimension * 0.36, ...fontFor(theme, 'semibold') }}>+{rest}</Text>
        </View>
      ) : null}
    </View>
  );
}
