import React, { useEffect, useState } from "react";
import { BiDollar } from "react-icons/bi";
import { collection, query, where, orderBy, getDocs } from "firebase/firestore";
import { db } from "../data/FetchData.jsx";
import {
  startOfMonth,
  endOfMonth,
  differenceInDays,
  format
} from "date-fns";
import { FaIndianRupeeSign } from "react-icons/fa6";

const pricePerKWh = 10; // USD per kWh

const MonthlyBillPrediction = () => {
  const [data, setData] = useState({
    estimatedTotal: 0,
    currentUsage: 0,
    projectedUsage: 0,
    daysRemaining: 0,
    billingCycle: ""
  });

  useEffect(() => {
    const fetchBillPrediction = async () => {
      try {
        const now = new Date();
        const monthStart = startOfMonth(now);
        const monthEnd = endOfMonth(now);

        const billingCycle = `${format(monthStart, "MMM d")} - ${format(
          monthEnd,
          "MMM d"
        )}`;

        // Days remaining in the month
        const daysRemaining = differenceInDays(monthEnd, now);

        // Fetch readings for the current month
        const readingsRef = collection(db, "energy_readings");
        const q = query(
          readingsRef,
          where("timestamp", ">=", monthStart.toISOString()),
          orderBy("timestamp", "asc")
        );
        const snapshot = await getDocs(q);

        let totalKWh = 0;
        let prevTimestamp = null;

        snapshot.forEach((doc) => {
          const reading = doc.data();
          const power = reading.power; // in watts
          const ts = new Date(reading.timestamp);

          if (prevTimestamp) {
            const hoursDiff =
              (ts.getTime() - prevTimestamp.getTime()) / (1000 * 60 * 60);
            totalKWh += (power / 1000) * hoursDiff;
          }

          prevTimestamp = ts;
        });

        // Current cost so far
        const currentCost = totalKWh * pricePerKWh;

        // Average daily usage cost
        const daysElapsed =
          differenceInDays(now, monthStart) || 1; // avoid division by zero
        const avgDailyCost = currentCost / daysElapsed;

        // Projected remaining usage cost
        const projectedCost = avgDailyCost * daysRemaining;

        // Estimated total bill
        const estimatedTotal = currentCost + projectedCost;

        setData({
          estimatedTotal,
          currentUsage: currentCost,
          projectedUsage: projectedCost,
          daysRemaining,
          billingCycle
        });
      } catch (error) {
        console.error("Error calculating bill:", error);
      }
    };

    fetchBillPrediction();
  }, []);

  const totalUsage = data.currentUsage + data.projectedUsage || 1; // avoid NaN
  const currentPercentage = (data.currentUsage / totalUsage) * 100;
  const projectedPercentage = (data.projectedUsage / totalUsage) * 100;

  return (
    <div className="w-96 mt-20 rounded-2xl shadow-lg bg-white p-6 space-y-6 font-sans">
      <h2 className="text-base font-semibold text-gray-800">
        Monthly Bill Prediction
      </h2>

      {/* Estimated Total */}
      <div>
        <p className="text-l text-gray-500 font-bold">Estimated Total</p>
        <div className="flex items-center space-x-2">
          <span className="text-4xl font-bold text-gray-900 inline-flex items-center ">
            <FaIndianRupeeSign />
            {data.estimatedTotal.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Current Usage */}
      <div>
        <div className="flex justify-between text-sm text-gray-700 mb-2">
          <span className="font-bold text-gray-500">Current Usage</span>
          <span>${data.currentUsage.toFixed(2)}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div
            className="bg-blue-600 h-2.5 rounded-full"
            style={{ width: `${currentPercentage}%` }}
          ></div>
        </div>
      </div>

      {/* Projected Usage */}
      <div>
        <div className="flex justify-between text-sm text-gray-700 mb-2">
          <span className="font-bold text-gray-500">Projected Usage</span>
          <span className="font-bold">
            ${data.projectedUsage.toFixed(2)}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div
            className="bg-gray-500 h-2.5 rounded-full"
            style={{ width: `${projectedPercentage}%` }}
          ></div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="flex justify-between text-sm text-gray-600 pt-3 border-t border-gray-200">
        <div>
          <p className="text-gray-500">Days Remaining</p>
          <p className="font-medium text-gray-800">{data.daysRemaining}</p>
        </div>
        <div className="text-right">
          <p className="text-gray-500 font-bold">Billing Cycle</p>
          <p className="font-bold text-gray-800">{data.billingCycle}</p>
        </div>
      </div>
    </div>
  );
};

export default MonthlyBillPrediction;
