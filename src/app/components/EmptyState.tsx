interface EmptyStateProps {
  type: "no-results" | "no-data";
  searchTerm?: string;
  onClear?: () => void;
}

export default function EmptyState({ type, searchTerm, onClear }: EmptyStateProps) {
  if (type === "no-results") {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-12 text-center border border-gray-100">
        <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">No Advocates Found</h3>
        <p className="text-gray-600 mb-4">
          We couldn&apos;t find any advocates matching &quot;<strong>{searchTerm}</strong>&quot;
        </p>
        {onClear && (
          <button
            onClick={onClear}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
          >
            Clear Search
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-12 text-center border border-gray-100">
      <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">No Advocates Available</h3>
      <p className="text-gray-600">
        There are currently no advocates in the system.
      </p>
    </div>
  );
}