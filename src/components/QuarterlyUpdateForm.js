'use client';

import { useState } from 'react';
import { updateQuarterlyActuals } from '@/app/actions/goalActions';

export default function QuarterlyUpdateForm({ goals }) {
  const [actuals, setActuals] = useState(
    goals.map(g => ({
      id: g.id,
      actualQ1: g.actualQ1 || '',
      actualQ2: g.actualQ2 || '',
      actualQ3: g.actualQ3 || '',
      actualQ4: g.actualQ4 || ''
    }))
  );
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');

  const handleUpdate = (index, quarter, value) => {
    const newActuals = [...actuals];
    newActuals[index][quarter] = value;
    setActuals(newActuals);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage('');
    
    const res = await updateQuarterlyActuals(actuals);
    if (res.error) {
      setMessage(`Error: ${res.error}`);
    } else {
      setMessage('Achievements saved successfully!');
      setTimeout(() => setMessage(''), 3000);
    }
    setIsSaving(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      {message && (
        <div style={{ padding: '12px', background: message.includes('Error') ? 'var(--danger-bg)' : 'var(--success-bg)', color: message.includes('Error') ? 'var(--danger)' : 'var(--success)', borderRadius: 'var(--radius-md)', marginBottom: '16px' }}>
          {message}
        </div>
      )}
      <table className="modern-table">
        <thead>
          <tr>
            <th>Goal Title</th>
            <th>Target (UoM)</th>
            <th>Q1 Actual</th>
            <th>Q2 Actual</th>
            <th>Q3 Actual</th>
            <th>Q4 Actual</th>
          </tr>
        </thead>
        <tbody>
          {goals.map((goal, idx) => (
            <tr key={goal.id}>
              <td style={{ fontWeight: '500' }}>{goal.title}</td>
              <td style={{ color: 'var(--text-muted)' }}>{goal.target} <br/><small>{goal.uom}</small></td>
              <td>
                <input type="text" className="input-field" style={{ padding: '8px', fontSize: '13px' }} value={actuals[idx].actualQ1} onChange={e => handleUpdate(idx, 'actualQ1', e.target.value)} placeholder="-" />
              </td>
              <td>
                <input type="text" className="input-field" style={{ padding: '8px', fontSize: '13px' }} value={actuals[idx].actualQ2} onChange={e => handleUpdate(idx, 'actualQ2', e.target.value)} placeholder="-" />
              </td>
              <td>
                <input type="text" className="input-field" style={{ padding: '8px', fontSize: '13px' }} value={actuals[idx].actualQ3} onChange={e => handleUpdate(idx, 'actualQ3', e.target.value)} placeholder="-" />
              </td>
              <td>
                <input type="text" className="input-field" style={{ padding: '8px', fontSize: '13px' }} value={actuals[idx].actualQ4} onChange={e => handleUpdate(idx, 'actualQ4', e.target.value)} placeholder="-" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'flex-end' }}>
        <button type="submit" className="btn-primary" disabled={isSaving}>
          {isSaving ? 'Saving...' : 'Save Quarterly Achievements'}
        </button>
      </div>
    </form>
  );
}
