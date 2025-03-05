export function OrderStatus({ status, location, borrowedBy, onClick }) {
    return (
      <div className="relative inline-block">
        <button
          onClick={onClick}
          className={`capitalize py-1 px-2 rounded-md text-xs transition-all duration-200
            ${status === 'AVAILABLE' ? 'text-sky-600 bg-sky-100' : 'text-orange-600 bg-orange-100'}
            hover:bg-opacity-80 focus:outline-none`}
        >
          {status.toLowerCase()}
        </button>
      </div>
    );
}
