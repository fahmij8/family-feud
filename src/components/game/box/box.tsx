import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';

interface GameBoxProps extends ComponentPropsWithoutRef<'div'> {
  children: ReactNode;
}

export const GameBox = ({ children, className, ...rest }: GameBoxProps) => {
  return (
    <div
      {...rest}
      className={twMerge(
        'text-white p-4 bg-gradient-to-b from-[#7db9e8] via-[#2989d8] to-[#1e5799] border-2 border-white [box-shadow:inset_0_1px_24px_1px_rgba(0,_0,_0,_0.48)]',
        className,
      )}
    >
      {children}
    </div>
  );
};
