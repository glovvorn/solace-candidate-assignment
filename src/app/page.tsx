"use client";

import { useEffect, useState, useMemo, useCallback } from "react";

interface Advocate {
  id: string;
  firstName: string;
  lastName: string;
  city: string;
  degree: string;
  specialties: string[];
  yearsOfExperience: number;
  phoneNumber: string;
}

interface ApiResponse {
  data: Advocate[];
}

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
        setError(err instanceof Error ? err.message : "Failed to load advocates");
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

    // Cleanup function to cancel the timer if searchTerm changes
    return () => {
      clearTimeout(timer);
    };
  }, [searchTerm]);

  // This prevents re-filtering on every render, only when dependencies change
  const filteredAdvocates = useMemo(() => {
    if (!debouncedSearchTerm.trim()) {
      return advocates;
    }

    const searchLower = debouncedSearchTerm.toLowerCase().trim();
    
    return advocates.filter((advocate) => {
      return (
        advocate.firstName.toLowerCase().includes(searchLower) ||
        advocate.lastName.toLowerCase().includes(searchLower) ||
        advocate.city.toLowerCase().includes(searchLower) ||
        advocate.degree.toLowerCase().includes(searchLower) ||
        advocate.specialties.some(s => s.toLowerCase().includes(searchLower)) ||
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

  if (isLoading) {
    return (
      <main style={{ margin: "24px" }}>
        <h1>Solace Advocates</h1>
        <p>Loading advocates...</p>
      </main>
    );
  }

  return (
    <main style={{ margin: "24px" }}>
      <h1>Solace Advocates</h1>
      <br />
      <br />
      <div>
        <p>Search</p>
        <p>
          Searching for: <span>{debouncedSearchTerm}</span>
        </p>
        <input 
          style={{ border: "1px solid black" }} 
          onChange={handleSearchChange}
          value={searchTerm}
          placeholder="Search by name, city, degree, specialty..."
        />
        <button onClick={handleReset}>Reset Search</button>
      </div>
      <br />
      <br />
      {error && (
        <div style={{ color: "red", marginBottom: "20px" }}>
          Error loading advocates: {error}
        </div>
      )}
      {filteredAdvocates.length === 0 && !error && debouncedSearchTerm && (
        <p>No advocates found matching &quot;{debouncedSearchTerm}&quot;</p>
      )}
      {filteredAdvocates.length > 0 && (
        <table>
          <thead>
            <tr>
              <th>First Name</th>
              <th>Last Name</th>
              <th>City</th>
              <th>Degree</th>
              <th>Specialties</th>
              <th>Years of Experience</th>
              <th>Phone Number</th>
            </tr>
          </thead>
          <tbody>
            {filteredAdvocates.map((advocate) => {
              return (
                <tr key={advocate.id || `${advocate.firstName}-${advocate.lastName}-${advocate.phoneNumber}`}>
                  <td>{advocate.firstName}</td>
                  <td>{advocate.lastName}</td>
                  <td>{advocate.city}</td>
                  <td>{advocate.degree}</td>
                  <td>
                    {advocate.specialties.map((s, index) => (
                      <div key={`${advocate.id || advocate.phoneNumber}-specialty-${index}`}>
                        {s}
                      </div>
                    ))}
                  </td>
                  <td>{advocate.yearsOfExperience}</td>
                  <td>{advocate.phoneNumber}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </main>
  );
}
