import { useState, useEffect, useCallback } from 'react';
import SensorView from './components/SensorView';
import StabilityPanel from './components/StabilityPanel';
import ThreatIntel from './components/ThreatIntel';
import RouteRiskMap from './components/RouteRiskMap';
import AlertFeed from './components/AlertFeed';

export default function App() {
  const [alerts, setAlerts] = useState([]);

  const addAlert = useCallback((type, message) => {
    const time = new Date().toISOString().substring(11, 19) + 'Z';
    setAlerts(prev => [...prev, { id: Date.now() + Math.random(), type, time, message }]);
  }, []);

  useEffect(() => {
    const boot = [
      { t: 1000, msg: "SYSTEM INITIALIZED", type: "INFO" },
      { t: 2000, msg: "SENSOR SUITE ONLINE", type: "INFO" },
      { t: 3000, msg: "CONVOY LINK ESTABLISHED", type: "INFO" }
    ];
    boot.forEach(({t, msg, type}) => {
      setTimeout(() => addAlert(type, msg), t);
    });
  }, [addAlert]);

  const handleSensorAlert = useCallback((level) => {
    addAlert(level, `SENSOR ALERT DECLARED: ${level}`);
  }, [addAlert]);

  const handleStabilityCritical = useCallback(() => {
    addAlert('DANGER', 'STABILITY CRITICAL. SLIP RISK MATRIX EXCEEDED.');
  }, [addAlert]);

  const handleIntelUpdate = useCallback(() => {
    addAlert('INFO', 'MISSION INTEL UPDATED FROM TACTICAL AI.');
  }, [addAlert]);

  const handleRouteZoneChange = useCallback((zone) => {
    if (zone === 'AMBER') {
      addAlert('WARNING', 'ROUTE RISK MAP: VEHICLE ENTERED CAUTION FOG ZONE KM 8-12.');
      return;
    }
    if (zone === 'RED') {
      addAlert('DANGER', 'ROUTE RISK MAP: VEHICLE ENTERED HIGH RISK ATGM CORRIDOR KM 14-18.');
    }
  }, [addAlert]);

  return (
    <div className="min-h-screen bg-[#050505] p-4 flex flex-col font-mono text-[var(--color-green-military)] overflow-y-auto">
      <div className="crt-scanline"></div>
      
      <header className="border-2 border-[var(--color-green-military)] bg-[#111] px-4 py-3 mb-4 flex justify-between items-center shadow-[0_0_10px_#00FF41] shrink-0 relative z-10">
        <h1 className="text-xl font-bold uppercase tracking-widest text-[var(--color-green-military)]">
          ITADMS v1.0 | VEHICLE: BRAVO-7 | CONVOY: ALPHA | STATUS: <span className="text-[var(--color-green-military)] animate-pulse">● ACTIVE</span>
        </h1>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 relative z-10 shrink-0 lg:h-[50vh]">
        <div className="min-h-[330px] lg:h-full">
          <SensorView onAlertChange={handleSensorAlert} />
        </div>
        <div className="min-h-[330px] lg:h-full">
          <StabilityPanel onCritical={handleStabilityCritical} />
        </div>
        <div className="min-h-[330px] lg:h-full">
          <ThreatIntel onUpdate={handleIntelUpdate} />
        </div>
      </div>

      <div className="mt-4 h-[240px] lg:h-[24vh] relative z-10 shrink-0">
        <RouteRiskMap onZoneChange={handleRouteZoneChange} />
      </div>

      <div className="mt-4 min-h-[260px] lg:h-[30vh] relative z-10 shrink-0">
        <AlertFeed alerts={alerts} />
      </div>
    </div>
  );
}
