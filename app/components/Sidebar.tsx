export default function Sidebar() {
  return (
    <div className="w-64 h-screen bg-slate-900 text-white p-5">
      <h1 className="text-2xl font-bold mb-10">VMS</h1>

      <ul className="space-y-4">
        <li><a href="/dashboard">Dashboard</a></li>
        <li><a href="/register">Register Vehicle</a></li>
        <li><a href="/gate">Gate Access</a></li>
        <li><a href="/logs">Access Logs</a></li>
        <li><a href="/incidents">Incidents</a></li>
        <li><a href="/admin">Admin</a></li>
      </ul>
    </div>
  );
}