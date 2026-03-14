import { useState, useRef, useEffect } from 'react';

export default function InfoTooltip({ text }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [open]);

  return (
    <span className="relative inline-block" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="inline-flex items-center justify-center w-5 h-5 rounded-full border border-gray-300 text-gray-400 text-xs hover:border-gray-400 hover:text-gray-500 transition-colors cursor-pointer"
        aria-label="More info"
      >
        i
      </button>
      {open && (
        <div className="absolute z-50 left-0 top-7 w-72 p-3 bg-white border border-gray-200 rounded-lg shadow-lg text-sm text-gray-600 leading-relaxed">
          {text}
        </div>
      )}
    </span>
  );
}
