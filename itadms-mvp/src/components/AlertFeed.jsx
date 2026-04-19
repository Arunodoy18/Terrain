import { useEffect, useRef } from 'react';

export default function AlertFeed({ alerts }) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [alerts]);

  return (
    <div className="flex flex-col h-full bg-[#111] border-2 border-[var(--color-green-military)] uppercase shadow-[0_0_10px_#00FF41]">
      <div className="px-4 py-2 border-b-2 border-[var(--color-green-military)] bg-black/50 shrink-0">
        <h2 className="font-bold text-lg">TERMINAL FEED DECRYPTED</h2>
      </div>
      <div ref={containerRef} className="flex-1 p-4 overflow-y-auto bg-black border-t border-black text-sm space-y-2">
        {alerts.slice(-20).map((alert, i) => {
          let color = 'text-[var(--color-green-military)]';
          if (alert.type === 'DANGER') color = 'text-red-500 font-bold bg-red-900/20';
          else if (alert.type === 'WARNING') color = 'text-[var(--color-amber-military)] font-bold';
          else if (alert.type === 'CAUTION') color = 'text-yellow-400';

          return (
            <div key={alert.id || i} className={`px-2 py-1 flex gap-3 ${color}`}>
              <span className="opacity-60 shrink-0">[{alert.time}]</span> 
              <span className="font-bold shrink-0 w-24">[{alert.type}]</span> 
              <span className="break-words">{alert.message}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
