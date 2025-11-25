import { useState, useEffect, useCallback } from "react";
import { Advocate } from "../models/advocate";
import { PaginationMeta } from "../models/pagination";
import { ApiResponse } from "../models/api-response";

interface UseAdvocatesResult {
  advocates: Advocate[];
  pagination: PaginationMeta | null;
  isLoading: boolean;
  error: string | null;
  fetchAdvocates: (page: number, search?: string) => Promise<void>;
}

export function useAdvocates(
  initialPage = 1,
  limit = 50
): UseAdvocatesResult {
  const [advocates, setAdvocates] = useState<Advocate[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAdvocates = useCallback(
    async (page: number, search: string = "") => {
      try {
        setIsLoading(true);
        setError(null);

        const params = new URLSearchParams({
          page: page.toString(),
          limit: limit.toString(),
        });

        if (search) {
          params.append("search", search);
        }

        const response = await fetch(`/api/advocates?${params}`);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const jsonResponse: ApiResponse<Advocate> = await response.json();

        setAdvocates(jsonResponse.data || []);
        setPagination(jsonResponse.pagination);
      } catch (err) {
        console.error("Error fetching advocates:", err);
        setError(
          err instanceof Error ? err.message : "Failed to load advocates"
        );
      } finally {
        setIsLoading(false);
      }
    },
    [limit]
  );

  // Initial load
  useEffect(() => {
    fetchAdvocates(initialPage);
  }, []); // Empty dependency array - only run on mount

  return {
    advocates,
    pagination,
    isLoading,
    error,
    fetchAdvocates,
  };
}