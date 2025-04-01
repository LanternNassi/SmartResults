"use client"

import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

const data = [
  {
    name: "St Henry's College",
    paid: 245,
    unpaid: 75,
  },
  {
    name: "St Mary's College",
    paid: 312,
    unpaid: 68,
  },
  {
    name: "Masaka Secondary",
    paid: 185,
    unpaid: 105,
  },
  {
    name: "Other Schools",
    paid: 100,
    unpaid: 158,
  },
]

export function PaymentStatusChart() {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis fontSize={12} tickLine={false} axisLine={false} />
        <Tooltip />
        <Legend />
        <Bar dataKey="paid" name="Paid" fill="#10b981" radius={[4, 4, 0, 0]} />
        <Bar dataKey="unpaid" name="Unpaid" fill="#ef4444" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}

export default PaymentStatusChart