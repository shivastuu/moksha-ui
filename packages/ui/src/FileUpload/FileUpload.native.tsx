import { useState } from 'react';
import { AccessibilityInfo, Pressable, Text, View } from 'react-native';
import { surfaceColors } from '../Surface/Surface.shared';
import { useTheme } from '../theme/context';
import { fontFor, textStyleFor } from '../theme/textStyle';
import { controlColors } from '../utils/controls';
import { softTones, textTones } from '../utils/tones';
import { useControllableState } from '../utils/useControllableState';
import { addedMessage, addFiles, fileBadge, formatBytes, type FileUploadProps, type PickedFile } from './FileUpload.shared';

/** Tap to pick files with the app's picker. Files are checked for type and size, and each refusal says why */
export function FileUpload({ label, accept, maxSize, multiple, value, defaultValue = [], onValueChange, hint, onPick, disabled, testID }: FileUploadProps) {
  const theme = useTheme();
  const { colors, components, space, radius, shadows, opacity } = theme;
  const [files, setFiles] = useControllableState(value, defaultValue, onValueChange);
  const [errors, setErrors] = useState<string[]>([]);
  const off = disabled || !onPick;
  const look = controlColors(colors);
  const badge = softTones(colors).primary;

  const pick = async () => {
    const incoming = await onPick!().catch(() => [] as PickedFile[]);
    if (!incoming.length) {
      return;
    }
    const result = addFiles(files, incoming, { accept, maxSize, multiple });
    setErrors(result.errors);
    const added = incoming.length - result.errors.length;
    AccessibilityInfo.announceForAccessibility([added > 0 ? addedMessage(added) : '', ...result.errors].filter(Boolean).join('. '));
    if (result.files !== files) {
      setFiles(result.files);
    }
  };

  return (
    <View testID={testID} style={{ gap: space.sm }}>
      <Text style={[textStyleFor(theme, components.field.labelStyle), { color: colors.text }]}>{label}</Text>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Choose ${multiple ? 'files' : 'a file'} for ${label}`}
        accessibilityHint={hint}
        accessibilityState={{ disabled: off }}
        disabled={off}
        onPress={pick}
        style={({ pressed }) => ({
          alignItems: 'center',
          gap: space.xs,
          paddingVertical: space.xl,
          paddingHorizontal: space.lg,
          borderWidth: 1.5,
          borderStyle: 'dashed',
          borderColor: pressed ? look.indicator : look.boxBorder,
          borderRadius: radius.xl,
          backgroundColor: pressed ? look.selectedFill : colors.surface,
          opacity: off ? opacity.disabled : 1,
        })}
      >
        <Text style={[textStyleFor(theme, 'body'), { color: colors.text }]}>
          Tap to choose {multiple ? 'files' : 'a file'}
        </Text>
        {hint ? <Text style={[textStyleFor(theme, 'bodySmall'), { color: colors.textMuted, textAlign: 'center' }]}>{hint}</Text> : null}
      </Pressable>
      {errors.map((error) => (
        <Text key={error} style={[textStyleFor(theme, 'bodySmall'), { color: textTones(colors).danger }]}>
          {error}
        </Text>
      ))}
      {files.map((file) => (
        <View
          key={`${file.name}-${file.size}`}
          style={{ flexDirection: 'row', alignItems: 'center', gap: space.md, padding: space.sm, paddingLeft: space.md, borderRadius: radius.lg, backgroundColor: colors.surfaceRaised, boxShadow: `${shadows.sm}, 0px 0px 0px 1px ${surfaceColors(colors).edge}` }}
        >
          <View importantForAccessibility="no-hide-descendants" accessibilityElementsHidden style={{ width: 40, height: 40, alignItems: 'center', justifyContent: 'center', borderRadius: radius.md, borderWidth: 1, borderColor: badge.border, backgroundColor: badge.background }}>
            <Text style={[{ fontSize: 10, color: badge.ink }, fontFor(theme, 'semibold')]}>{fileBadge(file.name)}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text numberOfLines={1} style={[textStyleFor(theme, 'bodySmall'), fontFor(theme, 'medium'), { color: colors.text }]}>
              {file.name}
            </Text>
            <Text style={[textStyleFor(theme, 'caption'), { color: colors.textMuted, fontVariant: ['tabular-nums'] }]}>{formatBytes(file.size)}</Text>
          </View>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Remove ${file.name}`}
            hitSlop={8}
            onPress={() => {
              setFiles(files.filter((kept) => kept !== file));
              AccessibilityInfo.announceForAccessibility(`${file.name} removed`);
            }}
            style={{ width: 32, height: 32, alignItems: 'center', justifyContent: 'center' }}
          >
            <Text style={{ fontSize: 18, color: colors.textMuted }}>×</Text>
          </Pressable>
        </View>
      ))}
    </View>
  );
}
