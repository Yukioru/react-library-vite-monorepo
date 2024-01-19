import { HTMLProps, PropsWithChildren } from 'react';
import clsx from 'clsx';

import styles from './Button.module.css';

export type ButtonProps = PropsWithChildren<
  HTMLProps<HTMLButtonElement> & {
    type?: HTMLButtonElement['type'];
  }
>;

export function Button({ className, ...props }: ButtonProps): JSX.Element {
  return (
    <>
      <button
        className={clsx(styles.base, className, 'bg-kek-500')}
        {...props}
      />
    </>
  );
}
