import { HTMLProps, PropsWithChildren } from 'react';
import clsx from 'clsx';

import styles from './Button.module.css';

export type ButtonProps = PropsWithChildren<
  HTMLProps<HTMLButtonElement> & {
    type?: HTMLButtonElement['type'];
  }
>;

export function Button({ className, ...props }: ButtonProps) {
  return <button className={clsx(styles.base, className)} {...props} />;
}
