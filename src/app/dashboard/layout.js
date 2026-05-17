import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';

async function logout() {
  'use server';
  (await cookies()).delete('auth_user');
  (await cookies()).delete('auth_role');
  redirect('/');
}

export default async function DashboardLayout({ children }) {
  const cookieStore = await cookies();
  const userId = cookieStore.get('auth_user')?.value;
  const role = cookieStore.get('auth_role')?.value;

  if (!userId) {
    redirect('/');
  }

  const user = await prisma.user.findUnique({ where: { id: userId } });

  if (!user) {
    redirect('/');
  }

  return (
    <div>
      <div className="glass-card" style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '18px' }}>Welcome, {user.name}</h2>
          <span className="status-badge status-draft" style={{ marginTop: '4px' }}>{role}</span>
        </div>
        <form action={logout}>
          <button type="submit" className="btn-secondary">Logout</button>
        </form>
      </div>
      {children}
    </div>
  );
}
