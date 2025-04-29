
import { Outlet } from 'react-router-dom';

export default function AdminLayout() {
  return (
    <div className="flex min-h-screen">
      <aside className="w-64 bg-background border-r">
        <div className="p-4">
          <h2 className="text-lg font-semibold">Admin Panel</h2>
        </div>
        <nav className="px-2 py-4">
          <ul className="space-y-1">
            <li>
              <a href="/admin" className="block px-4 py-2 rounded-md hover:bg-accent">Dashboard</a>
            </li>
            <li>
              <a href="/admin/users" className="block px-4 py-2 rounded-md hover:bg-accent">Users</a>
            </li>
            <li>
              <a href="/admin/analytics" className="block px-4 py-2 rounded-md hover:bg-accent">Analytics</a>
            </li>
            <li>
              <a href="/admin/settings" className="block px-4 py-2 rounded-md hover:bg-accent">Settings</a>
            </li>
          </ul>
        </nav>
      </aside>
      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  );
}
