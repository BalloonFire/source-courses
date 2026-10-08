import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import { getAnalytics } from "@/actions/get-analytics";
import { DataCard } from "./_components/datacard";
import { Chart } from "./_components/chart";

const AnalyticsPage = async () => {
    const { userId } = await auth();

    if (!userId) {
        return redirect("/");
    }

    const { data, totalRevenue, totalPurchases } = await getAnalytics(userId);
    const chartData = Array.isArray(data) ? data : [];

    return ( 
        <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <DataCard
                    label="Total Revenue"
                    value={totalRevenue}
                    shouldFormat
                />
                <DataCard
                    label="Total Purchases"
                    value={totalPurchases}
                />
            </div>
            <Chart 
                data={chartData}
            />
        </div>
     );
}
 
export default AnalyticsPage;