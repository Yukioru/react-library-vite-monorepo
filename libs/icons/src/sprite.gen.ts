export interface SpritesMap {
  common: 'bookmark-filled' | 'bookmark-stroke';
}
export const SPRITES_META: {
  [Key in keyof SpritesMap]: {
    filePath: string;
    items: Record<
      SpritesMap[Key],
      {
        viewBox: string;
        width: number;
        height: number;
      }
    >;
  };
} = {
  common: {
    filePath: 'common.50a8b083.svg',
    items: {
      'bookmark-filled': {
        viewBox: '0 0 24 24',
        width: 24,
        height: 24,
      },
      'bookmark-stroke': {
        viewBox: '0 0 24 24',
        width: 24,
        height: 24,
      },
    },
  },
};
