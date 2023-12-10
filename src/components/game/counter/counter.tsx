import { useEffect, useRef } from 'react';
import { useMotionValue, useSpring } from 'framer-motion';

export default function Counter({
  value,
  direction = 'up',
}: {
  value: number;
  direction?: 'up' | 'down';
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const motionValue = useMotionValue(direction === 'down' ? value : 0);
  const springValue = useSpring(motionValue, {
    damping: 100,
    stiffness: 100,
  });

  useEffect(() => {
    motionValue.set(direction === 'down' ? 0 : value);
  }, [direction, motionValue, value]);

  useEffect(
    () =>
      springValue.on('change', latest => {
        if (ref.current) {
          ref.current.textContent = Intl.NumberFormat('en-US').format(
            latest.toFixed(0),
          );
        }
      }),
    [springValue],
  );

  return <span ref={ref}>0</span>;
}
