"use client";
import { ReactNode } from 'react';

export default function MetricCard({ title, value, badge, children }: { title: string; value: ReactNode; badge?: ReactNode; children?: ReactNode }) {
  return (
    <div className="card">
      <div className="row" style={{justifyContent:'space-between'}}>
        <h3>{title}</h3>
        {badge ? <span className="badge">{badge}</span> : null}
      </div>
      <div className="value">{value}</div>
      {children}
    </div>
  );
}
