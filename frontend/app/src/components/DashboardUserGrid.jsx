import React from "react";
import { FaUsers } from "react-icons/fa6";
import { GrUserAdmin } from "react-icons/gr";


function DashboardUserGrid( {userData} ) {
  const processedUserData = Array.isArray(userData) && userData.length === 2 ? userData : [0, 0];
  return (
    <div className="flex gap-4 w-1/2">
        <BoxWrapper>
          <div className="h-12 w-12 flex items-center justify-center rounded-full bg-sky-500">
            <FaUsers className="text-2xl"/>
          </div>
          <div className="pl-4">
            <span className="text-sm text-gray-500 font-light">Total Users</span>
            <div className="flex items-center">
              <strong className="text-xl text-gray-700 font-semibold">{processedUserData[0][0]}</strong>
            </div>
          </div>
        </BoxWrapper>
        <BoxWrapper>
          <div className="h-12 w-12 flex items-center justify-center rounded-full bg-orange-600">
            <GrUserAdmin className="text-2xl"/>
          </div>
          <div className="pl-4">
            <span className="text-sm text-gray-500 font-light">Admin Users</span>
            <div className="flex items-center">
              <strong className="text-xl text-gray-700 font-semibold">{processedUserData[0][1]}</strong>
            </div>
          </div>
        </BoxWrapper>
    </div>
  )
}

export default DashboardUserGrid;

function BoxWrapper({children}) {
    return <div className="bg-white rounded-sm p-4 flex-1 border
         border-gray-200 flex items-center">{children}</div>
}