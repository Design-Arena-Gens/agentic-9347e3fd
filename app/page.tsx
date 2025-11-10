"use client";
import { useEffect, useMemo, useState } from 'react';
import MetricCard from "../components/MetricCard";
import WeeklySparkline from "../components/WeeklySparkline";
import LogForm from "../components/LogForm";
import { exportJson, importJson, loadData } from "../lib/storage";
import { lastNDays } from "../lib/date";

export default function Page() {
  const [tick, setTick] = useState(0);
  const data = useMemo(() => loadData(), [tick]);

  useEffect(() => {
    const onStorage = (e: StorageEvent) => { if (e.key?.includes('fitness-dashboard')) setTick(t=>t+1); };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const weekKeys = lastNDays(7);
  const weekly = weekKeys.map(k => data.byDate[k] ?? { steps:0, calories:0, waterMl:0, workoutMinutes:0 });

  const stepsSeries = weekly.map(d => d.steps);
  const calSeries = weekly.map(d => d.calories);
  const waterSeries = weekly.map(d => Math.round(d.waterMl/250));
  const workoutSeries = weekly.map(d => d.workoutMinutes);

  function handleExport() {
    const blob = new Blob([exportJson()], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'fitness-data.json'; a.click();
    URL.revokeObjectURL(url);
  }

  function handleImport(ev: React.ChangeEvent<HTMLInputElement>) {
    const file = ev.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try { importJson(String(reader.result)); setTick(t=>t+1); }
      catch { alert('Invalid file'); }
    };
    reader.readAsText(file);
  }

  return (
    <div className="grid">
      <div className="card" style={{gridColumn:'span 12'}}>
        <div className="row" style={{justifyContent:'space-between'}}>
          <div className="section-title">This week</div>
          <div className="row" style={{gap:8}}>
            <button className="btn" onClick={handleExport}>Export</button>
            <label className="btn">
              Import
              <input type="file" accept="application/json" onChange={handleImport} style={{display:'none'}} />
            </label>
            <button className="btn" onClick={()=>setTick(t=>t+1)}>Refresh</button>
          </div>
        </div>
        <div className="divider" />
        <div className="grid">
          <div style={{gridColumn:'span 3'}}>
            <MetricCard title="Steps" value={stepsSeries.at(-1) ?? 0}>
              <WeeklySparkline data={stepsSeries} />
            </MetricCard>
          </div>
          <div style={{gridColumn:'span 3'}}>
            <MetricCard title="Calories" value={calSeries.at(-1) ?? 0}>
              <WeeklySparkline data={calSeries} color="#93c5fd" />
            </MetricCard>
          </div>
          <div style={{gridColumn:'span 3'}}>
            <MetricCard title="Water (x250ml)" value={waterSeries.at(-1) ?? 0}>
              <WeeklySparkline data={waterSeries} color="#a78bfa" />
            </MetricCard>
          </div>
          <div style={{gridColumn:'span 3'}}>
            <MetricCard title="Workout (min)" value={workoutSeries.at(-1) ?? 0}>
              <WeeklySparkline data={workoutSeries} color="#fca5a5" />
            </MetricCard>
          </div>
        </div>
      </div>

      <div style={{gridColumn:'span 7'}}>
        <LogForm />
      </div>

      <div className="card" style={{gridColumn:'span 5'}}>
        <h3>Summary</h3>
        <div className="row" style={{justifyContent:'space-between', marginTop:6}}>
          <div className="sub">7-day totals</div>
        </div>
        <div className="divider" />
        <div className="row" style={{justifyContent:'space-between'}}>
          <div>Steps</div>
          <div className="badge">{stepsSeries.reduce((a,b)=>a+b,0)}</div>
        </div>
        <div className="row" style={{justifyContent:'space-between'}}>
          <div>Calories</div>
          <div className="badge">{calSeries.reduce((a,b)=>a+b,0)}</div>
        </div>
        <div className="row" style={{justifyContent:'space-between'}}>
          <div>Water (ml)</div>
          <div className="badge">{waterSeries.reduce((a,b)=>a+b,0) * 250}</div>
        </div>
        <div className="row" style={{justifyContent:'space-between'}}>
          <div>Workout (min)</div>
          <div className="badge">{workoutSeries.reduce((a,b)=>a+b,0)}</div>
        </div>
      </div>
    </div>
  );
}
