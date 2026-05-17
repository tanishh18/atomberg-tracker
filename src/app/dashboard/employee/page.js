import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';
import GoalSheetForm from '@/components/GoalSheetForm';
import { redirect } from 'next/navigation';

export default async function EmployeeDashboard() {
  const cookieStore = await cookies();
  const userId = cookieStore.get('auth_user')?.value;
  if (!userId) redirect('/');

  const currentYear = new Date().getFullYear();
  let goalSheet = await prisma.goalSheet.findFirst({
    where: { userId, year: currentYear },
    include: { goals: true },
  });

  return (
    <div>
      <h1 style={{ marginBottom: '24px' }}>My Goals - {currentYear}</h1>
      
      {!goalSheet || goalSheet.status === 'Draft' ? (
        <div className="glass-card">
          <h2 style={{ marginBottom: '16px' }}>{goalSheet ? 'Edit' : 'Create'} Goal Sheet</h2>
          <GoalSheetForm 
            userId={userId} 
            existingSheet={goalSheet} 
            year={currentYear} 
          />
        </div>
      ) : (
        <div className="glass-card">
          <div className="flex-between" style={{ marginBottom: '16px' }}>
            <h2>Goals Overview</h2>
            <span className={`status-badge status-${goalSheet.status.toLowerCase()}`}>
              {goalSheet.status}
            </span>
          </div>
          
          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '16px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)', textAlign: 'left' }}>
                <th style={{ padding: '12px 8px' }}>Title</th>
                <th style={{ padding: '12px 8px' }}>Thrust Area</th>
                <th style={{ padding: '12px 8px' }}>UoM</th>
                <th style={{ padding: '12px 8px' }}>Target</th>
                <th style={{ padding: '12px 8px' }}>Weightage</th>
              </tr>
            </thead>
            <tbody>
              {goalSheet.goals.map((goal, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '12px 8px' }}>{goal.title}</td>
                  <td style={{ padding: '12px 8px' }}>{goal.thrustArea}</td>
                  <td style={{ padding: '12px 8px' }}>{goal.uom}</td>
                  <td style={{ padding: '12px 8px' }}>{goal.target}</td>
                  <td style={{ padding: '12px 8px' }}>{goal.weightage}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
