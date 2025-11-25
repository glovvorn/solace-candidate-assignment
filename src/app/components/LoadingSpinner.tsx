export default function LoadingSpinner() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
      <div className="text-center">
        <div className="inline-block w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">Loading Advocates</h2>
        <p className="text-gray-600">Please wait while we fetch the latest information...</p>
      </div>
    </main>
  );
}
