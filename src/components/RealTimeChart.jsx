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
import { fetchReadings } from '../data/FetchData.jsx';

ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Legend);

const RealTimeChart = () => {
  const [selectedMetric, setSelectedMetric] = useState('Voltage');
  const [labels, setLabels] = useState([]);
  const [voltageData, setVoltageData] = useState([]);
  const [currentData, setCurrentData] = useState([]);
  const [powerData, setPowerData] = useState([]);

  useEffect(() => {
    let unsubscribeFn;

    const getData = async () => {
      unsubscribeFn = await fetchReadings((readings) => {
        const now = new Date();
        const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());

        const todayReadings = readings.filter((r) => {
          const dateObj = new Date(r.timestamp);
          return dateObj >= todayStart;
        });

        setLabels(
          todayReadings.map((r) => {
            const dateObj = new Date(r.timestamp);
            return dateObj.toLocaleTimeString('en-IN', {
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
            });
          })
        );

        setVoltageData(todayReadings.map((r) => r.voltage));
        setCurrentData(todayReadings.map((r) => r.current));
        setPowerData(todayReadings.map((r) => r.power));
      });
    };

    getData();

    return () => {
      if (unsubscribeFn) {
        unsubscribeFn();
      }
    };
  }, []);

  const metricMap = {
    Voltage: voltageData,
    Current: currentData,
    Power: powerData,
  };

  const chartData = {
    labels,
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
            <select
              disabled
              className="ml-2 text-sm bg-gray-100 text-gray-700 px-2 py-1.5 rounded-md focus:outline-none"
            >
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
