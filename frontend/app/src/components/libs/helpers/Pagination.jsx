import React from "react";
import { AiOutlineLeft, AiOutlineRight } from "react-icons/ai"

export const Pagination = ({ currentPage, totalItems, rowsPerPage, onPageChange, onRowsPerPageChange }) => {
    const totalPages = Math.ceil(totalItems / rowsPerPage);

    return (
        <div className="flex items-center justify-center gap-x-8 mt-4">
            {/* Rows per page selector */}
            <div>
                <label className="mr-2 text-gray-700">Rows per page:</label>
                <select
                    value={rowsPerPage}
                    onChange={(e) => onRowsPerPageChange(Number(e.target.value))}
                    className="p-1 border rounded-md"
                >
                    <option value={2}>2</option>
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                </select>
            </div>

            {/* Pagination Navigation */}
            <div className="flex items-center">
                <button
                    className="p-2 bg-gray-200 rounded-md mr-2 disabled:opacity-50"
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                >
                    <AiOutlineLeft />
                </button>
                <span className="mx-2">
                    Page {currentPage} of {totalPages}
                </span>
                <button
                    className="p-2 bg-gray-200 rounded-md ml-2 disabled:opacity-50"
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                >
                    <AiOutlineRight />
                </button>
            </div>
        </div>
    );
};
