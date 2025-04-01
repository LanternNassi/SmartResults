"use client";


import { useEffect, useState } from 'react';
import StudentResultsPDFGenerator from '@/components/StudentResultPDF';

interface Student {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    indexNo: string;
    paid : boolean;
    class: string;
    gender: string;
    schoolId: number;
    createdAt: string;
    updatedAt: string;
}

export default function StudentResultsPage() {
  // In a real application, you would fetch this data from an API
  // but for this example, we'll use the static data provided
  const studentData : Student = {
    id: 3,
    firstName: "Ntambi",
    lastName: "Nassim",
    indexNo: "U0016168/34",
    email: "Lanternnassi@gmail.com",
    phone: "0758989094",
    gender: "Male",
    paid: false,
    class: "S.4",
    schoolId: 1,
    createdAt: "2025-03-30T07:14:47.464Z",
    updatedAt: "2025-03-30T07:14:47.464Z"
  };
  
  const resultData = [
    {
      id: 1,
      studentId: 3,
      subjectpaperId: 1,
      result: 34,
      added_by: 1,
      createdAt: "2025-03-31T10:50:47.580Z",
      updatedAt: "2025-03-31T10:50:47.580Z",
      subjectpaper: {
        id: 1,
        subjectId: 4,
        paper: "Paper 1",
        createdAt: "2025-03-30T08:20:39.160Z",
        updatedAt: "2025-03-30T08:20:39.160Z",
        subject: {
          id: 4,
          name: "English",
          code: "P201-34",
          description: "English paper.",
          class: "S.4",
          createdAt: "2025-03-30T08:20:39.160Z",
          updatedAt: "2025-03-30T08:20:39.160Z"
        }
      }
    },
    {
      id: 2,
      studentId: 3,
      subjectpaperId: 2,
      result: 56,
      added_by: 1,
      createdAt: "2025-03-31T10:50:47.580Z",
      updatedAt: "2025-03-31T10:50:47.580Z",
      subjectpaper: {
        id: 2,
        subjectId: 4,
        paper: "Paper 2",
        createdAt: "2025-03-30T08:20:39.160Z",
        updatedAt: "2025-03-30T08:20:39.160Z",
        subject: {
          id: 4,
          name: "English",
          code: "P201-34",
          description: "English paper.",
          class: "S.4",
          createdAt: "2025-03-30T08:20:39.160Z",
          updatedAt: "2025-03-30T08:20:39.160Z"
        }
      }
    }
  ];

  // Use state to control dynamic component loading (for SSR compatibility)
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Student Results</h1>
      
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4">Student Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p><span className="font-bold">Name:</span> {studentData.firstName} {studentData.lastName}</p>
            <p><span className="font-bold">Index Number:</span> {studentData.indexNo}</p>
            <p><span className="font-bold">Class:</span> {studentData.class}</p>
          </div>
          <div>
            <p><span className="font-bold">Gender:</span> {studentData.gender}</p>
            <p><span className="font-bold">Email:</span> {studentData.email}</p>
            <p><span className="font-bold">Phone:</span> {studentData.phone}</p>
          </div>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4">Examination Results</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead>
              <tr className="bg-gray-100 border-b">
                <th className="py-3 px-4 text-left">Subject</th>
                <th className="py-3 px-4 text-left">Paper</th>
                <th className="py-3 px-4 text-left">Marks</th>
              </tr>
            </thead>
            <tbody>
              {resultData.map((result, index) => (
                <tr key={index} className="border-b">
                  <td className="py-3 px-4">{result.subjectpaper.subject.name}</td>
                  <td className="py-3 px-4">{result.subjectpaper.paper}</td>
                  <td className="py-3 px-4">{result.result}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="font-bold">
                <td className="py-3 px-4" colSpan={2}>Total Marks:</td>
                <td className="py-3 px-4">
                  {resultData.reduce((sum, item) => sum + item.result, 0)}
                </td>
              </tr>
              <tr className="font-bold">
                <td className="py-3 px-4" colSpan={2}>Average:</td>
                <td className="py-3 px-4">
                  {(resultData.reduce((sum, item) => sum + item.result, 0) / resultData.length).toFixed(2)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
      
      {/* Only render PDF component on client-side */}
      {isClient && (
        <StudentResultsPDFGenerator student={studentData} result={resultData} />
      )}
    </div>
  );
}