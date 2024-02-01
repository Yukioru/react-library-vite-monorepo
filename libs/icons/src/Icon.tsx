import clsx from 'clsx';
import type { SVGProps } from 'react';

import { SPRITES_META, type SpritesMap } from './sprite.gen';
import styles from './Icon.module.css';

export type IconName<Key extends keyof SpritesMap> =
  `${Key}/${SpritesMap[Key]}`;

export type AnyIconName = {
  [Key in keyof SpritesMap]: IconName<Key>;
}[keyof SpritesMap];

export interface IconMeta<IconKey> {
  filePath: string;
  iconName: IconKey;
  viewBox: string;
  axis: 'x' | 'y' | 'xy';
}

export interface IconProps extends SVGProps<SVGSVGElement> {
  name: AnyIconName;
}

const getIconMeta = <Key extends keyof SpritesMap>(
  name: IconName<Key>,
): IconMeta<SpritesMap[Key]> => {
  const [spriteName, iconName] = name.split('/') as [Key, SpritesMap[Key]];
  const {
    filePath,
    items: {
      [iconName]: { viewBox, width, height },
    },
  } = SPRITES_META[spriteName];
  const axis = width === height ? 'xy' : width > height ? 'x' : 'y';

  return { filePath, iconName, viewBox, axis };
};

export function Icon({ name, className, ...props }: IconProps): JSX.Element {
  const { viewBox, filePath, iconName, axis } = getIconMeta(name);
  return (
    <svg
      className={clsx(styles.icon, className)}
      viewBox={viewBox}
      data-axis={axis}
      focusable="false"
      aria-hidden
      {...props}>
      <use href={`/.uikit/sprites/${filePath}#${iconName}`} />
    </svg>
  );
}
