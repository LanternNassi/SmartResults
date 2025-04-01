"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

const registrations = [
  {
    id: "U0016168/34",
    name: "John Mukasa",
    school: "St Henry's College Kitovu",
    class: "S.4",
    paid: true,
    subjects: 8,
  },
  {
    id: "U0043/262",
    name: "Sarah Nakato",
    school: "St Henry's College Kitovu",
    class: "S.6",
    paid: true,
    subjects: 3,
  },
  {
    id: "U0034/383",
    name: "David Ochieng",
    school: "St Mary's College Kisubi",
    class: "S.4",
    paid: false,
    subjects: 8,
  },
  {
    id: "U0034/143",
    name: "Grace Auma",
    school: "Masaka Secondary School",
    class: "S.4",
    paid: false,
    subjects: 8,
  },
  {
    id: "U0056/201",
    name: "Peter Okello",
    school: "St Mary's College Kisubi",
    class: "S.6",
    paid: true,
    subjects: 3,
  },
]

export function ExamRegistrationTable() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Index Number</TableHead>
          <TableHead>Student Name</TableHead>
          <TableHead>School</TableHead>
          <TableHead>Class</TableHead>
          <TableHead>Subjects</TableHead>
          <TableHead>Payment</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {registrations.map((registration) => (
          <TableRow key={registration.id}>
            <TableCell className="font-medium">{registration.id}</TableCell>
            <TableCell>{registration.name}</TableCell>
            <TableCell>{registration.school}</TableCell>
            <TableCell>{registration.class}</TableCell>
            <TableCell>{registration.subjects}</TableCell>
            <TableCell>
              <Badge
                variant={registration.paid ? "default" : "outline"}
                className={registration.paid ? "bg-green-500 hover:bg-green-500/80" : "text-red-500 border-red-500"}
              >
                {registration.paid ? "Paid" : "Not Paid"}
              </Badge>
            </TableCell>
            <TableCell>
              <Button variant="outline" size="sm">
                View
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

