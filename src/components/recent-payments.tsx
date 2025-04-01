"use client"

import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

const recentPayments = [
  {
    id: "PAY-1234",
    student: "John Mukasa",
    school: "St Henry's College Kitovu",
    amount: "500",
    date: "2023-04-01",
    status: "completed",
  },
  {
    id: "PAY-1235",
    student: "Sarah Nakato",
    school: "St Mary's College Kisubi",
    amount: "500",
    date: "2023-04-01",
    status: "completed",
  },
  {
    id: "PAY-1236",
    student: "David Ochieng",
    school: "Masaka Secondary School",
    amount: "500",
    date: "2023-04-01",
    status: "completed",
  },
  {
    id: "PAY-1237",
    student: "Grace Auma",
    school: "St Henry's College Kitovu",
    amount: "500",
    date: "2023-03-31",
    status: "completed",
  },
  {
    id: "PAY-1238",
    student: "Peter Okello",
    school: "St Mary's College Kisubi",
    amount: "500",
    date: "2023-03-31",
    status: "pending",
  },
]

export function RecentPayments() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>Student</TableHead>
          <TableHead>School</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {recentPayments.map((payment) => (
          <TableRow key={payment.id}>
            <TableCell className="font-medium">{payment.id}</TableCell>
            <TableCell>{payment.student}</TableCell>
            <TableCell>{payment.school}</TableCell>
            <TableCell>UGX {payment.amount}</TableCell>
            <TableCell>
              <Badge
                variant={payment.status === "completed" ? "default" : "outline"}
                className={
                  payment.status === "completed"
                    ? "bg-green-500 hover:bg-green-500/80"
                    : "text-amber-500 border-amber-500"
                }
              >
                {payment.status}
              </Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

