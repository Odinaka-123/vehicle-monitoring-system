import Layout from "@/app/components/Layout";

export default function Dashboard() {
  return (
    <Layout>
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white p-5 shadow rounded">
          <h2>Total Vehicles</h2>
          <p className="text-2xl font-bold">120</p>
        </div>

        <div className="bg-white p-5 shadow rounded">
          <h2>Vehicles Inside</h2>
          <p className="text-2xl font-bold">45</p>
        </div>

        <div className="bg-white p-5 shadow rounded">
          <h2>Incidents Today</h2>
          <p className="text-2xl font-bold">3</p>
        </div>

        <div className="bg-white p-5 shadow rounded">
          <h2>Access Denied</h2>
          <p className="text-2xl font-bold">5</p>
        </div>
      </div>
    </Layout>
  );
}