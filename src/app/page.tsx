"use client";

import { useEffect, useState } from "react";

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

export default function Home() {
  const [advocates, setAdvocates] = useState<Advocate[]>([]);
  const [filteredAdvocates, setFilteredAdvocates] = useState<Advocate[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log("fetching advocates...");
    fetch("/api/advocates")
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((jsonResponse) => {
        setAdvocates(jsonResponse.data);
        setFilteredAdvocates(jsonResponse.data);
      })
      .catch((err) => {
        console.error("Error fetching advocates:", err);
        setError(err.message);
      });
  }, []);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchValue = e.target.value;

    setSearchTerm(searchValue);

    console.log("filtering advocates...");

    const searchLower = searchValue.toLowerCase();
    
    const filteredAdvocates = advocates.filter((advocate) => {
      return (
        advocate.firstName.toLowerCase().includes(searchLower) ||
        advocate.lastName.toLowerCase().includes(searchLower) ||
        advocate.city.toLowerCase().includes(searchLower) ||
        advocate.degree.toLowerCase().includes(searchLower) ||
        advocate.specialties.some(s => s.toLowerCase().includes(searchLower)) ||
        advocate.yearsOfExperience.toString().includes(searchValue)
      );
    });

    setFilteredAdvocates(filteredAdvocates);
  };

  const onClick = () => {
    console.log(advocates);
    setSearchTerm("");
    setFilteredAdvocates(advocates);
  };

  return (
    <main style={{ margin: "24px" }}>
      <h1>Solace Advocates</h1>
      <br />
      <br />
      <div>
        <p>Search</p>
        <p>
          Searching for: <span>{searchTerm}</span>
        </p>
        <input style={{ border: "1px solid black" }} onChange={onChange} value={searchTerm} />
        <button onClick={onClick}>Reset Search</button>
      </div>
      <br />
      <br />
      {error && (
        <div style={{ color: "red", marginBottom: "20px" }}>
          Error loading advocates: {error}
        </div>
      )}
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
    </main>
  );
}
