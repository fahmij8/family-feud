import { Button } from '@nextui-org/button';
import { Decoration } from '@/components/ui/decoration';
import FamilyFeudLogo from '@/assets/images/family-feud.png';
import { useEffect, useRef, useState } from 'react';
import {
  FFPayloadType,
  type FFPayloadStartGame,
  type FFQuestions,
  type FFPayloadOpenAnswer,
  type FFPayloadSoundIncorrect,
  type FFPayloadSoundIncorrectAll,
  type FFPayloadNextQuestion,
  type FFPayloadResetGame,
  type FFPayloadSoundApplause,
  type FFPayloadBeginClock,
  type FFPayloadStopClock,
  type FFPayloadWinner,
  type FFPayloadTeamAPlay,
  type FFPayloadTeamBPlay,
} from '@/types';
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from '@nextui-org/table';

const gameKey = 'family-feud';

const item = {
  question:
    'Name something the police do at the station to those who are arrested',
  answers: [
    {
      answer: 'Fingerprint Them',
      value: 56,
    },
    {
      answer: 'Book Them',
      value: 20,
    },
    {
      answer: 'Question',
      value: 5,
    },
    {
      answer: 'Mug Shot',
      value: 5,
    },
    {
      answer: 'Give One Phone Call',
      value: 3,
    },
    {
      answer: 'Put Then in Cell',
      value: 3,
    },
    {
      answer: 'Read Their Rights',
      value: 2,
    },
  ],
};

export const AdminPanel = () => {
  const [isGameOpened, setIsGameOpened] = useState(false);
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [question, setQuestion] = useState<FFQuestions[number] | null>(null);
  const broadcastChannelRef = useRef<BroadcastChannel | null>(null);

  useEffect(() => {
    broadcastChannelRef.current = new BroadcastChannel(gameKey);

    return () => {
      broadcastChannelRef.current?.close();
    };
  }, []);

  return (
    <div className="py-10 flex flex-col justify-center items-center relative gap-y-5">
      <Decoration />
      <img
        src={FamilyFeudLogo}
        alt="Family Feud Logo"
        className="max-w-xs w-full"
      />
      <h1 className="text-3xl font-bold">Family Feud Game</h1>
      <div className="flex gap-x-5">
        <Button
          color="primary"
          className="mt-2 disabled:opacity-60 hover:disabled:opacity-60"
          onClick={() => {
            sessionStorage.setItem('gameKey', gameKey);
            setIsGameOpened(true);
            window.open('/game', '_blank');
          }}
          disabled={isGameOpened}
        >
          Open Game
        </Button>
        <Button
          color="primary"
          className="mt-2 disabled:opacity-60 hover:disabled:opacity-60"
          disabled={!isGameOpened || isGameStarted}
          onClick={() => {
            setIsGameStarted(true);
            // do fetch question
            // do shuffle question
            setQuestion(item);
            broadcastChannelRef.current?.postMessage?.({
              type: FFPayloadType.START_GAME,
              payload: {
                question: item,
              },
            } as FFPayloadStartGame);
          }}
        >
          Start Game
        </Button>
        {isGameStarted && (
          <>
            <Button
              color="secondary"
              className="mt-2 disabled:opacity-60 hover:disabled:opacity-60"
              onClick={() => {
                broadcastChannelRef.current?.postMessage?.({
                  type: FFPayloadType.NEXT_QUESTION,
                  payload: {
                    question: item,
                  },
                } as FFPayloadNextQuestion);
                setQuestion(item);
              }}
            >
              Next Question
            </Button>
            <Button
              color="danger"
              className="mt-2 disabled:opacity-60 hover:disabled:opacity-60"
              onClick={() => {
                broadcastChannelRef.current?.postMessage?.({
                  type: FFPayloadType.RESET_GAME,
                } as FFPayloadResetGame);
                setIsGameStarted(false);
              }}
            >
              Reset Game
            </Button>
          </>
        )}
      </div>
      {isGameStarted && (
        <div className="flex flex-col gap-y-4 mt-8">
          <div className="flex flex-col gap-y-2">
            <h1 className="text-2xl font-bold">Question</h1>
            <span className="text-lg font-medium">{question?.question}</span>
          </div>
          <Table aria-label="Family Feud Question & Answer">
            <TableHeader>
              <TableColumn key="answer">ANSWER</TableColumn>
              <TableColumn key="points">POINTS</TableColumn>
              <TableColumn key="actions">ACTIONS</TableColumn>
            </TableHeader>
            {question === null ? (
              <TableBody emptyContent={'No rows to display.'}>{[]}</TableBody>
            ) : (
              <TableBody>
                {question.answers.map((answer, index) => (
                  <TableRow key={`answer-${index}`}>
                    <TableCell key={`answer-${index}-answer`}>
                      {answer.answer}
                    </TableCell>
                    <TableCell key={`answer-${index}-value`}>
                      {answer.value}
                    </TableCell>
                    <TableCell align="right" key={`answer-${index}-actions`}>
                      <Button
                        size="sm"
                        color="primary"
                        className="disabled:opacity-60 hover:disabled:opacity-60"
                        onClick={() => {
                          broadcastChannelRef.current?.postMessage?.({
                            type: FFPayloadType.OPEN_ANSWER,
                            payload: {
                              answerId: index + 1,
                            },
                          } as FFPayloadOpenAnswer);
                        }}
                      >
                        Open
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            )}
          </Table>
          <div className="flex flex-col gap-y-2">
            <h1 className="text-2xl font-bold">Playing Team</h1>
            <div className="flex gap-x-2">
              <Button
                color="primary"
                className="mt-2 disabled:opacity-60 hover:disabled:opacity-60"
                onClick={() => {
                  broadcastChannelRef.current?.postMessage?.({
                    type: FFPayloadType.TEAM_A_PLAY,
                  } as FFPayloadTeamAPlay);
                }}
              >
                Team A
              </Button>
              <Button
                color="primary"
                className="mt-2 disabled:opacity-60 hover:disabled:opacity-60"
                onClick={() => {
                  broadcastChannelRef.current?.postMessage?.({
                    type: FFPayloadType.TEAM_B_PLAY,
                  } as FFPayloadTeamBPlay);
                }}
              >
                Team B
              </Button>
            </div>
          </div>
          <div className="flex flex-col gap-y-2">
            <h1 className="text-2xl font-bold">Sound Control</h1>
            <div className="flex gap-x-2">
              <Button
                color="default"
                className="mt-2 disabled:opacity-60 hover:disabled:opacity-60"
                onClick={() => {
                  broadcastChannelRef.current?.postMessage?.({
                    type: FFPayloadType.BEGIN_CLOCK,
                  } as FFPayloadBeginClock);
                }}
              >
                Play Clock
              </Button>
              <Button
                color="default"
                className="mt-2 disabled:opacity-60 hover:disabled:opacity-60"
                onClick={() => {
                  broadcastChannelRef.current?.postMessage?.({
                    type: FFPayloadType.STOP_CLOCK,
                  } as FFPayloadStopClock);
                }}
              >
                Stop Clock
              </Button>
            </div>
            <div className="flex gap-x-2">
              <Button
                color="warning"
                className="mt-2 disabled:opacity-60 hover:disabled:opacity-60"
                onClick={() => {
                  broadcastChannelRef.current?.postMessage?.({
                    type: FFPayloadType.SOUND_INCORRECT,
                  } as FFPayloadSoundIncorrect);
                }}
              >
                Play Incorrect
              </Button>
              <Button
                color="danger"
                className="mt-2 disabled:opacity-60 hover:disabled:opacity-60"
                onClick={() => {
                  broadcastChannelRef.current?.postMessage?.({
                    type: FFPayloadType.SOUND_INCORRECT_ALL,
                  } as FFPayloadSoundIncorrectAll);
                }}
              >
                Play Incorrect All
              </Button>
              <Button
                color="success"
                className="mt-2 disabled:opacity-60 hover:disabled:opacity-60"
                onClick={() => {
                  broadcastChannelRef.current?.postMessage?.({
                    type: FFPayloadType.SOUND_APPLAUSE,
                  } as FFPayloadSoundApplause);
                }}
              >
                Play Applause
              </Button>
              <Button
                color="success"
                className="mt-2 disabled:opacity-60 hover:disabled:opacity-60"
                onClick={() => {
                  broadcastChannelRef.current?.postMessage?.({
                    type: FFPayloadType.WINNER,
                  } as FFPayloadWinner);
                }}
              >
                Play Winner
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
