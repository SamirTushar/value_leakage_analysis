export default function ConvictionBadge({ type }) {
  const styles = {
    calculated: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    solid: 'bg-blue-50 text-blue-700 border-blue-200',
    estimated: 'bg-gray-100 text-gray-500 border-gray-200',
  };

  const labels = {
    calculated: 'Calculated',
    solid: 'Solid',
    estimated: 'Estimated',
  };

  return (
    <span className={`inline-block px-2.5 py-0.5 text-xs font-medium rounded-full border ${styles[type] || styles.estimated}`}>
      {labels[type] || type}
    </span>
  );
}
