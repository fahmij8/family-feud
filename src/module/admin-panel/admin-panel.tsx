import { Button } from '@nextui-org/button';
import { Decoration } from '@/components/ui/decoration';
import FamilyFeudLogo from '@/assets/images/family-feud.png';
import { useEffect, useRef, useState } from 'react';

const gameKey = 'family-feud';

export const AdminPanel = () => {
  const [hasGameStarted, setHasGameStarted] = useState(false);
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
      <h1 className="text-3xl font-bold">Family Feud Admin Panel</h1>
      <div className="flex gap-x-5">
        <Button
          color="primary"
          className="mt-2 disabled:opacity-60 hover:disabled:opacity-60"
          onClick={() => {
            sessionStorage.setItem('gameKey', gameKey);
            setHasGameStarted(true);
            window.open('/game', '_blank');
          }}
          disabled={hasGameStarted}
        >
          Open Game
        </Button>
        <Button
          color="primary"
          className="mt-2 disabled:opacity-60 hover:disabled:opacity-60"
          disabled={!hasGameStarted}
          onClick={() => {
            broadcastChannelRef.current?.postMessage?.({
              type: 'start-game',
            });
          }}
        >
          Start Game
        </Button>
      </div>
    </div>
  );
};
