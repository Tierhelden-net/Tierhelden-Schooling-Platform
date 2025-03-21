import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getAnalytics } from "@/actions/get-analytics";
import { DataCard } from "./_components/data-card";

const AnalyticsPage = async () => {
  const { userId } = await auth();

  if (!userId) {
    return redirect("/");
  }

  const { data, totalRevenue, totalSales } = await getAnalytics(userId);
  // TODO - mitarbeiter-report

  return (
    <div className="p-6">
      {/* <DataTable columns={userColumns} data={data} /> */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <DataCard
          label="Mux Analytics"
          url="https://dashboard.mux.com/organizations/mgsinc/environments/8mk8km/data"
        />
        {/* <DataCard label="Total Revenue" value={totalRevenue} shouldFormat /> */}
        <DataCard label="Aktivierte Kurse" value={totalSales} />
      </div>
      {/* <Chart data={data} /> */}
    </div>
  );
};

export default AnalyticsPage;
