import { useState, useEffect, useRef } from 'react';

const TACTICAL_ASSESSMENTS = [
  "TERRAIN: 30 DEG MOUNTAIN GRADIENT WITH WET SURFACE AND NARROW SHOULDER\nTHREAT: CONFIRMED ATGM AMBUSH CORRIDOR WITH INTERMITTENT EMITTER SPIKES\nVISIBILITY: 20M FOG CEILING, NIGHT OPTICS DEGRADED, HIGH MISIDENTIFICATION RISK\nRECOMMENDATION: REDUCE TO 20 KMH, THERMAL SCAN EVERY 15S, STAGGER CONVOY SPACING\nSTATUS: AMBER WATCH, ESCALATE TO RED ON ANY RIDGELINE MOVEMENT",
  "TERRAIN: LOOSE GRAVEL PATCHES AFTER RAIN, GORGE EDGES UNSTABLE ON LEFT FLANK\nTHREAT: POSSIBLE DRONE SPOTTER PRESENCE WITH DELAYED FIRE CONTROL HANDOFF\nVISIBILITY: 60M VARIABLE DUE TO CROSSWIND MIST, IR SIGNATURES PARTIALLY OBSCURED\nRECOMMENDATION: ACTIVATE COUNTER-UAS MODE, HARDEN COMMS, MAINTAIN DEFENSIVE ECHELON\nSTATUS: ORANGE ALERT, HOLD FIRE DISCIPLINE UNTIL POSITIVE TARGET ID",
  "TERRAIN: MUDDY ASCENT SEGMENTS WITH HIGH WHEEL SLIP PROBABILITY IN SWITCHBACKS\nTHREAT: MULTIPLE SUSPECT HEAT BLOOMS NEAR GRIDLINE 8 INDICATE PREPARED KILL ZONE\nVISIBILITY: 35M INTERMITTENT RAIN BANDS, LASER RANGEFINDING INCONSISTENT\nRECOMMENDATION: DEPLOY LEAD SCOUT DRONE, LIMIT TORQUE BURSTS, PREPARE RAPID EXFIL ROUTE\nSTATUS: RED POSTURE READY, CONVOY TO MOVE ON COMMAND NET ONLY"
];

export default function ThreatIntel({ onUpdate }) {
  const [loading, setLoading] = useState(false);
  const [intelText, setIntelText] = useState("");
  const [displayedText, setDisplayedText] = useState("");
  const intelIndex = useRef(0);

  const generateIntel = async () => {
    if (loading) return;
    setLoading(true);
    setIntelText("");
    setDisplayedText("");

    // Deterministic demo flow: no network dependency.
    await new Promise((resolve) => setTimeout(resolve, 1200));
    const nextAssessment = TACTICAL_ASSESSMENTS[intelIndex.current % TACTICAL_ASSESSMENTS.length];
    intelIndex.current += 1;
    setIntelText(nextAssessment);

    setLoading(false);
    if (onUpdate) onUpdate();
  };

  useEffect(() => {
    if (!intelText) return;
    let i = 0;
    const interval = setInterval(() => {
      setDisplayedText(intelText.slice(0, i + 1));
      i++;
      if (i >= intelText.length) clearInterval(interval);
    }, 20); // Typewriter speed
    return () => clearInterval(interval);
  }, [intelText]);

  return (
    <div className="flex flex-col h-full bg-[#111] border-2 border-[var(--color-green-military)] uppercase shadow-[0_0_10px_#00FF41]">
      <div className="px-4 py-2 border-b-2 border-[var(--color-green-military)] bg-black/50 shrink-0">
        <h2 className="font-bold text-lg">THREAT INTELLIGENCE</h2>
      </div>
      
      <div className="p-4 flex-1 flex flex-col min-h-0 overflow-y-auto">
        <button 
          onClick={generateIntel}
          disabled={loading || (intelText !== displayedText && intelText.length > 0)}
          className="w-full p-4 border-2 border-[var(--color-amber-military)] text-[var(--color-amber-military)] hover:bg-[var(--color-amber-military)] hover:text-black transition-colors font-bold tracking-widest disabled:opacity-30 disabled:cursor-not-allowed shrink-0 shadow-[0_0_10px_rgba(255,165,0,0.2)] inset-shadow">
          GENERATE MISSION INTEL
        </button>

        <div className="flex-1 min-h-[140px] bg-black border border-[var(--color-green-military)]/50 p-4 my-4 overflow-y-auto w-full flex flex-col text-sm whitespace-pre-wrap leading-relaxed shadow-inner">
          {loading ? (
            <div className="text-[var(--color-green-military)] animate-pulse tracking-widest text-lg font-bold flex items-center justify-center h-full">● ANALYZING...</div>
          ) : displayedText ? (
            <div className="text-[var(--color-green-military)]">
              {displayedText}
              <span className="typewriter-cursor"></span>
            </div>
          ) : (
            <div className="text-gray-600 flex items-center justify-center h-full">NO INTEL GENERATED</div>
          )}
        </div>

        <div className="space-y-4 shrink-0 bg-black/50 p-4 border border-gray-800">
          <div>
            <div className="flex justify-between text-sm mb-1 tracking-wider">
              <span className="text-red-500 font-bold">ATGM THREAT</span>
              <span className="text-red-500 font-bold">78%</span>
            </div>
            <div className="h-3 w-full bg-gray-900 border border-gray-700 p-[1px]">
               <div className="h-full bg-red-500 shadow-[0_0_5px_red]" style={{width: '78%'}}></div>
            </div>
          </div>
          <div>
            <div className="flex justify-between text-sm mb-1 tracking-wider">
              <span className="text-[var(--color-amber-military)] font-bold">TERRAIN RISK</span>
              <span className="text-[var(--color-amber-military)] font-bold">85%</span>
            </div>
            <div className="h-3 w-full bg-gray-900 border border-gray-700 p-[1px]">
               <div className="h-full bg-[var(--color-amber-military)] shadow-[0_0_5px_#FFA500]" style={{width: '85%'}}></div>
            </div>
          </div>
          <div>
            <div className="flex justify-between text-sm mb-1 tracking-wider">
              <span className="text-red-500 font-bold">VISIBILITY</span>
              <span className="text-red-500 font-bold">22%</span>
            </div>
            <div className="h-3 w-full bg-gray-900 border border-gray-700 p-[1px]">
               <div className="h-full bg-red-500 shadow-[0_0_5px_red]" style={{width: '22%'}}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
