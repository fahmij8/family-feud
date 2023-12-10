import { GameBox } from '@/components/game/box';

export const Game = () => {
  return (
    <div className="bg-[#a7cfdf] min-h-[400px] h-[100svh] bg-gradient-to-b from-[#a7cfdf] to-[#23538a] p-6">
      {/* gameboard */}
      <div className="[text-shadow:1px_1px_3px_rgba(0,0,0,1)] border-[5px] border-[#003c7b] p-[150px] rounded-[50%] text-center max-w-[1000px] max-h-[800px] min-w-[305px] m-auto text-white bg-[url(./assets/gameboard-bg.svg)] bg-[#0C4779] relative bg-repeat bg-center [box-shadow:0_1px_24px_1px_rgba(0,0,0,0.48)]">
        {/* box score main */}
        <GameBox className="w-[125px] h-[75px] text-4xl absolute top-5 inset-x-0 m-auto">
          10
        </GameBox>
      </div>
    </div>
  );
};
