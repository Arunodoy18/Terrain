import { useEffect, useRef, useState } from 'react';

const MAP_PATH =
  'M80 112 C120 120,152 124,180 120 C246 110,302 102,360 105 C410 98,452 92,490 88 C530 94,555 110,580 120 C620 120,646 96,670 70';

const CITIES = [
  { id: 'GANGTOK', x: 80, y: 112, color: '#22c55e', risk: 'GREEN', radius: 6 },
  { id: 'SILIGURI', x: 180, y: 120, color: '#f59e0b', risk: 'AMBER', radius: 4 },
  { id: 'GUWAHATI', x: 360, y: 105, color: '#f59e0b', risk: 'AMBER', radius: 4 },
  { id: 'TEZPUR', x: 490, y: 88, color: '#ef4444', risk: 'RED', radius: 4 },
  { id: 'DIMAPUR', x: 580, y: 120, color: '#ef4444', risk: 'RED', radius: 4 },
  { id: 'ITANAGAR', x: 670, y: 70, color: '#ef4444', risk: 'RED', radius: 5 },
];

export default function RouteRiskMap({ onZoneChange }) {
  const pathRef = useRef(null);
  const lastZoneRef = useRef('GREEN');
  const [vehiclePos, setVehiclePos] = useState({ x: 80, y: 112 });

  useEffect(() => {
    const path = pathRef.current;
    if (!path) return;

    const routeLength = path.getTotalLength();
    const routeDurationMs = 30000;
    let rafId;
    let startTs;

    const animate = (ts) => {
      if (!startTs) startTs = ts;
      const elapsed = (ts - startTs) % routeDurationMs;
      const nextProgress = elapsed / routeDurationMs;
      const point = path.getPointAtLength(nextProgress * routeLength);
      const km = nextProgress * 520;

      setVehiclePos({ x: point.x, y: point.y });

      let zone = 'GREEN';
      if (km >= 340) zone = 'RED';
      else if (km >= 85) zone = 'AMBER';

      if (zone !== lastZoneRef.current) {
        if ((zone === 'AMBER' || zone === 'RED') && onZoneChange) {
          onZoneChange(zone);
        }
        lastZoneRef.current = zone;
      }

      rafId = requestAnimationFrame(animate);
    };

    rafId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafId);
  }, [onZoneChange]);

  return (
    <div className="flex flex-col h-full bg-[#0A0A0A] border-2 border-[var(--color-green-military)] uppercase shadow-[0_0_10px_#00FF41] overflow-hidden">
      <div className="px-4 py-2 border-b-2 border-[var(--color-green-military)] bg-black/50 shrink-0 flex items-center justify-between">
        <h2 className="font-bold text-sm md:text-base tracking-wider">ROUTE RISK MAP | NH-10 -&gt; NH-27 -&gt; NH-15</h2>
        <div className="flex items-center gap-2 text-[10px] md:text-xs tracking-wider">
          <span className="text-[var(--color-green-military)]/80">CONVOY PATH MONITORING</span>
          <span className="h-2.5 w-2.5 rounded-full bg-red-500 animate-pulse"></span>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-[minmax(0,1fr)_230px]">
        <div className="relative border-r border-[var(--color-green-military)]/30">
          <div
            className="absolute inset-0 opacity-25"
            style={{
              backgroundImage:
                'linear-gradient(rgba(0,255,65,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,65,0.12) 1px, transparent 1px)',
              backgroundSize: '20px 20px',
            }}
          ></div>

          <svg viewBox="0 0 760 170" className="w-full h-full font-mono" role="img" aria-label="Northeast India convoy risk route map">
            <rect x="42" y="72" width="145" height="62" fill="rgba(34,197,94,0.15)" stroke="rgba(34,197,94,0.5)" strokeWidth="1" />
            <text x="50" y="86" fontSize="9" fill="#22c55e">ZONE ALPHA - CLEAR | KM 0-85</text>

            <rect x="188" y="58" width="315" height="74" fill="rgba(245,158,11,0.18)" stroke="rgba(245,158,11,0.55)" strokeWidth="1" opacity="0.28">
              <animate attributeName="opacity" values="0.2;0.45;0.2" dur="1.6s" repeatCount="indefinite" />
            </rect>
            <text x="196" y="73" fontSize="9" fill="#f59e0b">ZONE BRAVO - FOG RISK | KM 85-340</text>

            <rect x="504" y="42" width="215" height="90" fill="rgba(239,68,68,0.18)" stroke="rgba(239,68,68,0.55)" strokeWidth="1" opacity="0.3">
              <animate attributeName="opacity" values="0.22;0.55;0.22" dur="1.2s" repeatCount="indefinite" />
            </rect>
            <text x="512" y="57" fontSize="9" fill="#ef4444">ZONE CHARLIE - HIGH RISK ATGM CORRIDOR | KM 340-520</text>

            <path d={MAP_PATH} fill="none" stroke="#1a3a1a" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" opacity="0.9" />
            <path d={MAP_PATH} fill="none" stroke="#00FF41" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" opacity="0.9" />
            <path ref={pathRef} d={MAP_PATH} fill="none" stroke="transparent" strokeWidth="1" />

            <text x="128" y="108" fontSize="8" fill="#00FF41" opacity="0.85">NH-10</text>
            <text x="304" y="86" fontSize="8" fill="#00FF41" opacity="0.85">NH-27</text>
            <text x="560" y="88" fontSize="8" fill="#00FF41" opacity="0.85">NH-15</text>

            {CITIES.map((city) => (
              <g key={city.id}>
                <circle cx={city.x} cy={city.y} r={city.radius + 3} fill={city.color} opacity="0.15">
                  <animate attributeName="r" values={`${city.radius + 2};${city.radius + 5};${city.radius + 2}`} dur="1.5s" repeatCount="indefinite" />
                </circle>
                <circle cx={city.x} cy={city.y} r={city.radius} fill={city.color}>
                  <title>{`${city.id} | ${city.risk}`}</title>
                </circle>
                <text x={city.x + 8} y={city.y - 6} fontSize="8" fill="#00FF41" letterSpacing="0.3">
                  {city.id}
                </text>
              </g>
            ))}

            <circle cx={vehiclePos.x} cy={vehiclePos.y} r="5" fill="#22c55e" stroke="#86efac" strokeWidth="1.5" filter="url(#vehicleGlow)">
              <animate attributeName="r" values="4.5;6;4.5" dur="0.9s" repeatCount="indefinite" />
            </circle>
            <text x={Math.min(vehiclePos.x + 10, 624)} y={Math.max(vehiclePos.y - 12, 16)} fontSize="8" fill="#86efac" letterSpacing="0.4">
              BRAVO-7 CURRENT POSITION
            </text>

            <defs>
              <filter id="vehicleGlow" x="-50%" y="-50%" width="200%" height="200%">
                <feDropShadow dx="0" dy="0" stdDeviation="2.5" floodColor="#22c55e" floodOpacity="0.95" />
              </filter>
            </defs>
          </svg>
        </div>

        <div className="p-2.5 text-[10px] leading-4 tracking-wide bg-black/40 border-l border-[var(--color-green-military)]/20">
          <div className="space-y-1.5 mb-2.5">
            <div className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-[#22c55e]"></span>GANGTOK - BASE</div>
            <div className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-[#f59e0b]"></span>SILIGURI - CHECKPOINT 1</div>
            <div className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-[#f59e0b]"></span>GUWAHATI - CHECKPOINT 2</div>
            <div className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-[#ef4444]"></span>TEZPUR - HIGH ALERT</div>
            <div className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-[#ef4444]"></span>DIMAPUR - HIGH ALERT</div>
            <div className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-[#ef4444]"></span>ITANAGAR - DESTINATION</div>
          </div>

          <div className="border-t border-[var(--color-green-military)]/30 pt-2 space-y-0.5 text-[var(--color-green-military)]/90">
            <div>ROUTE DISTANCE: 520 KM</div>
            <div>ESTIMATED TIME: 14 HRS</div>
            <div>RISK LEVEL: CRITICAL</div>
            <div>ACTIVE THREATS: 3 DETECTED</div>
          </div>
        </div>
      </div>
    </div>
  );
}
