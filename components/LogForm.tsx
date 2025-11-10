"use client";
import { useState, useEffect } from 'react';
import { getToday, upsertToday } from '../lib/storage';

export default function LogForm() {
  const [steps, setSteps] = useState(0);
  const [calories, setCalories] = useState(0);
  const [waterMl, setWaterMl] = useState(0);
  const [workoutMinutes, setWorkoutMinutes] = useState(0);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const t = getToday();
    setSteps(t.steps); setCalories(t.calories); setWaterMl(t.waterMl); setWorkoutMinutes(t.workoutMinutes);
  }, []);

  function persist() {
    upsertToday({ steps, calories, waterMl, workoutMinutes });
    setSaved(true);
    setTimeout(() => setSaved(false), 1200);
  }

  return (
    <div className="card">
      <h3>Quick Log</h3>
      <div className="row" style={{gap:12, flexWrap:'wrap'}}>
        <div className="grow">
          <div className="label">Steps</div>
          <input className="input" type="number" value={steps} onChange={e=>setSteps(Number(e.target.value))} min={0} />
        </div>
        <div className="grow">
          <div className="label">Calories</div>
          <input className="input" type="number" value={calories} onChange={e=>setCalories(Number(e.target.value))} min={0} />
        </div>
        <div className="grow">
          <div className="label">Water (ml)</div>
          <input className="input" type="number" value={waterMl} onChange={e=>setWaterMl(Number(e.target.value))} min={0} />
        </div>
        <div className="grow">
          <div className="label">Workout (min)</div>
          <input className="input" type="number" value={workoutMinutes} onChange={e=>setWorkoutMinutes(Number(e.target.value))} min={0} />
        </div>
      </div>
      <div className="row" style={{marginTop:12, justifyContent:'space-between'}}>
        <button className="btn primary" onClick={persist}>Save</button>
        {saved ? <span className="badge positive">Saved</span> : <span className="badge">Not saved</span>}
      </div>
    </div>
  );
}
