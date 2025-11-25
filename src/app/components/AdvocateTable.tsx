import { Advocate } from "../models/advocate";

interface AdvocateTableProps {
  advocates: Advocate[];
}

export default function AdvocateTable({ advocates }: AdvocateTableProps) {
  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Location
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Credentials
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Specialties
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Experience
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Contact
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {advocates.map((advocate) => (
              <tr 
                key={advocate.id || `${advocate.firstName}-${advocate.lastName}-${advocate.phoneNumber}`}
                className="hover:bg-blue-50 transition-colors"
              >
                <td className="px-6 py-4">
                  <div className="font-medium text-gray-900">
                    {advocate.firstName} {advocate.lastName}
                  </div>
                </td>
                <td className="px-6 py-4 text-gray-600">
                  {advocate.city}
                </td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                    {advocate.degree}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-1">
                    {advocate.specialties.map((specialty, idx) => (
                      <span
                        key={`${advocate.id || advocate.phoneNumber}-specialty-${idx}`}
                        className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-800"
                      >
                        {specialty}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-6 py-4 text-gray-600">
                  {advocate.yearsOfExperience} {advocate.yearsOfExperience === 1 ? 'year' : 'years'}
                </td>
                <td className="px-6 py-4">
                  <a 
                    href={`tel:${advocate.phoneNumber}`}
                    className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
                  >
                    {advocate.phoneNumber}
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
