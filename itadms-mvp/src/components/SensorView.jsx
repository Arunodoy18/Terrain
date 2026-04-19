import { useRef, useEffect, useState } from 'react';

export default function SensorView({ onAlertChange }) {
  const canvasRef = useRef(null);
  const [alertLevel, setAlertLevel] = useState('SAFE');
  const [gorgeWarning, setGorgeWarning] = useState(false);

  const lastAlertLevel = useRef('SAFE');

  // Trigger alert propagation upward when alert level escalates
  useEffect(() => {
    if (alertLevel !== lastAlertLevel.current) {
      if (alertLevel !== 'SAFE') {
        const severity = alertLevel === 'DANGER' ? 3 : alertLevel === 'WARNING' ? 2 : 1;
        const lastSev = lastAlertLevel.current === 'DANGER' ? 3 : lastAlertLevel.current === 'WARNING' ? 2 : lastAlertLevel.current === 'CAUTION' ? 1 : 0;
        
        if (severity > lastSev) onAlertChange(alertLevel);
      }
      lastAlertLevel.current = alertLevel;
    }
  }, [alertLevel, onAlertChange]);

  const speed = alertLevel === 'DANGER' ? 20 : 60;

  // Request Animation Frame Canvas Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationId;
    
    let obstacles = [];
    let startTimestamp = null;
    let lastObstacleSpawn = 0;
    let gorgeFlashing = false;
    let driftOffset = 0;
    let currentAlert = 'SAFE';

    const cw = canvas.width;
    const ch = canvas.height;
    const cx = cw / 2;
    const cy = ch / 2 + 50;

    const drawRing = (radius, color, ts, x, y, phase = 0) => {
      const opacity = 0.55 + Math.sin(ts * 0.01 + phase) * 0.25;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.globalAlpha = opacity;
      ctx.stroke();
      ctx.globalAlpha = 1;
    };

    const loop = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const elapsed = timestamp - startTimestamp;

      // Draw Base Road
      ctx.fillStyle = '#111';
      ctx.fillRect(0, 0, cw, ch);

      // Draw Gorge Zones
      ctx.fillStyle = 'rgba(255,0,0,0.15)';
      ctx.fillRect(0, 0, 40, ch);
      ctx.fillRect(cw - 40, 0, 40, ch);

      ctx.strokeStyle = '#FF0000';
      ctx.strokeRect(0, 0, 40, ch);
      ctx.strokeRect(cw - 40, 0, 40, ch);

      // Vehicle Drift Dynamics
      driftOffset = Math.sin(elapsed * 0.001) * 60; 
      const vX = cx + driftOffset;
      
      gorgeFlashing = (vX < 60 || vX > cw - 60);

      // Sensor Rings centered on vehicle
      drawRing(80, '#FFFF00', elapsed, vX, cy, 0);
      drawRing(140, '#FFA500', elapsed, vX, cy, 0.8);
      drawRing(200, '#FF0000', elapsed, vX, cy, 1.6);

      // Spawn obstacle periodically (Every 4 seconds = 4000ms)
      if (elapsed - lastObstacleSpawn > 4000) {
        obstacles.push({ x: cx + (Math.random()*80 - 40), y: -20, vx: 0 });
        lastObstacleSpawn = elapsed;
      }

      currentAlert = 'SAFE';

      // Update & Draw Obstacles
      for (let i = obstacles.length - 1; i >= 0; i--) {
        let obs = obstacles[i];
        const deltaX = vX - obs.x;
        obs.vx = deltaX * 0.02;
        obs.x += obs.vx;
        obs.y += 1.5; // Approach speed
        
        const dist = Math.hypot(obs.x - vX, Math.abs(obs.y - cy));
        
        if (dist <= 30) currentAlert = 'DANGER';
        else if (dist <= 60 && currentAlert !== 'DANGER') currentAlert = 'WARNING';
        else if (dist <= 125 && currentAlert === 'SAFE') currentAlert = 'CAUTION';

        // Drat specific threat
        ctx.fillStyle = '#FF0000';
        ctx.shadowColor = '#FF0000';
        ctx.shadowBlur = 10;
        ctx.fillRect(obs.x - 8, obs.y - 8, 16, 16);
        ctx.shadowBlur = 0;

        if (obs.y > ch + 20) obstacles.splice(i, 1);
      }

      // Draw Vehicle
      ctx.fillStyle = '#00FF41';
      ctx.shadowColor = '#00FF41';
      ctx.shadowBlur = 15;
      ctx.fillRect(vX - 10, cy - 20, 20, 40);
      ctx.shadowBlur = 0;

      // Flush States to DOM React
      setAlertLevel(currentAlert);
      setGorgeWarning(gorgeFlashing);

      animationId = requestAnimationFrame(loop);
    };

    animationId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animationId);
  }, []);

  return (
    <div className={`flex flex-col h-full bg-[#111] border-2 uppercase transition-all duration-300 ${gorgeWarning ? 'border-red-500 shadow-[0_0_15px_red]' : 'border-[var(--color-green-military)] shadow-[0_0_10px_#00FF41]'}`}>
      <div className="px-4 py-2 border-b-2 border-[var(--color-green-military)] flex justify-between items-center bg-black/50 shrink-0">
        <h2 className="font-bold text-lg">SENSOR VIEW</h2>
        <span className={`px-3 py-1 text-black font-bold tracking-widest ${alertLevel === 'DANGER' ? 'bg-red-500 animate-pulse' : alertLevel === 'WARNING' ? 'bg-[var(--color-amber-military)]' : alertLevel === 'CAUTION' ? 'bg-yellow-400' : 'bg-[var(--color-green-military)]'}`}>
          LEVEL: {alertLevel}
        </span>
      </div>
      <div className="flex-1 relative bg-black flex overflow-hidden">
        <canvas ref={canvasRef} width={400} height={500} className="w-full h-full mix-blend-screen opacity-90"></canvas>
        
        {/* HUD Data overlay */}
        <div className="absolute top-4 left-4 right-4 flex justify-between pointer-events-none">
          <div className="bg-black/80 px-3 py-2 border border-[var(--color-green-military)]">
            SPD <span className={`transition-all ${speed === 20 ? 'text-red-500 text-xl font-bold animate-pulse' : 'text-xl font-bold'}`}>{speed} KM/H</span>
          </div>
          <div className={`bg-black/80 px-3 py-2 border ${gorgeWarning ? 'border-red-500 text-red-500 font-bold animate-pulse' : 'border-[var(--color-green-military)] opacity-30 text-[var(--color-green-military)]'}`}>
            GORGE PROXIMITY
          </div>
        </div>
      </div>
    </div>
  );
}
