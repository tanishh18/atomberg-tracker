import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';
import GoalSheetForm from '@/components/GoalSheetForm';
import QuarterlyUpdateForm from '@/components/QuarterlyUpdateForm';
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
      <h1 style={{ marginBottom: '32px' }}>My Goals <span style={{ color: 'var(--text-muted)', fontWeight: '400' }}>{currentYear}</span></h1>
      
      {!goalSheet || goalSheet.status === 'Draft' ? (
        <div className="glass-card">
          <h2 style={{ marginBottom: '24px' }}>{goalSheet ? 'Edit' : 'Create'} Goal Sheet</h2>
          <GoalSheetForm 
            userId={userId} 
            existingSheet={goalSheet} 
            year={currentYear} 
          />
        </div>
      ) : (
        <div className="glass-card">
          <div className="flex-between" style={{ marginBottom: '24px' }}>
            <h2>Goals Overview</h2>
            <span className={`status-badge status-${goalSheet.status.toLowerCase()}`}>
              {goalSheet.status}
            </span>
          </div>
          
          {goalSheet.status === 'Submitted' && (
            <table className="modern-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Thrust Area</th>
                  <th>UoM</th>
                  <th>Target</th>
                  <th>Weightage</th>
                </tr>
              </thead>
              <tbody>
                {goalSheet.goals.map((goal, idx) => (
                  <tr key={idx}>
                    <td>{goal.title}</td>
                    <td>{goal.thrustArea}</td>
                    <td>{goal.uom}</td>
                    <td>{goal.target}</td>
                    <td>{goal.weightage}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {goalSheet.status === 'Approved' && (
            <div style={{ marginTop: '16px' }}>
              <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>
                Your goals have been approved. Please log your actual achievements at the end of each quarter.
              </p>
              <QuarterlyUpdateForm goals={goalSheet.goals} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
