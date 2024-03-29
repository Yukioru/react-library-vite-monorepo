import { HTMLProps, PropsWithChildren } from 'react';
import clsx from 'clsx';

import styles from './Surface.module.css';

export function Surface({
  className,
  ...props
}: PropsWithChildren<HTMLProps<HTMLDivElement>>) {
  return (
    <div
      data-ui="Surface"
      className={clsx(styles.base, className)}
      {...props}
    />
  );
}
