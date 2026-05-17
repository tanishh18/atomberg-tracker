import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';

async function loginAsUser(userId, role) {
  'use server';
  // set cookie
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
    <div className="glass-card" style={{ maxWidth: '500px', margin: '60px auto', textAlign: 'center' }}>
      <h1 style={{ marginBottom: '16px' }}>Welcome to AtomQuest</h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>
        Please select a mock user to log in and demo the portal.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {users.map((user) => (
          <form key={user.id} action={loginAsUser.bind(null, user.id, user.role)}>
            <button type="submit" className="btn-secondary" style={{ width: '100%', display: 'flex', justifyContent: 'space-between' }}>
              <span>{user.name}</span>
              <span className="status-badge status-draft">{user.role}</span>
            </button>
          </form>
        ))}
      </div>
    </div>
  );
}
