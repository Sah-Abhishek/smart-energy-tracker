import React, { useEffect, useState } from "react";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { db } from "../data/FetchData.jsx"; // Import your Firestore db
import dayjs from "dayjs";

const UsageStatsCard = () => {
  const [todaysUsage, setTodaysUsage] = useState("0.00");
  const [peakPower, setPeakPower] = useState("0.00");

  useEffect(() => {
    const fetchUsageData = async () => {
      try {
        const now = new Date();

        // Calculate start and end of today in IST
        const todayStartIST = dayjs(now).startOf("day");
        const todayEndIST = dayjs(now).endOf("day");

        // Format as the same string type stored in Firestore
        const startString = todayStartIST.format("YYYY-MM-DDTHH:mm:ss.SSSZ");
        const endString = todayEndIST.format("YYYY-MM-DDTHH:mm:ss.SSSZ");

        // console.log("Query range strings:", startString, endString);

        // Query Firestore (string comparison)
        const q = query(
          collection(db, "energy_readings"),
          where("timestamp", ">=", startString),
          where("timestamp", "<=", endString),
          orderBy("timestamp", "asc")
        );

        const snapshot = await getDocs(q);
        const readings = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          timestamp: new Date(doc.data().timestamp) // parse back to Date object
        }));

        // console.log("Readings Array:", readings);

        if (!readings.length) {
          console.warn("No readings found for today");
          return;
        }

        let totalEnergyKWh = 0;
        let maxPowerW = 0;
        let peakTimestamp = null;
        let lastTimestamp = null;

        readings.forEach((data) => {
          const ts = data.timestamp;
          const powerW = Number(data.power) || 0;

          if (lastTimestamp) {
            const timeDiffHours = (ts - lastTimestamp) / (1000 * 60 * 60);
            totalEnergyKWh += (powerW * timeDiffHours) / 1000;
          }

          if (powerW > maxPowerW) {
            maxPowerW = powerW;
            peakTimestamp = ts;
          }

          lastTimestamp = ts;
        });

        console.log(
          `Peak Power Today: ${maxPowerW} W at ${peakTimestamp?.toLocaleString()}`
        );

        setTodaysUsage(totalEnergyKWh.toFixed(2));
        setPeakPower((maxPowerW / 1000).toFixed(2));
      } catch (error) {
        console.error("Error fetching usage data:", error);
      }
    };

    fetchUsageData();
  }, []);

  return (
    <div className="flex items-center space-x-4 bg-gray-50 px-4 py-1.5 rounded-md">
      <div className="text-xs text-gray-500">
        <span className="block">Today's Usage</span>
        <span className="text-base font-semibold text-gray-900">
          {todaysUsage} kWh
        </span>
      </div>
      <div className="w-px bg-gray-300 h-6" />
      <div className="text-xs text-gray-500">
        <span className="block">Peak Power</span>
        <span className="text-base font-semibold text-gray-900">
          {peakPower} kW
        </span>
      </div>
    </div>
  );
};

export default UsageStatsCard;
