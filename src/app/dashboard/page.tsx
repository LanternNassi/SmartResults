import { BarChart, DollarSign, GraduationCap, School, Users } from "lucide-react"
import Link from "next/link"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PaymentStatusChart } from "@/components/payment-status-chart"
import { SchoolDistributionChart } from "@/components/school-distribution-chart"
import { StudentsByClassChart } from "@/components/students-by-class-chart"
import { RecentPayments } from "@/components/recent-payments"
import { ExamRegistrationTable } from "@/components/exam-registration-table"

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <header className="top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
        <div className="flex items-center gap-2">
          <BarChart className="h-6 w-6" />
          <h1 className="text-xl font-semibold">Dashboard</h1>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <Link
            href="#"
            className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
          >
            Generate Reports
          </Link>
        </div>
      </header>
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Students</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,248</div>
              <p className="text-xs text-muted-foreground">+12% from last month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Payment Status</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">68%</div>
              <div className="mt-2 flex items-center gap-2">
                <Progress value={68} className="h-2" />
                <span className="text-xs text-muted-foreground">842 paid</span>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Registered Schools</CardTitle>
              <School className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">24</div>
              <p className="text-xs text-muted-foreground">+3 new schools this term</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Exam Registrations</CardTitle>
              <GraduationCap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,024</div>
              <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                <span className="font-medium text-green-500">S.4: 624</span>
                <span className="font-medium text-blue-500">S.6: 400</span>
              </div>
            </CardContent>
          </Card>
        </div>
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="payments">Payments</TabsTrigger>
            <TabsTrigger value="registrations">Registrations</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <Card className="lg:col-span-4">
                <CardHeader>
                  <CardTitle>Payment Status Overview</CardTitle>
                  <CardDescription>Distribution of payment status across schools and classes</CardDescription>
                </CardHeader>
                <CardContent className="pl-2">
                  <PaymentStatusChart />
                </CardContent>
              </Card>
              <Card className="lg:col-span-3">
                <CardHeader>
                  <CardTitle>School Distribution</CardTitle>
                  <CardDescription>Number of students registered per school</CardDescription>
                </CardHeader>
                <CardContent>
                  <SchoolDistributionChart />
                </CardContent>
              </Card>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <Card className="lg:col-span-3">
                <CardHeader>
                  <CardTitle>Students by Class</CardTitle>
                  <CardDescription>Distribution of students across class levels</CardDescription>
                </CardHeader>
                <CardContent>
                  <StudentsByClassChart />
                </CardContent>
              </Card>
              <Card className="lg:col-span-4">
                <CardHeader>
                  <CardTitle>Recent Payments</CardTitle>
                  <CardDescription>Latest payment transactions</CardDescription>
                </CardHeader>
                <CardContent>
                  <RecentPayments />
                </CardContent>
                <CardFooter>
                  <Link href="#" className="text-sm text-blue-500 hover:underline">
                    View all payments
                  </Link>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value="payments" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Payment Analytics</CardTitle>
                <CardDescription>Detailed breakdown of payment status across schools and classes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-8">
                  <div>
                    <h3 className="mb-4 text-lg font-medium">Payment Status by School</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">St Henry's College Kitovu</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">245/320 paid</span>
                          <Progress value={76} className="h-2 w-32" />
                          <span className="text-sm font-medium">76%</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">St Mary's College Kisubi</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">312/380 paid</span>
                          <Progress value={82} className="h-2 w-32" />
                          <span className="text-sm font-medium">82%</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">Masaka Secondary School</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">185/290 paid</span>
                          <Progress value={64} className="h-2 w-32" />
                          <span className="text-sm font-medium">64%</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">Other Schools</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">100/258 paid</span>
                          <Progress value={39} className="h-2 w-32" />
                          <span className="text-sm font-medium">39%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="mb-4 text-lg font-medium">Payment Status by Class</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">S.4</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">512/624 paid</span>
                          <Progress value={82} className="h-2 w-32" />
                          <span className="text-sm font-medium">82%</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">S.6</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">330/400 paid</span>
                          <Progress value={83} className="h-2 w-32" />
                          <span className="text-sm font-medium">83%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="registrations" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Exam Registrations</CardTitle>
                <CardDescription>Students registered for upcoming examinations</CardDescription>
              </CardHeader>
              <CardContent>
                <ExamRegistrationTable />
              </CardContent>
              <CardFooter className="flex justify-between">
                <Link href="#" className="text-sm text-muted-foreground hover:underline">
                  Export data
                </Link>
                <Link href="#" className="text-sm text-blue-500 hover:underline">
                  View all registrations
                </Link>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}

