'use client';

import { useState, type CSSProperties } from 'react';
import { useTheme } from '../theme/context';
import { avatarColors, avatarLabel, groupLabel, initials, type AvatarGroupProps, type AvatarProps } from './Avatar.shared';

function AvatarBase({ name, src, size = 'md', status, testID, hidden }: AvatarProps & { hidden?: boolean }) {
  const { colors } = useTheme();
  const [failed, setFailed] = useState(false);
  const look = avatarColors(name, colors);
  const showPhoto = src && !failed;
  return (
    <span
      className={`ds-avatar ds-avatar--${size}`}
      role={hidden ? undefined : 'img'}
      aria-label={hidden ? undefined : avatarLabel(name, status)}
      aria-hidden={hidden || undefined}
      data-testid={testID}
      style={{ background: showPhoto ? undefined : look.background, color: look.ink, '--ds-avatar-edge': look.edge } as CSSProperties}
    >
      {showPhoto ? <img className="ds-avatar__photo" src={src} alt="" onError={() => setFailed(true)} /> : initials(name)}
      {status && <span className={`ds-avatar__status ds-avatar__status--${status}`} />}
    </span>
  );
}

/** A photo, or initials on a gradient picked from the name, with an optional status dot */
export function Avatar(props: AvatarProps) {
  return <AvatarBase {...props} />;
}

/** Overlapping avatars with "+N" for the rest. Screen readers hear the names once */
export function AvatarGroup({ people, max = 4, size = 'md', testID }: AvatarGroupProps) {
  const shown = people.slice(0, max);
  const rest = people.length - shown.length;
  return (
    <span className={`ds-avatar-group ds-avatar-group--${size}`} role="group" aria-label={groupLabel(people)} data-testid={testID}>
      {shown.map((person, index) => (
        <AvatarBase key={`${person.name}-${index}`} {...person} size={size} hidden />
      ))}
      {rest > 0 && (
        <span className={`ds-avatar ds-avatar--${size} ds-avatar--more`} aria-hidden="true">
          +{rest}
        </span>
      )}
    </span>
  );
}
