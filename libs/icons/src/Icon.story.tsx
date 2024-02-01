import type { Meta } from '@storybook/react';
import { Fragment } from 'react';

import { Icon } from './Icon';
import { SPRITES_META } from './sprite.gen';

const meta = {
  title: 'Example/Icons',
  component: Icon,
  tags: ['autodocs'],
} satisfies Meta<typeof Icon>;

export default meta;

const keys = Object.entries(SPRITES_META)
  .map(([key, obj]) => {
    const prefix = key;
    const icons = Object.keys(obj.items).map(icon => `${prefix}/${icon}`);
    return icons;
  })
  .flat();

const icons: string[][] = [];
const chunkSize = 2;
for (let i = 0; i < keys.length; i += chunkSize) {
  icons.push(keys.slice(i, i + chunkSize));
}

export const Default = (): JSX.Element => (
  <table width="100%" style={{ borderCollapse: 'separate' }}>
    <thead>
      <th align="left">Icon</th>
      <th align="left">Name</th>
      <th align="left">Icon</th>
      <th align="left">Name</th>
    </thead>
    {icons.map((row, i) => (
      <tr key={i}>
        {row.map(icon => (
          <Fragment key={icon}>
            <td
              style={{
                border: '1px solid #ededed',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: 50,
                fontSize: 24,
              }}>
              {/* @ts-expect-error Idk how to types name properly */}
              <Icon name={icon} />
            </td>
            <td
              align="left"
              style={{
                border: '1px solid #ededed',
                paddingInline: 16,
              }}>
              <div style={{ fontSize: 12 }}>{icon}</div>
            </td>
          </Fragment>
        ))}
      </tr>
    ))}
  </table>
);
