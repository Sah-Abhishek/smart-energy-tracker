import React, { useEffect, useState } from "react";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { db } from "../data/FetchData.jsx"; // Your Firestore import
import dayjs from "dayjs";

const UsageStatsCard = () => {
  const [todaysUsage, setTodaysUsage] = useState("0.00");
  const [peakPower, setPeakPower] = useState("0.00");

  useEffect(() => {
    const fetchUsageData = async () => {
      try {
        const now = dayjs();

        // Get start and end of today in local timezone as ISO strings matching your format
        const todayStartString = now.startOf("day").format("YYYY-MM-DDTHH:mm:ss.SSSZ");
        const todayEndString = now.endOf("day").format("YYYY-MM-DDTHH:mm:ss.SSSZ");

        // Query Firestore with string range filters
        const q = query(
          collection(db, "sensorData"),
          where("timestamp", ">=", todayStartString),
          where("timestamp", "<=", todayEndString),
          orderBy("timestamp", "asc")
        );

        const snapshot = await getDocs(q);

        // Map docs and parse timestamp strings back to Date
        const readings = snapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            timestamp: new Date(data.timestamp), // Convert ISO string to Date object
          };
        });

        if (readings.length === 0) {
          console.warn("No readings found for today");
          setTodaysUsage("0.00");
          setPeakPower("0.00");
          return;
        }

        let totalEnergyKWh = 0;
        let maxPowerW = 0;
        let lastTimestamp = null;

        readings.forEach(({ power, timestamp }) => {
          const powerW = Number(power) || 0;

          if (lastTimestamp) {
            const timeDiffHours = (timestamp - lastTimestamp) / (1000 * 60 * 60);
            totalEnergyKWh += (powerW * timeDiffHours) / 1000;
          }

          if (powerW > maxPowerW) maxPowerW = powerW;

          lastTimestamp = timestamp;
        });

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
