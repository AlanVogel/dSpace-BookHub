import React from "react";
import {GiBookCover, GiWhiteBook} from "react-icons/gi";

function DashboardBooksGrid() {
  return (
    <div className="flex gap-4 w-1/2">
        <BoxWrapper>
          <div className="h-12 w-12 flex items-center justify-center rounded-full bg-sky-500">
            <GiWhiteBook className="text-2xl"/>
          </div>
          <div className="pl-4">
            <span className="text-sm text-gray-500 font-light">Total Books</span>
            <div className="flex items-center">
              <strong className="text-xl text-gray-700 font-semibold">0</strong>
            </div>
          </div>
        </BoxWrapper>
        <BoxWrapper>
          <div className="h-12 w-12 flex items-center justify-center rounded-full bg-orange-600">
            <GiBookCover className="text-2xl"/>
          </div>
          <div className="pl-4">
            <span className="text-sm text-gray-500 font-light">My Books</span>
            <div className="flex items-center">
              <strong className="text-xl text-gray-700 font-semibold">0</strong>
            </div>
          </div>
        </BoxWrapper>
    </div>
  )
}

export default DashboardBooksGrid;

function BoxWrapper({children}) {
    return <div className="bg-white rounded-sm p-4 flex-1 border
         border-gray-200 flex items-center">{children}</div>
}