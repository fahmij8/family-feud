import { GameBox } from '@/components/game/box';
import { Cards } from '@/components/game/cards';
import { Counter } from '@/components/game/counter';
import { useEffect, useRef, useState } from 'react';
import FamilyFeudLogo from '@/assets/images/family-feud.png';
import { FFPayloadType, type FFPayload, type FFQuestions } from '@/types';
import { RedHeart } from '@/components/game/icons/red-heart';
import { BlackHeart } from '@/components/game/icons/black-heart';

const gameKey = 'family-feud';
const audioThemeSong = new Audio('./sfx/ff-theme-song.mp3');
const audioWinRound = new Audio('./sfx/ff-win-round.mp3');
const audioApplause = new Audio('./sfx/ff-applause.mp3');
const audioIncorrect = new Audio('./sfx/ff-incorrect.wav');
const audioIncorrectAll = new Audio('./sfx/ff-incorrect-all.mp3');

export const Game = () => {
  const broadcastChannelRef = useRef<BroadcastChannel | null>(null);
  const [item, setItem] = useState<FFQuestions[number] | null>(null);
  const [gameScore, setGameScore] = useState(0);
  const [teamAScore, setTeamAScore] = useState(0);
  const [teamBScore, setTeamBScore] = useState(0);
  const [playingTeam, setPlayingTeam] = useState<'A' | 'B' | null>(null);
  const [life, setLife] = useState(5);

  useEffect(() => {
    broadcastChannelRef.current = new BroadcastChannel(gameKey);

    const callback = (event: MessageEvent<FFPayload>) => {
      if (event.data.type === FFPayloadType.START_GAME) {
        setItem(event.data.payload.question);
        window.dispatchEvent(new Event('FF_CLOSE_ANSWER_RESET_ROUND'));
      }

      if (event.data.type === FFPayloadType.NEXT_QUESTION) {
        setItem(event.data.payload.question);
        setGameScore(0);
        setLife(5);
        window.dispatchEvent(new Event('FF_CLOSE_ANSWER_RESET_ROUND'));
      }

      if (event.data.type === FFPayloadType.RESET_GAME) {
        setItem(null);
        setGameScore(0);
        setTeamAScore(0);
        setTeamBScore(0);
        setLife(5);
        window.dispatchEvent(new Event('FF_CLOSE_ANSWER_RESET_ROUND'));
      }

      if (event.data.type === FFPayloadType.OPEN_ANSWER) {
        window.dispatchEvent(
          new Event(`FF_OPEN_ANSWER-${event.data.payload.answerId}`),
        );
      }

      if (event.data.type === FFPayloadType.SOUND_APPLAUSE) {
        audioApplause.volume = 0.3;
        audioApplause.play();
      }

      if (event.data.type === FFPayloadType.SOUND_INCORRECT) {
        setLife(prevLife => prevLife - 1);
        audioIncorrect.volume = 0.3;
        audioIncorrect.play();
      }

      if (event.data.type === FFPayloadType.SOUND_INCORRECT_ALL) {
        setLife(0);
        audioIncorrectAll.volume = 0.3;
        audioIncorrectAll.play();
      }

      if (event.data.type === FFPayloadType.BEGIN_CLOCK) {
        // todo: begin clock
      }

      if (event.data.type === FFPayloadType.STOP_CLOCK) {
        // todo: stop clock
      }

      if (event.data.type === FFPayloadType.WINNER) {
        audioThemeSong.volume = 0.2;
        audioThemeSong.play();
      }

      if (event.data.type === FFPayloadType.TEAM_A_PLAY) {
        setLife(5);
        setPlayingTeam('A');
      }

      if (event.data.type === FFPayloadType.TEAM_B_PLAY) {
        setLife(5);
        setPlayingTeam('B');
      }
    };

    broadcastChannelRef.current.addEventListener('message', callback);

    return () => {
      broadcastChannelRef.current?.removeEventListener('message', callback);
      broadcastChannelRef.current?.close();
    };
  }, []);

  return (
    <div className="bg-[#a7cfdf] min-h-[400px] h-[100svh] bg-gradient-to-b from-[#a7cfdf] to-[#23538a] py-10 sm:block hidden">
      <img
        src={FamilyFeudLogo}
        alt="Family Feud Logo"
        className="max-w-[160px] w-full absolute top-5 left-5"
      />
      <div className="absolute top-5 right-5 text-right">
        <p className="font-bold text-[#003C7B]">Playing Team : </p>
        <p className="text-[#003C7B]">
          {playingTeam ? `Team ${playingTeam}` : '-'}
        </p>
        {/* map the life */}
        <p className="font-bold text-[#003C7B]">Life : </p>
        {playingTeam ? (
          <div className="flex items-center justify-end gap-x-1">
            {Array.from({ length: life }).map((_, index) => (
              <RedHeart key={`life-${index}`} />
            ))}
            {Array.from({ length: 5 - life }).map((_, index) => (
              <BlackHeart key={`life-${index}`} />
            ))}
          </div>
        ) : (
          <p className="font-bold text-[#003C7B]">-</p>
        )}
      </div>
      <div
        className="[text-shadow:1px_1px_3px_rgba(0,0,0,1)] border-[5px] border-[#003c7b] py-[120px] px-[140px] rounded-[50%] text-center max-w-[1300px] max-h-[800px] min-w-[305px] m-auto text-white bg-[url(./assets/gameboard-bg.svg)] bg-[#0C4779] relative bg-repeat bg-center [box-shadow:0_1px_24px_1px_rgba(0,0,0,0.48)]"
        id="gameboard"
      >
        <GameBox
          className="w-[125px] text-5xl absolute top-5 inset-x-0 m-auto"
          id="current-round-score"
        >
          <Counter value={gameScore} />
        </GameBox>
        <GameBox
          className="w-[90px] h-fit text-3xl absolute inset-y-0 left-10 m-auto"
          id="team-a-score"
        >
          <Counter value={teamAScore} />
        </GameBox>
        <GameBox
          className="w-[90px] h-fit text-3xl absolute inset-y-0 right-10 m-auto"
          id="team-b-score"
        >
          <Counter value={teamBScore} />
        </GameBox>
        <div
          className="max-w-[900px] w-auto m-auto text-center text-2xl text-[#003c7b] border border-black bg-[#deeeff] my-4 [box-shadow:inset_0_1px_24px_1px_rgba(0,0,0,0.48)] px-3 py-9 font-medium"
          id="question"
        >
          <span className="inline-block align-middle leading-normal [text-shadow:initial]">
            {item ? (
              item.question
            ) : (
              <span>
                Welcome to Family Feud!
                <br />
                Waiting for the host to start the game...
              </span>
            )}
          </span>
        </div>
        <div
          className="bg-black p-1 flex flex-row [box-shadow:0_1px_24px_1px_rgba(0,0,0,0.48)] mb-8"
          id="answers"
        >
          <div className="flex-1 flex flex-col">
            {item ? (
              <>
                {item.answers.slice(0, 4).map((answer, index) => (
                  <Cards
                    key={`answer-${index}`}
                    answer={answer.answer}
                    value={answer.value}
                    order={index + 1}
                    setScore={setGameScore}
                  />
                ))}
                {item.answers.slice(0, 4).length < 4 &&
                  Array.from({
                    length: 4 - item.answers.slice(0, 4).length,
                  }).map((_, index) => (
                    <Cards
                      key={`empty-${index}`}
                      answer=""
                      value={0}
                      order={0}
                    />
                  ))}
              </>
            ) : (
              <>
                {Array.from({ length: 4 }).map((_, index) => (
                  <Cards key={`empty-${index}`} answer="" value={0} order={0} />
                ))}
              </>
            )}
          </div>
          <div className="flex-1 flex flex-col">
            {item ? (
              <>
                {item.answers.slice(4, 7).map((answer, index) => (
                  <Cards
                    key={`answer-${index}`}
                    answer={answer.answer}
                    value={answer.value}
                    order={index + 5}
                    setScore={setGameScore}
                  />
                ))}
                {item.answers.slice(4, 7).length < 4 &&
                  Array.from({
                    length: 4 - item.answers.slice(4, 7).length,
                  }).map((_, index) => (
                    <Cards
                      key={`empty-${index}`}
                      answer=""
                      value={0}
                      order={0}
                      setScore={setGameScore}
                    />
                  ))}
              </>
            ) : (
              <>
                {Array.from({ length: 4 }).map((_, index) => (
                  <Cards key={`empty-${index}`} answer="" value={0} order={0} />
                ))}
              </>
            )}
          </div>
        </div>
        <div
          className="flex gap-x-4 justify-center items-center absolute bottom-16 inset-x-0 m-auto"
          id="control"
        >
          <button
            className="rounded-[50px_0_0_50px] border-[3px] border-white text-2xl p-2 px-6"
            style={{
              background:
                'linear-gradient(to bottom, #7db9e8 0%, #207cca 49%, #2989d8 50%, #1e5799 100%)',
            }}
            onClick={() => {
              setTeamAScore(prevScore => prevScore + gameScore);
              window.dispatchEvent(new Event('FF_CLOSE_ANSWER_RESET_ROUND'));
              setGameScore(0);
              audioWinRound.play();
            }}
          >
            Award Team A
          </button>
          <button
            className="rounded-[0_50px_50px_0] border-[3px] border-white text-2xl p-2 px-6"
            style={{
              background:
                'linear-gradient(to bottom, #7db9e8 0%, #207cca 49%, #2989d8 50%, #1e5799 100%)',
            }}
            onClick={() => {
              setTeamBScore(prevScore => prevScore + gameScore);
              window.dispatchEvent(new Event('FF_CLOSE_ANSWER_RESET_ROUND'));
              setGameScore(0);
              audioWinRound.play();
            }}
          >
            Award Team B
          </button>
        </div>
        d
      </div>
    </div>
  );
};
