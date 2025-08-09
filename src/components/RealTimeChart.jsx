import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend,
} from 'chart.js';
import { collection, query, orderBy, limit, onSnapshot } from "firebase/firestore";
import { db } from "../firebase.js";

ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Legend);

const RealTimeChart = () => {
  const [selectedMetric, setSelectedMetric] = useState('Voltage');
  const [labels, setLabels] = useState([]);
  const [voltageData, setVoltageData] = useState([]);
  const [currentData, setCurrentData] = useState([]);
  const [powerData, setPowerData] = useState([]);

  useEffect(() => {
    const q = query(
      collection(db, "energy_readings"),
      orderBy("timestamp", "desc"),
      limit(20) // last 10 readings
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const readings = [];
      snapshot.forEach(doc => readings.push(doc.data()));

      console.log("Fetched readings from Firestore:", readings);

      // Reverse for chronological order
      readings.reverse();

      setLabels(
        readings.map(r => {
          // Handle Firestore Timestamp
          let dateObj;
          if (r.timestamp?.toDate) {
            dateObj = r.timestamp.toDate(); // Timestamp -> JS Date
          } else {
            dateObj = new Date(r.timestamp); // if it's already a string or ms
          }

          return dateObj.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
          });
        })
      );

      setVoltageData(readings.map(r => r.voltage));
      setCurrentData(readings.map(r => r.current));
      setPowerData(readings.map(r => r.power));
    });

    return () => unsubscribe();
  }, []);
  const metricMap = {
    Voltage: voltageData,
    Current: currentData,
    Power: powerData
  };

  const chartData = {
    labels: labels,
    datasets: [
      {
        label: selectedMetric,
        data: metricMap[selectedMetric],
        fill: false,
        borderColor: '#3B82F6',
        tension: 0.4,
        pointBackgroundColor: '#3B82F6',
        pointBorderColor: '#3B82F6',
        pointRadius: 4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      x: {
        ticks: { color: '#6B7280', font: { size: 12 } },
        grid: { display: false },
      },
      y: {
        ticks: { color: '#6B7280', font: { size: 12 } },
        grid: { color: '#E5E7EB' },
      },
    },
  };

  return (
    <div className="mx-4">
      <div className="bg-white mt-10 shadow-md rounded-xl p-6 w-full h-[400px]">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-md font-semibold text-gray-800">Real-Time Monitoring</h2>
          <div className="flex items-center gap-2">
            {['Voltage', 'Current', 'Power'].map((metric) => (
              <button
                key={metric}
                onClick={() => setSelectedMetric(metric)}
                className={`px-3 py-1.5 rounded-md text-sm font-medium ${selectedMetric === metric
                  ? 'bg-blue-100 text-blue-600'
                  : 'text-gray-700 hover:bg-gray-100'
                  }`}
              >
                {metric}
              </button>
            ))}
            <select className="ml-2 text-sm bg-gray-100 text-gray-700 px-2 py-1.5 rounded-md focus:outline-none">
              <option>Last 10 readings</option>
              <option>Last 30 minutes</option>
              <option>Last hour</option>
            </select>
          </div>
        </div>
        <div className="w-full h-full">
          <Line data={chartData} options={chartOptions} />
        </div>
      </div>
    </div>
  );
};

export default RealTimeChart;
