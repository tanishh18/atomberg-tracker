import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { saveManagerComment } from '@/app/actions/goalActions';

export default async function ManagerDashboard() {
  const cookieStore = await cookies();
  const userId = cookieStore.get('auth_user')?.value;
  if (!userId) redirect('/');

  const currentYear = new Date().getFullYear();
  
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
      <h1 style={{ marginBottom: '32px' }}>Team Goals <span style={{ color: 'var(--text-muted)', fontWeight: '400' }}>{currentYear}</span></h1>
      
      {employees.length === 0 ? (
        <p>No team members reporting to you.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          {employees.map(employee => {
            const sheet = employee.goalSheets[0];
            return (
              <div key={employee.id} className="glass-card">
                <div className="flex-between" style={{ marginBottom: '24px' }}>
                  <h3 style={{ fontSize: '20px' }}>{employee.name}</h3>
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
                    <h4 style={{ color: 'var(--text-muted)', marginBottom: '12px' }}>Pending Approval</h4>
                    <table className="modern-table" style={{ marginBottom: '24px' }}>
                      <thead>
                        <tr>
                          <th>Title</th>
                          <th>Target</th>
                          <th>Weightage</th>
                        </tr>
                      </thead>
                      <tbody>
                        {sheet.goals.map((g, idx) => (
                          <tr key={idx}>
                            <td>{g.title}</td>
                            <td>{g.target}</td>
                            <td>{g.weightage}%</td>
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
                        <button type="submit" className="btn-secondary" style={{ color: 'var(--danger)', borderColor: 'rgba(239, 68, 68, 0.3)' }}>Reject / Rework</button>
                      </form>
                    </div>
                  </div>
                )}
                
                {sheet && sheet.status === 'Approved' && (
                  <div>
                    <h4 style={{ color: 'var(--text-muted)', marginBottom: '12px' }}>Performance Tracking (Phase 2)</h4>
                    <table className="modern-table" style={{ marginBottom: '24px' }}>
                      <thead>
                        <tr>
                          <th>Title</th>
                          <th>Target</th>
                          <th>Q1</th>
                          <th>Q2</th>
                          <th>Q3</th>
                          <th>Q4</th>
                        </tr>
                      </thead>
                      <tbody>
                        {sheet.goals.map((g, idx) => (
                          <tr key={idx}>
                            <td>{g.title}</td>
                            <td>{g.target}</td>
                            <td style={{ color: g.actualQ1 ? 'var(--text-main)' : 'var(--text-muted)' }}>{g.actualQ1 || '-'}</td>
                            <td style={{ color: g.actualQ2 ? 'var(--text-main)' : 'var(--text-muted)' }}>{g.actualQ2 || '-'}</td>
                            <td style={{ color: g.actualQ3 ? 'var(--text-main)' : 'var(--text-muted)' }}>{g.actualQ3 || '-'}</td>
                            <td style={{ color: g.actualQ4 ? 'var(--text-main)' : 'var(--text-muted)' }}>{g.actualQ4 || '-'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    
                    <div style={{ background: 'rgba(0,0,0,0.2)', padding: '24px', borderRadius: 'var(--radius-lg)' }}>
                      <h4 style={{ marginBottom: '16px', fontSize: '15px' }}>Manager Check-in Note</h4>
                      <form action={saveManagerComment.bind(null, sheet.id)} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <textarea 
                          name="comment"
                          className="input-field" 
                          defaultValue={sheet.managerComment || ''}
                          placeholder="Document your quarterly check-in discussion here..." 
                          rows={4}
                          style={{ resize: 'vertical' }}
                        ></textarea>
                        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                          <button type="submit" className="btn-secondary" style={{ fontSize: '13px', padding: '8px 16px' }}>Save Note</button>
                        </div>
                      </form>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
