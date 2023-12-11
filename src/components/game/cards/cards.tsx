import {
  useState,
  type Dispatch,
  type SetStateAction,
  useEffect,
  memo,
  useCallback,
} from 'react';
import { twMerge } from 'tailwind-merge';

interface CardsProps {
  answer: string;
  value: number;
  order: number;
  setScore?: Dispatch<SetStateAction<number>>;
}

const audioCorrect = new Audio('./sfx/ff-correct.wav');
const audioCorrectTop = new Audio('./sfx/ff-correct-top.mp3');

export const Cards = memo(({ answer, value, order, setScore }: CardsProps) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const onClick = useCallback(
    (forceValue?: boolean, cancelScore?: true) => {
      if (answer === '') return;
      let next: boolean;
      setIsFlipped(prev => {
        if (forceValue !== undefined) {
          next = forceValue;
          return next;
        } else {
          next = !prev;
          return next;
        }
      });
      if (!cancelScore) {
        setTimeout(() => {
          if (next) {
            if (order === 1) {
              audioCorrectTop.play();
            } else {
              audioCorrect.volume = 0.3;
              audioCorrect.play();
            }
            setScore?.(prev => prev + value);
          } else {
            setScore?.(prev => prev - value);
          }
        }, 100);
      }
    },
    [answer, order, setScore, value],
  );

  useEffect(() => {
    if (answer) {
      const callbackReset = () => {
        onClick(false, true);
      };

      const callbackOpen = () => {
        onClick(true);
      };
      window.addEventListener('FF_CLOSE_ANSWER_RESET_ROUND', callbackReset);
      window.addEventListener(`FF_OPEN_ANSWER-${order}`, callbackOpen);
      return () => {
        window.removeEventListener(
          'FF_CLOSE_ANSWER_RESET_ROUND',
          callbackReset,
        );
        window.removeEventListener(`FF_OPEN_ANSWER-${order}`, callbackOpen);
      };
    }
  }, [answer, onClick, order]);

  return (
    <div
      className={twMerge(
        '[&:not(.empty)]:cursor-pointer inline-block relative align-top h-[60px] m-1 bg-black border-[2px] border-white [perspective:800px]',
        answer === '' && 'empty',
      )}
      id="card-holder"
      onClick={() => {
        onClick();
      }}
    >
      <div
        id="card-core"
        className="absolute w-full h-full border-[2px] border-[#003c7b] leading-[50px] [transform-style:preserve-3d] [transition:transform_0.8s]"
        style={{
          background:
            'linear-gradient(to bottom, #cedbe9 0%, #aac5de 17%, #6199c7 50%, #3a84c3 51%, #419ad6 59%, #4bb8f0 71%, #3a8bc2 84%, #26558b 100%)',
          transform: isFlipped
            ? 'matrix3d(1, 0, 0, 0, 0, -1, 0, 0, 0, 0, -1, 0, 0, 0, 0, 1)'
            : '',
        }}
      >
        <div
          className="text-center"
          id="card-front"
          style={{
            backfaceVisibility: 'hidden',
          }}
        >
          {answer !== '' && (
            <span
              className="text-2xl inset-0 absolute h-fit py-0.5 rounded-[50%] w-[45px] block m-auto border-[2px] border-[#003c7b] font-semibold"
              style={{
                background:
                  'linear-gradient(to bottom, #7db9e8 0%, #207cca 49%, #2989d8 50%, #1e5799 100%)',
              }}
            >
              {order}
            </span>
          )}
        </div>
        <div
          id="card-back"
          className="text-left h-full"
          style={{
            background:
              'linear-gradient(to bottom, #7db9e8 0%, #207cca 49%, #2989d8 50%, #1e5799 100%)',
            transform:
              'matrix3d(1, 0, 0, 0, 0, -1, 0, 0, 0, 0, -1, 0, 0, 0, 0, 1)',
            backfaceVisibility: 'hidden',
          }}
        >
          <span className="text-2xl inline-block align-middle ml-2 font-medium">
            {answer}
          </span>
          <b
            className="absolute right-0 w-[45px] text-center border-l-[2px] border-[#003c7b] inset-y-0"
            style={{
              background:
                'linear-gradient(to bottom, #cedbe9 0%, #aac5de 17%, #6199c7 50%, #3a84c3 51%, #419ad6 59%, #4bb8f0 71%, #3a8bc2 84%, #26558b 100%)',
            }}
          >
            <span className="text-xl align-middle">{value}</span>
          </b>
        </div>
      </div>
    </div>
  );
});
