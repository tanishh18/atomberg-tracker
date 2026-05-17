'use client';

import { useState } from 'react';
import { submitGoalSheet } from '@/app/actions/goalActions';

const THRUST_AREAS = ['Revenue', 'Cost Optimization', 'Innovation', 'Customer Satisfaction', 'Process Improvement'];
const UOM_TYPES = ['Numeric (Min)', 'Numeric (Max)', '% (Min)', '% (Max)', 'Timeline', 'Zero'];

export default function GoalSheetForm({ userId, existingSheet, year }) {
  const [goals, setGoals] = useState(
    existingSheet?.goals || [
      { title: '', thrustArea: THRUST_AREAS[0], uom: UOM_TYPES[0], target: '', weightage: 10 }
    ]
  );
  const [error, setError] = useState('');

  const addGoal = () => {
    if (goals.length >= 8) {
      setError('Maximum 8 goals allowed.');
      return;
    }
    setGoals([...goals, { title: '', thrustArea: THRUST_AREAS[0], uom: UOM_TYPES[0], target: '', weightage: 10 }]);
  };

  const removeGoal = (index) => {
    setGoals(goals.filter((_, idx) => idx !== index));
  };

  const updateGoal = (index, field, value) => {
    const newGoals = [...goals];
    newGoals[index][field] = field === 'weightage' ? parseInt(value) || 0 : value;
    setGoals(newGoals);
  };

  const totalWeightage = goals.reduce((sum, g) => sum + g.weightage, 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (totalWeightage !== 100) {
      setError(`Total weightage must be exactly 100%. Current: ${totalWeightage}%`);
      return;
    }

    if (goals.some(g => g.weightage < 10)) {
      setError('Minimum weightage per goal is 10%.');
      return;
    }
    
    if (goals.some(g => !g.title || !g.target)) {
      setError('Please fill in all titles and targets.');
      return;
    }

    const formData = new FormData();
    formData.append('userId', userId);
    formData.append('year', year.toString());
    formData.append('goals', JSON.stringify(goals));
    formData.append('sheetId', existingSheet?.id || '');

    const res = await submitGoalSheet(formData);
    if (res.error) {
      setError(res.error);
    } else {
      window.location.reload();
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && (
        <div style={{ padding: '12px', backgroundColor: 'rgba(239, 68, 68, 0.2)', color: 'var(--danger)', borderRadius: 'var(--radius-md)', marginBottom: '16px' }}>
          {error}
        </div>
      )}
      
      {goals.map((goal, idx) => (
        <div key={idx} style={{ padding: '16px', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', marginBottom: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div className="flex-between">
            <h4 style={{ color: 'var(--text-secondary)' }}>Goal #{idx + 1}</h4>
            {goals.length > 1 && (
              <button type="button" onClick={() => removeGoal(idx)} style={{ background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer' }}>Remove</button>
            )}
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label className="label">Goal Title</label>
              <input type="text" className="input-field" value={goal.title} onChange={(e) => updateGoal(idx, 'title', e.target.value)} required />
            </div>
            <div>
              <label className="label">Thrust Area</label>
              <select className="input-field" value={goal.thrustArea} onChange={(e) => updateGoal(idx, 'thrustArea', e.target.value)}>
                {THRUST_AREAS.map(ta => <option key={ta} value={ta}>{ta}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Unit of Measurement (UoM)</label>
              <select className="input-field" value={goal.uom} onChange={(e) => updateGoal(idx, 'uom', e.target.value)}>
                {UOM_TYPES.map(u => <option key={u} value={u}>{u}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Target</label>
              <input type="text" className="input-field" value={goal.target} onChange={(e) => updateGoal(idx, 'target', e.target.value)} required />
            </div>
            <div>
              <label className="label">Weightage (%)</label>
              <input type="number" className="input-field" min="10" max="100" value={goal.weightage} onChange={(e) => updateGoal(idx, 'weightage', e.target.value)} required />
            </div>
          </div>
        </div>
      ))}
      
      <div className="flex-between" style={{ marginTop: '24px' }}>
        <div>
          <button type="button" className="btn-secondary" onClick={addGoal} disabled={goals.length >= 8}>
            + Add Goal
          </button>
          <span style={{ marginLeft: '16px', fontSize: '14px', color: totalWeightage === 100 ? 'var(--success)' : 'var(--warning)' }}>
            Total Weightage: {totalWeightage}% (Target: 100%)
          </span>
        </div>
        
        <button type="submit" className="btn-primary" disabled={totalWeightage !== 100}>
          Submit Goals for Approval
        </button>
      </div>
    </form>
  );
}
