import React from 'react';
import {
  BoltIcon,
  BoltSlashIcon,
  ChartBarIcon,
} from '@heroicons/react/24/solid';
import { Plug } from 'lucide-react'

const stats = [
  {
    label: 'Voltage',
    value: '221.8',
    unit: 'V',
    icon: <BoltIcon className="h-5 w-5 text-blue-600" />,
    border: 'border-l-4 border-blue-500',
    bg: 'bg-blue-100',
    change: '+0.4%',
    changeColor: 'text-green-500',
    sub: 'Updated just now',
  },
  {
    label: 'Current',
    value: '5.2',
    unit: 'A',
    icon: <BoltSlashIcon className="h-5 w-5 text-green-600" />,
    border: 'border-l-4 border-green-500',
    bg: 'bg-green-100',
    change: '-1.2%',
    changeColor: 'text-red-500',
    sub: 'Updated just now',
  },
  {
    label: 'Power',
    value: '1,153',
    unit: 'W',
    icon: <Plug className="h-5 w-5 text-yellow-600" />,
    border: 'border-l-4 border-yellow-400',
    bg: 'bg-yellow-100',
    change: '+2.8%',
    changeColor: 'text-green-500',
    sub: 'Updated just now',
  },
  {
    label: 'Total Energy',
    value: '3.8',
    unit: 'kWh',
    icon: <ChartBarIcon className="h-5 w-5 text-purple-600" />,
    border: 'border-l-4 border-purple-500',
    bg: 'bg-purple-100',
    change: 'Today',
    changeColor: 'text-gray-500',
    sub: 'Updated just now',
  },
];

const EnergyStats = () => {
  return (
    <div className="flex flex-wrap gap-6 justify-between">
      {stats.map((stat, idx) => (
        <div
          key={idx}
          className={`w-[250px] ${stat.border} bg-white shadow-md rounded-xl p-4 flex justify-between items-start`}
        >
          <div>
            <p className="text-sm text-gray-500 mb-1">{stat.label}</p>
            <div className="flex items-baseline space-x-1 mb-1">
              <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
              <span className="text-sm text-gray-500">{stat.unit}</span>
            </div>
            <div className="text-xs text-gray-500 flex items-center space-x-2">
              <span>{stat.sub}</span>
              <span className={stat.changeColor}>{stat.change}</span>
            </div>
          </div>
          <div className={`rounded-md p-2 ${stat.bg}`}>
            {stat.icon}
          </div>
        </div>
      ))}
    </div>
  );
};

export default EnergyStats;
