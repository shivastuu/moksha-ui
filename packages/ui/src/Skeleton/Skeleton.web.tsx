'use client';

import { skeletonBlocks, type SkeletonProps } from './Skeleton.shared';

/** A shimmering placeholder while content loads. Hidden from screen readers; mark the region `aria-busy` instead */
export function Skeleton(props: SkeletonProps) {
  return (
    <span className="ds-skeleton-group" aria-hidden="true" data-testid={props.testID}>
      {skeletonBlocks(props).map((block, index) => (
        <span
          key={index}
          className={block.round ? 'ds-skeleton ds-skeleton--round' : 'ds-skeleton'}
          style={{ width: block.width, height: block.height }}
        />
      ))}
    </span>
  );
}
