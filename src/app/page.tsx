"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import LoadingSpinner from "./components/LoadingSpinner";
import SearchBar from "./components/SearchBar";
import AdvocateTable from "./components/AdvocateTable";
import EmptyState from "./components/EmptyState";
import ErrorState from "./components/ErrorState";
import { Advocate } from "./models/advocate";
import { ApiResponse } from "./models/api-response";

const DEBOUNCE_DELAY = 300; // in milliseconds

export default function Home() {
  const [advocates, setAdvocates] = useState<Advocate[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchAdvocates = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/api/advocates");

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const jsonResponse: ApiResponse = await response.json();
        setAdvocates(jsonResponse.data || []);
      } catch (err) {
        console.error("Error fetching advocates:", err);
        setError(
          err instanceof Error ? err.message : "Failed to load advocates"
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchAdvocates();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, DEBOUNCE_DELAY);

    return () => {
      clearTimeout(timer);
    };
  }, [searchTerm]);

  const filteredAdvocates = useMemo(() => {
    if (!debouncedSearchTerm.trim()) {
      return advocates;
    }

    const searchLower = debouncedSearchTerm.toLowerCase().trim();

    return advocates.filter((advocate) => {
      const fullName = `${advocate.firstName} ${advocate.lastName}`.toLowerCase();

      return (
        fullName.includes(searchLower) ||
        advocate.firstName.toLowerCase().includes(searchLower) ||
        advocate.lastName.toLowerCase().includes(searchLower) ||
        advocate.city.toLowerCase().includes(searchLower) ||
        advocate.degree.toLowerCase().includes(searchLower) ||
        advocate.specialties.some((s) =>
          s.toLowerCase().includes(searchLower)
        ) ||
        advocate.yearsOfExperience.toString().includes(debouncedSearchTerm)
      );
    });
  }, [advocates, debouncedSearchTerm]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleReset = useCallback(() => {
    setSearchTerm("");
    setDebouncedSearchTerm("");
  }, []);

  const handleRetry = () => {
    window.location.reload();
  };

  if (isLoading) {
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
          debouncedSearchTerm={debouncedSearchTerm}
          resultCount={filteredAdvocates.length}
          totalCount={advocates.length}
          onChange={handleSearchChange}
          onReset={handleReset}
        />

        {error && <ErrorState error={error} onRetry={handleRetry} />}

        {filteredAdvocates.length === 0 && !error && debouncedSearchTerm && (
          <EmptyState
            type="no-results"
            searchTerm={debouncedSearchTerm}
            onClear={handleReset}
          />
        )}

        {advocates.length === 0 && !error && !isLoading && (
          <EmptyState type="no-data" />
        )}

        {filteredAdvocates.length > 0 && (
          <AdvocateTable advocates={filteredAdvocates} />
        )}
      </div>
    </main>
  );
}
