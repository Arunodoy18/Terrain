import { useState, useEffect, useRef } from 'react';

export default function StabilityPanel({ onCritical }) {
  const [gradient, setGradient] = useState(15);
  const [wetness, setWetness] = useState(20);
  const [speed, setSpeed] = useState(40);
  const [hillAssist, setHillAssist] = useState(false);
  const [wetMode, setWetMode] = useState(false);

  // Formula: slipRisk = (gradient * 0.4) + (wetness * 0.4) + (speed * 0.2)
  const slipRisk = Math.min(100, Math.round((gradient * 0.4) + (wetness * 0.4) + (speed * 0.2)));
  
  let status = 'SAFE';
  let statusColor = 'text-[var(--color-green-military)]';
  if (slipRisk > 60) { status = 'CRITICAL'; statusColor = 'text-red-500 animate-pulse'; }
  else if (slipRisk > 30) { status = 'CAUTION'; statusColor = 'text-[var(--color-amber-military)]'; }

  const lastStatus = useRef(status);

  useEffect(() => {
    if (status === 'CRITICAL' && lastStatus.current !== 'CRITICAL') {
      onCritical();
    }
    lastStatus.current = status;
  }, [status, onCritical]);

  return (
    <div className="flex flex-col h-full bg-[#111] border-2 border-[var(--color-green-military)] uppercase shadow-[0_0_10px_#00FF41]">
      <div className="px-4 py-2 border-b-2 border-[var(--color-green-military)] bg-black/50 shrink-0">
        <h2 className="font-bold text-lg">STABILITY MATRIX</h2>
      </div>
      <div className="flex-1 p-6 flex flex-col justify-between overflow-y-auto">
        
        <div className="space-y-6">
          <div>
            <div className="flex justify-between mb-2"><span>GRADIENT</span> <span>{gradient}°</span></div>
            <input type="range" min="0" max="45" value={gradient} onChange={e => setGradient(Number(e.target.value))} className="w-full accent-[#00FF41] cursor-crosshair h-2 bg-gray-800 appearance-none outline-none" />
          </div>
          <div>
            <div className="flex justify-between mb-2"><span>SURFACE WETNESS</span> <span>{wetness}%</span></div>
            <input type="range" min="0" max="100" value={wetness} onChange={e => setWetness(Number(e.target.value))} className="w-full accent-[#00FF41] cursor-crosshair h-2 bg-gray-800 appearance-none outline-none" />
          </div>
          <div>
            <div className="flex justify-between mb-2"><span>VEHICLE SPEED</span> <span>{speed} KM/H</span></div>
            <input type="range" min="0" max="80" value={speed} onChange={e => setSpeed(Number(e.target.value))} className="w-full accent-[#00FF41] cursor-crosshair h-2 bg-gray-800 appearance-none outline-none" />
          </div>
        </div>

        <div className="border border-[var(--color-green-military)]/50 p-4 bg-black my-6 relative">
          {status === 'CRITICAL' && <div className="absolute inset-0 bg-red-900/20 animate-pulse pointer-events-none"></div>}
          <div className="flex justify-between mb-2 text-xl border-b border-[#00FF41]/20 pb-2">
            <span>SLIP RISK SCORE:</span>
            <span className={`font-bold ${statusColor}`}>{slipRisk}/100</span>
          </div>
          <div className="flex justify-between mb-2 text-sm text-gray-300 pt-2">
            <span>RECOMMENDED TORQUE REDUCTION:</span>
            <span className="text-[var(--color-amber-military)]">{Math.max(0, Math.floor((slipRisk - 30) * 1.5))}%</span>
          </div>
          <div className="flex justify-between text-sm text-gray-300">
            <span>TRACTION STATUS:</span>
            <span className={`font-bold ${statusColor}`}>{status}</span>
          </div>
        </div>

        <div className="flex gap-4 mt-auto">
          <button 
            onClick={() => setHillAssist(!hillAssist)} 
            className={`flex-1 py-3 px-2 border-2 transition-all font-bold tracking-wider ${hillAssist ? 'bg-[var(--color-green-military)] text-black border-[var(--color-green-military)] shadow-[0_0_10px_#00FF41]' : 'border-gray-700 text-gray-500 hover:border-gray-500'}`}>
            HILL DESCENT: {hillAssist ? 'ON' : 'OFF'}
          </button>
          <button 
            onClick={() => setWetMode(!wetMode)} 
            className={`flex-1 py-3 px-2 border-2 transition-all font-bold tracking-wider ${wetMode ? 'bg-[var(--color-green-military)] text-black border-[var(--color-green-military)] shadow-[0_0_10px_#00FF41]' : 'border-gray-700 text-gray-500 hover:border-gray-500'}`}>
            WET MODE: {wetMode ? 'ON' : 'OFF'}
          </button>
        </div>

      </div>
    </div>
  );
}
