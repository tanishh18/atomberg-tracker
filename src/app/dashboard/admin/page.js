import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function AdminDashboard() {
  const cookieStore = await cookies();
  const userId = cookieStore.get('auth_user')?.value;
  if (!userId) redirect('/');

  const currentYear = new Date().getFullYear();
  
  const allEmployees = await prisma.user.findMany({
    where: { role: 'Employee' },
    include: {
      goalSheets: {
        where: { year: currentYear }
      },
      manager: true
    }
  });

  const totalEmployees = allEmployees.length;
  const approvedSheets = allEmployees.filter(e => e.goalSheets[0]?.status === 'Approved').length;
  const submittedSheets = allEmployees.filter(e => e.goalSheets[0]?.status === 'Submitted').length;
  const draftSheets = allEmployees.filter(e => e.goalSheets[0]?.status === 'Draft' || !e.goalSheets[0]).length;

  return (
    <div>
      <h1 style={{ marginBottom: '24px' }}>Admin Dashboard - {currentYear} Completion Rates</h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '16px', marginBottom: '32px' }}>
        <div className="glass-card" style={{ textAlign: 'center' }}>
          <h3 style={{ color: 'var(--text-secondary)' }}>Total Employees</h3>
          <div style={{ fontSize: '32px', fontWeight: 'bold', marginTop: '8px' }}>{totalEmployees}</div>
        </div>
        <div className="glass-card" style={{ textAlign: 'center', borderColor: 'var(--success)' }}>
          <h3 style={{ color: 'var(--text-secondary)' }}>Approved</h3>
          <div style={{ fontSize: '32px', fontWeight: 'bold', marginTop: '8px', color: 'var(--success)' }}>{approvedSheets}</div>
        </div>
        <div className="glass-card" style={{ textAlign: 'center', borderColor: 'var(--warning)' }}>
          <h3 style={{ color: 'var(--text-secondary)' }}>Pending Review</h3>
          <div style={{ fontSize: '32px', fontWeight: 'bold', marginTop: '8px', color: 'var(--warning)' }}>{submittedSheets}</div>
        </div>
        <div className="glass-card" style={{ textAlign: 'center' }}>
          <h3 style={{ color: 'var(--text-secondary)' }}>Not Started / Draft</h3>
          <div style={{ fontSize: '32px', fontWeight: 'bold', marginTop: '8px' }}>{draftSheets}</div>
        </div>
      </div>

      <div className="glass-card">
        <h2 style={{ marginBottom: '24px' }}>Organization Overview</h2>
        <table className="modern-table">
          <thead>
            <tr>
              <th>Employee</th>
              <th>Manager</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {allEmployees.map(emp => {
              const sheet = emp.goalSheets[0];
              const status = sheet ? sheet.status : 'Not Started';
              return (
                <tr key={emp.id}>
                  <td style={{ fontWeight: '500' }}>{emp.name}</td>
                  <td style={{ color: 'var(--text-muted)' }}>{emp.manager?.name || '-'}</td>
                  <td>
                    <span className={`status-badge status-${status.toLowerCase().replace(' ', '-')}`}>
                      {status}
                    </span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
