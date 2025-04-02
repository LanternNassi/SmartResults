"use client"

import type React from "react"

import { useState } from "react"
import { Check, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import { StudentResultPDF } from "./StudentResultPDF"

import { useRouter } from "next/navigation"
import { Document, Page, Text, View, StyleSheet, PDFDownloadLink, BlobProvider } from "@react-pdf/renderer";


interface ResultsDialogProps {
  children: React.ReactNode
}

interface Student {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  indexNo: string;
  paid: boolean;
  class: string;
  gender: string;
  schoolId: number;
  createdAt: string;
  updatedAt: string;
}

interface StudentResultProps {
  student: Student
  result: Array<{
    id: number
    result: number
    subjectpaper: {
      id: number
      subject: {
        id: number
        name: string
      }
      paper: string
    }
  }>
}

const studentData: Student = {
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
interface School {
  id: number;
  name: string;
  address: string;
  email: string;
  phoneNumber: string;
  principal: string;
  createdAt: string;
  updatedAt: string;
}

export function ResultsDialog({ children }: ResultsDialogProps) {
  const [indexNumber, setIndexNumber] = useState("")
  const [email, setEmail] = useState("")
  const [school, setSchool] = useState("")
  const [schoolobj , setschoolobj] = useState<School | null>(null)
  const [name, setName] = useState("")

  const [student, setstudent] = useState<Student | null>(null)

  const [isPaid, setIsPaid] = useState(false)

  const [results, setResults] = useState<StudentResultProps | null>(null)


  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState("")
  const [open, setOpen] = useState(false)

  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    // Validate form
    if (!indexNumber.trim()) {
      setError("Please enter your index number")
      return
    }

    if (!email.trim()) {
      setError("Please enter your email address")
      return
    }

    if (!email.includes("@")) {
      setError("Please enter a valid email address")
      return
    }

    setIsSubmitting(true)

    // Simulate API call
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000))
      setIsSubmitting(false)
      setIsSuccess(true)

      // Reset form after 3 seconds and close dialog
      setTimeout(() => {
        setIsSuccess(false)
        setIndexNumber("")
        setEmail("")
        setOpen(false)
        // router.push("/results/" + student?.id)
      }, 3000)
    } catch (err) {
      setIsSubmitting(false)
      setError("An error occurred. Please try again.")
    }
  }

  const resetForm = () => {
    setIndexNumber("")
    setEmail("")
    setError("")
    setName("")
    setstudent(null)
    setSchool("")
    setIsSubmitting(false)
    setIsSuccess(false)
  }

  const getStudentByIndex = async (index: string) => {
    const res = await fetch(`/api/interactive/student?index=${index}`, {
      method: "GET",
      cache: "no-store",
    })
    if (!res.ok) {
      throw new Error("Failed to fetch data")
    }
    return res.json()
  }

  const getSchoolById = async (id: number) => {
    const res = await fetch(`/api/schools/${id}`, {
      method: "GET",
      cache: "no-store",
    })
    if (!res.ok) {
      throw new Error("Failed to fetch data")
    }
    return res.json()
  }

  const getStudentResults = async (id: number) => {
    const res = await fetch(`/api/results?studentId=${id}`, {
      method: "GET",
      cache: "no-store",
    })
    if (!res.ok) {
      throw new Error("Failed to fetch data")
    }
    return res.json()
  }


  return (
    <Dialog
      open={open}
      onOpenChange={(newOpen) => {
        setOpen(newOpen)
        if (!newOpen) resetForm()
      }}
    >
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Check Your Results</DialogTitle>
          <DialogDescription>
            {student ? (
              <>
                <p>
                  Results will be sent to: <span className="font-medium">{email} and {student?.phone}</span>
                </p>

              </>
            ) : (null)}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="index-number">Index Number</Label>
              <Input
                id="index-number"
                value={indexNumber}
                onChange={(e) => {
                  setIndexNumber(e.target.value)
                  if (e.target.value.length > 5) {
                    getStudentByIndex(e.target.value).then((data) => {
                      if (data.error) {
                        setError(data.error)
                      } else {
                        setError("")
                        setstudent(data)
                        setEmail(data.email)
                        setSchool(data.school.name)
                        setName(data.firstName + " " + data.lastName)
                      }
                    })
                  } else {
                    setError("")
                  }
                }}
                placeholder="Enter your index number"
                disabled={isSubmitting || isSuccess}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                type="name"
                value={name}
                placeholder="The name you registered with"
                disabled={true}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="school">School</Label>
              <Input
                id="school"
                type="school"
                value={school}
                placeholder="The school you are registered with"
                disabled={true}
              />
            </div>

            {error && <p className="text-sm text-red-500">{error}</p>}
            {isSuccess && (
              <div className="flex items-center gap-2 text-sm text-green-500">
                <Check className="h-4 w-4" />
                <span>Results will be sent to your email shortly!</span>
              </div>
            )}
          </div>
          <DialogFooter>
            {
              results && student  && schoolobj ? (
                <BlobProvider document={<StudentResultPDF student={student as Student} school={schoolobj as School} result={results?.result || []} />}>
                  {({ blob, url, loading, error }) => (
                    <div className="flex flex-col gap-4">
                      {/* Preview button using the URL */}
                      {url && (
                        <Button
                          type="button"
                          onClick={() => window.open(url, '_blank')}
                          className="w-full"
                        >
                          Preview PDF
                        </Button>
                      )}

                      {/* Server upload button using the blob */}
                      <Button
                        type="button"
                        onClick={() => {
                          if (blob) {
                            setIsSubmitting(true);
                            setTimeout(() => {
                              setIsSuccess(true);
                              setIsSubmitting(false);
                            }, 2000)
                            // uploadPdfToServer(blob as Blob).then(() => {
                            //   setIsSuccess(true);
                            //   setIsSubmitting(false);
                            // }).catch((err: string) => {
                            //   setError(err);
                            //   setIsSubmitting(false);
                            // });
                          }
                        }}
                        disabled={isSubmitting || isSuccess || !blob}
                        className="w-full"
                      >
                          {isSubmitting ? "Sending..." :
                            isSuccess ? "Sent Successfully" :
                              "Send Results"}
                      </Button>
                    </div>
                  )}
                </BlobProvider>
              ) : (
                <Button
                  type="button"
                  onClick={() => {
                    if (student) {
                      setIsSubmitting(true);
                      getSchoolById(student.schoolId).then((data) => {
                        if (data.error) {
                          setError(data.error)
                        }else {
                          setschoolobj(data)
                        }
                      }
                      )
                      getStudentResults(student.id).then((data) => {
                        setIsSubmitting(false);
                        if (data.error) {
                          setError(data.error)
                        } else {
                          setResults(data)
                          setIsPaid(data.paid)
                        }
                      })
                    }
                  }}
                  disabled={isSubmitting}
                  className="w-full"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    "Process Results (UGX 500)"
                  )}
                </Button>
              )
            }




          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default ResultsDialog