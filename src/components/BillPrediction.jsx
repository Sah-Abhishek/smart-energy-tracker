import React from 'react';
import { BiDollar } from "react-icons/bi";


const MonthlyBillPrediction = () => {
  const estimatedTotal = 78.25;
  const currentUsage = 42.18;
  const projectedUsage = 36.07;
  const daysRemaining = 22;
  const billingCycle = 'Aug 1 - Aug 31';

  const totalUsage = currentUsage + projectedUsage;
  const currentPercentage = (currentUsage / totalUsage) * 100;
  const projectedPercentage = (projectedUsage / totalUsage) * 100;

  return (
    <div className="w-96 mt-20 rounded-2xl shadow-lg bg-white p-6 space-y-6 font-sans">
      <h2 className="text-base font-semibold text-gray-800">Monthly Bill Prediction</h2>

      <div>
        <p className="text-sm text-gray-500">Estimated Total</p>
        <div className="flex items-center space-x-2">
          <span className="text-4xl font-bold text-gray-900">${estimatedTotal.toFixed(2)}</span>
          <div className="ml-auto bg-blue-100 rounded-full p-1.5">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-blue-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12h6m-3-3v6m9-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Current Usage */}
      <div>
        <div className="flex justify-between text-sm text-gray-700 mb-2">
          <span className='font-bold text-gray-500'>Current Usage</span>
          <span>${currentUsage.toFixed(2)}</span>
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
          <span className='font-bold text-gray-500'>Projected Usage</span>
          <span className='font-bold'>${projectedUsage.toFixed(2)}</span>
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
          <p className="font-medium text-gray-800">{daysRemaining}</p>
        </div>
        <div className="text-right">
          <p className="text-gray-500">Billing Cycle</p>
          <p className="font-medium text-gray-800">{billingCycle}</p>
        </div>
      </div>
    </div >
  );
};

export default MonthlyBillPrediction;
