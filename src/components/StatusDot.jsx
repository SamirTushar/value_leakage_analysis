export default function StatusDot({ status }) {
  if (status === 'entered') {
    return (
      <span className="flex items-center justify-center w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 text-xs font-bold">
        ✓
      </span>
    );
  }

  if (status === 'next') {
    return (
      <span className="flex items-center justify-center w-5 h-5 rounded-full bg-amber-100 animate-pulse-dot">
        <span className="w-2 h-2 rounded-full bg-amber-500" />
      </span>
    );
  }

  // 'later'
  return (
    <span className="flex items-center justify-center w-5 h-5 rounded-full bg-gray-100">
      <span className="w-2 h-2 rounded-full bg-gray-300" />
    </span>
  );
}
