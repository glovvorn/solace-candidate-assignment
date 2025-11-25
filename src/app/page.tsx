// src/app/page.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import LoadingSpinner from "./components/LoadingSpinner";
import SearchBar from "./components/SearchBar";
import AdvocateTable from "./components/AdvocateTable";
import EmptyState from "./components/EmptyState";
import ErrorState from "./components/ErrorState";
import Pagination from "./components/Pagination";
import { useAdvocates } from "./hooks/useAdvocates";

const DEBOUNCE_DELAY = 300; // in milliseconds

export default function Home() {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState<string>("");

  const { advocates, pagination, isLoading, error, fetchAdvocates } =
    useAdvocates(1, 50);

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, DEBOUNCE_DELAY);

    return () => {
      clearTimeout(timer);
    };
  }, [searchTerm]);

  // Fetch advocates when debounced search changes
  useEffect(() => {
    fetchAdvocates(1, debouncedSearchTerm);
  }, [debouncedSearchTerm, fetchAdvocates]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleReset = useCallback(() => {
    setSearchTerm("");
    setDebouncedSearchTerm("");
  }, []);

  const handleRetry = () => {
    fetchAdvocates(1, debouncedSearchTerm);
  };

  const handlePageChange = (page: number) => {
    fetchAdvocates(page, debouncedSearchTerm);
    // Scroll to top of results
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (isLoading && advocates.length === 0) {
    return <LoadingSpinner />;
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Find Your Advocate
          </h1>
          <p className="text-lg text-gray-600">
            Connect with experienced healthcare advocates who can help guide
            your journey
          </p>
        </header>

        <SearchBar
          searchTerm={searchTerm}
          onChange={handleSearchChange}
          onReset={handleReset}
          statusMessage={
            debouncedSearchTerm
              ? `Showing ${pagination?.total ?? 0} result${
                  (pagination?.total ?? 0) !== 1 ? "s" : ""
                } for "${debouncedSearchTerm}"`
              : `Showing all ${pagination?.total ?? 0} advocates`
          }
        />

        {error && <ErrorState error={error} onRetry={handleRetry} />}

        {advocates.length === 0 && !error && debouncedSearchTerm && (
          <EmptyState
            type="no-results"
            searchTerm={debouncedSearchTerm}
            onClear={handleReset}
          />
        )}

        {advocates.length === 0 &&
          !error &&
          !isLoading &&
          !debouncedSearchTerm && <EmptyState type="no-data" />}

        {advocates.length > 0 && (
          <>
            <AdvocateTable advocates={advocates} />

            {isLoading && (
              <div className="flex justify-center py-8">
                <div className="inline-block w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
              </div>
            )}

            {pagination && (
              <Pagination
                currentPage={pagination.page}
                totalPages={pagination.totalPages}
                onPageChange={handlePageChange}
                isLoading={isLoading}
              />
            )}
          </>
        )}
      </div>
    </main>
  );
}
