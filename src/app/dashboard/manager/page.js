import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function ManagerDashboard() {
  const cookieStore = await cookies();
  const userId = cookieStore.get('auth_user')?.value;
  if (!userId) redirect('/');

  const currentYear = new Date().getFullYear();
  
  // Find employees reporting to this manager
  const employees = await prisma.user.findMany({
    where: { managerId: userId },
    include: {
      goalSheets: {
        where: { year: currentYear },
        include: { goals: true }
      }
    }
  });

  return (
    <div>
      <h1 style={{ marginBottom: '24px' }}>Team Goal Sheets - {currentYear}</h1>
      
      {employees.length === 0 ? (
        <p>No team members reporting to you.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {employees.map(employee => {
            const sheet = employee.goalSheets[0];
            return (
              <div key={employee.id} className="glass-card">
                <div className="flex-between" style={{ marginBottom: '16px' }}>
                  <h3 style={{ fontSize: '18px' }}>{employee.name}</h3>
                  {sheet ? (
                    <span className={`status-badge status-${sheet.status.toLowerCase()}`}>
                      {sheet.status}
                    </span>
                  ) : (
                    <span className="status-badge status-draft">Not Started</span>
                  )}
                </div>

                {sheet && sheet.status === 'Submitted' && (
                  <div>
                    <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '16px' }}>
                      <thead>
                        <tr style={{ borderBottom: '1px solid var(--border)', textAlign: 'left' }}>
                          <th style={{ padding: '8px' }}>Title</th>
                          <th style={{ padding: '8px' }}>Target</th>
                          <th style={{ padding: '8px' }}>Weightage</th>
                        </tr>
                      </thead>
                      <tbody>
                        {sheet.goals.map((g, idx) => (
                          <tr key={idx} style={{ borderBottom: '1px solid var(--border)' }}>
                            <td style={{ padding: '8px' }}>{g.title}</td>
                            <td style={{ padding: '8px' }}>{g.target}</td>
                            <td style={{ padding: '8px' }}>{g.weightage}%</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    
                    <div className="flex-gap">
                      <form action={async () => {
                        'use server';
                        await prisma.goalSheet.update({ where: { id: sheet.id }, data: { status: 'Approved' } });
                        redirect('/dashboard/manager');
                      }}>
                        <button type="submit" className="btn-primary">Approve Goals</button>
                      </form>
                      
                      <form action={async () => {
                        'use server';
                        await prisma.goalSheet.update({ where: { id: sheet.id }, data: { status: 'Draft' } });
                        redirect('/dashboard/manager');
                      }}>
                        <button type="submit" className="btn-secondary" style={{ color: 'var(--danger)', borderColor: 'var(--danger)' }}>Reject / Rework</button>
                      </form>
                    </div>
                  </div>
                )}
                
                {sheet && sheet.status === 'Approved' && (
                  <p style={{ color: 'var(--text-secondary)' }}>Goals have been approved. Waiting for check-ins.</p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
