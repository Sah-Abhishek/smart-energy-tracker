import React, { useState, useEffect } from 'react';
import { BoltIcon, Cog6ToothIcon, UserCircleIcon } from '@heroicons/react/24/solid';
import UsageStatsCard from './UsageStatsCard';

const Navbar = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formattedDate = currentTime.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const formattedTime = currentTime.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  });

  return (
    <nav className="w-full flex items-center  justify-between px-6 py-3 bg-white shadow-sm border-b">
      {/* Left: Logo and Title */}
      <div className="flex items-center space-x-2">
        <BoltIcon className="h-5 w-5 text-blue-600" />
        <span className="text-sm font-semibold text-gray-900">Smart Energy Tracker</span>
      </div>

      {/* Center: Stats */}
      <UsageStatsCard />
      {/* Right: Date, Time, Icons */}
      <div className="flex items-center space-x-4">
        <div className="text-right text-xs">
          <div className="text-sm text-gray-800 font-semibold">{formattedDate}</div>
          <div className="text-[11px] text-gray-500">{formattedTime}</div>
        </div>
        <Cog6ToothIcon className="h-5 w-5 text-gray-600" />
        <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center">
          <UserCircleIcon className="h-5 w-5" />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
