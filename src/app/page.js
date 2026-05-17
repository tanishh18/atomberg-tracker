import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';

async function loginAsUser(userId, role) {
  'use server';
  (await cookies()).set('auth_user', userId);
  (await cookies()).set('auth_role', role);

  if (role === 'Employee') redirect('/dashboard/employee');
  if (role === 'Manager') redirect('/dashboard/manager');
  if (role === 'Admin') redirect('/dashboard/admin');
  redirect('/');
}

export default async function Home() {
  const users = await prisma.user.findMany();

  return (
    <div style={{ maxWidth: '600px', margin: '80px auto', textAlign: 'center' }} className="animate-fade-in">
      
      <div style={{ marginBottom: '48px' }}>
        <h1 style={{ fontSize: '48px', lineHeight: '1.2', marginBottom: '16px' }}>
          Align your <span className="brand-gradient">Ambitions</span>
        </h1>
        <p style={{ fontSize: '18px', color: 'var(--text-muted)' }}>
          Welcome to the AtomQuest In-House Goal Setting & Tracking Portal. 
          Please select a role below to experience the demo.
        </p>
      </div>

      <div className="glass-card" style={{ padding: '40px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {users.map((user) => (
            <form key={user.id} action={loginAsUser.bind(null, user.id, user.role)}>
              <button 
                type="submit" 
                className="btn-secondary" 
                style={{ 
                  width: '100%', 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  padding: '16px 24px',
                  fontSize: '16px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ 
                    width: '40px', 
                    height: '40px', 
                    borderRadius: '50%', 
                    background: 'var(--bg-card)', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    fontWeight: 'bold',
                    color: 'var(--accent-vibrant)'
                  }}>
                    {user.name.charAt(0)}
                  </div>
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ fontWeight: '600', color: 'white' }}>{user.name}</div>
                    <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Sign in as {user.name.split(' ')[0]}</div>
                  </div>
                </div>
                <span className="brand-gradient" style={{ fontSize: '14px', fontWeight: 'bold' }}>{user.role}</span>
              </button>
            </form>
          ))}
        </div>
      </div>
    </div>
  );
}
