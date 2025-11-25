interface SearchBarProps {
  searchTerm: string;
  debouncedSearchTerm: string;
  resultCount: number;
  totalCount: number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onReset: () => void;
}

export default function SearchBar({
  searchTerm,
  debouncedSearchTerm,
  resultCount,
  totalCount,
  onChange,
  onReset,
}: SearchBarProps) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-100">
      <label 
        htmlFor="advocate-search" 
        className="block text-sm font-semibold text-gray-700 mb-3"
      >
        Search by name, location, specialty, or experience
      </label>
      
      <div className="flex gap-3">
        <div className="flex-1 relative">
          <input
            id="advocate-search"
            type="text"
            value={searchTerm}
            onChange={onChange}
            placeholder="e.g., New York, Oncology, 10 years..."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            aria-label="Search advocates"
          />
          {searchTerm && (
            <button
              onClick={onReset}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Clear search"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
        
        {searchTerm && (
          <button
            onClick={onReset}
            className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors"
          >
            Reset
          </button>
        )}
      </div>

      {debouncedSearchTerm ? (
        <p className="mt-3 text-sm text-gray-600">
          Showing {resultCount} result{resultCount !== 1 ? 's' : ''} for 
          <span className="font-semibold text-gray-900"> &quot;{debouncedSearchTerm}&quot;</span>
        </p>
      ) : (
        <p className="mt-3 text-sm text-gray-600">
          Showing all {totalCount} advocate{totalCount !== 1 ? 's' : ''}
        </p>
      )}
    </div>
  );
}