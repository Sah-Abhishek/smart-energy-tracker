
import MonthlyBillPrediction from "../components/BillPrediction";
import EnergyStats from "../components/EnergyStats";
import Navbar from "../components/Navbar";
import RealTimeChart from "../components/RealTimeChart";

const Dashboard = () => {
  return (
    <div>
      <Navbar />
      <div className="max-w-7xl mx-auto px-6 py-12 mt-10 ">
        {/* Cards with margin-bottom to separate from chart */}
        <EnergyStats />

        {/* Chart */}
        <RealTimeChart />
        <MonthlyBillPrediction />
      </div>

    </div>

  )
}


export default Dashboard;
