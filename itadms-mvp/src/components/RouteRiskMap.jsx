import { useEffect, useRef, useState } from 'react';

export default function RouteRiskMap({ onZoneChange }) {
  const pathRef = useRef(null);
  const [vehiclePos, setVehiclePos] = useState({ x: 210, y: 205 });
  const [progress, setProgress] = useState(0);
  const lastZoneRef = useRef('GREEN');

  useEffect(() => {
    const path = pathRef.current;
    if (!path) return;

    const routeLength = path.getTotalLength();
    const routeDurationMs = 26000;
    let rafId;
    let startTs;

    const animate = (ts) => {
      if (!startTs) startTs = ts;
      const elapsed = (ts - startTs) % routeDurationMs;
      const nextProgress = elapsed / routeDurationMs;
      const point = path.getPointAtLength(nextProgress * routeLength);

      setProgress(nextProgress);
      setVehiclePos({ x: point.x, y: point.y });
      rafId = requestAnimationFrame(animate);
    };

    rafId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafId);
  }, []);

  useEffect(() => {
    let zone = 'GREEN';
    if (progress >= 0.72) {
      zone = 'RED';
    } else if (progress >= 0.40) {
      zone = 'AMBER';
    }

    if (zone !== lastZoneRef.current) {
      if ((zone === 'AMBER' || zone === 'RED') && onZoneChange) {
        onZoneChange(zone);
      }
      lastZoneRef.current = zone;
    }
  }, [progress, onZoneChange]);

  return (
    <div className="flex flex-col h-full bg-[#111] border-2 border-[var(--color-green-military)] uppercase shadow-[0_0_10px_#00FF41] relative overflow-hidden">
      <div className="px-4 py-2 border-b-2 border-[var(--color-green-military)] bg-black/50 shrink-0 flex items-center justify-between">
        <h2 className="font-bold text-lg">ROUTE RISK MAP</h2>
        <span className="text-xs tracking-wider text-[var(--color-green-military)]/80">CONVOY PATH MONITORING</span>
      </div>

      <div className="relative flex-1 bg-black/80">
        <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'linear-gradient(rgba(0,255,65,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,65,0.12) 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>

        <svg viewBox="0 0 420 220" className="w-full h-full" role="img" aria-label="Route risk map">
          <defs>
            <filter id="vehicleGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="#00FF41" floodOpacity="0.95" />
            </filter>
          </defs>

          <path
            d="M210 205 C170 190,150 170,170 150 C190 135,205 125,210 118 C220 100,250 92,255 78 C260 66,245 58,225 50 C205 42,188 34,190 24 C192 16,202 12,210 8"
            fill="none"
            stroke="#2f2f2f"
            strokeWidth="20"
            strokeLinecap="round"
          />

          <path
            d="M210 205 C170 190,150 170,170 150 C190 135,205 125,210 118"
            fill="none"
            stroke="#00FF41"
            strokeWidth="12"
            strokeLinecap="round"
          />

          <path
            d="M210 118 C220 100,250 92,255 78 C260 66,245 58,225 50"
            fill="none"
            stroke="#FFA500"
            strokeWidth="12"
            strokeLinecap="round"
          />

          <path
            d="M225 50 C205 42,188 34,190 24 C192 16,202 12,210 8"
            fill="none"
            stroke="#ef4444"
            strokeWidth="12"
            strokeLinecap="round"
          />

          <path
            ref={pathRef}
            d="M210 205 C170 190,150 170,170 150 C190 135,205 125,210 118 C220 100,250 92,255 78 C260 66,245 58,225 50 C205 42,188 34,190 24 C192 16,202 12,210 8"
            fill="none"
            stroke="transparent"
            strokeWidth="1"
          />

          <text x="32" y="192" fontSize="10" fill="#00FF41" className="font-mono" letterSpacing="0.5">
            CLEAR KM 1-7
          </text>
          <text x="272" y="116" fontSize="10" fill="#FFA500" className="font-mono" letterSpacing="0.5">
            CAUTION - FOG ZONE KM 8-12
          </text>
          <text x="248" y="30" fontSize="10" fill="#ef4444" className="font-mono" letterSpacing="0.5">
            HIGH RISK - ATGM CORRIDOR KM 14-18
          </text>

          <circle cx={vehiclePos.x} cy={vehiclePos.y} r="6" fill="#00FF41" filter="url(#vehicleGlow)">
            <animate attributeName="r" values="5;7;5" dur="1.2s" repeatCount="indefinite" />
          </circle>
        </svg>
      </div>
    </div>
  );
}
