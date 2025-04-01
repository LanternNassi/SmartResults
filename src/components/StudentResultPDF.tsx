"use client"
import { Document, Page, Text, View, StyleSheet, PDFDownloadLink } from "@react-pdf/renderer"
import { Button } from "@/components/ui/button"

interface Student {
  id: number
  firstName: string
  lastName: string
  email: string
  phone: string
  indexNo: string
  paid: boolean
  class: string
  gender: string
  schoolId: number
  createdAt: string
  updatedAt: string
}

// Define styles for the PDF document
const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: "Helvetica",
    backgroundColor: "#ffffff",
  },
  header: {
    backgroundColor: "#2563eb",
    padding: 20,
    marginBottom: 20,
    borderRadius: 5,
  },
  headerText: {
    color: "white",
    textAlign: "center",
    fontSize: 22,
    fontWeight: "bold",
  },
  schoolName: {
    color: "white",
    textAlign: "center",
    fontSize: 16,
    marginTop: 5,
  },
  academicInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  academicInfoItem: {
    color: "white",
    fontSize: 12,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 10,
    backgroundColor: "#f3f4f6",
    padding: 8,
    borderRadius: 4,
    color: "#1f2937",
  },
  studentInfoContainer: {
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 5,
    padding: 15,
  },
  studentInfoRow: {
    flexDirection: "row",
    marginBottom: 8,
  },
  studentInfoColumn: {
    flex: 1,
    columnGap: 10,
  },
  studentDetails: {
    marginBottom: 10,
    flexDirection: "row",
    paddingVertical: 2
  },
  label: {
    width: "40%",
    fontWeight: "bold",
    color: "#4b5563",
  },
  value: {
    width: "60%",
    color: "#1f2937",
  },
  resultsTable: {
    marginTop: 10,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 5,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#2563eb",
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    paddingVertical: 8,
  },
  tableHeaderCell: {
    fontWeight: "bold",
    flex: 1,
    padding: 8,
    color: "white",
    textAlign: "center",
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
    borderBottomStyle: "solid",
  },
  tableRowEven: {
    backgroundColor: "#f9fafb",
  },
  tableRowOdd: {
    backgroundColor: "#ffffff",
  },
  tableCell: {
    flex: 1,
    padding: 8,
    textAlign: "center",
  },
  gradeCell: {
    flex: 1,
    padding: 8,
    textAlign: "center",
    fontWeight: "bold",
  },
  summaryContainer: {
    marginTop: 20,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 5,
    padding: 15,
    fontSize : 13,
    backgroundColor: "#f9fafb",
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  summaryLabel: {
    fontWeight: "bold",
    color: "#4b5563",
  },
  summaryValue: {
    fontWeight: "bold",
    color: "#2563eb",
  },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 30,
    right: 30,
    textAlign: "center",
    fontSize: 10,
    color: "#6b7280",
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
    paddingTop: 10,
  },
  watermark: {
    position: "absolute",
    bottom: 100,
    left: 0,
    right: 0,
    textAlign: "center",
    fontSize: 60,
    color: "rgba(229, 231, 235, 0.5)",
    transform: "rotate(-45deg)",
  },
  paymentStatus: {
    padding: 5,
    borderRadius: 4,
    fontWeight: "bold",
    textAlign: "center",
  },
  paidStatus: {
    backgroundColor: "#d1fae5",
    color: "#065f46",
  },
  unpaidStatus: {
    backgroundColor: "#fee2e2",
    color: "#b91c1c",
  },
})

// Helper function to determine grade based on marks
const getGrade = (marks: number) => {
  if (marks >= 80) return "A"
  if (marks >= 70) return "B"
  if (marks >= 60) return "C"
  if (marks >= 50) return "D"
  return "F"
}

// Helper function to get grade color
const getGradeColor = (grade: string) => {
  switch (grade) {
    case "A":
      return "#065f46"
    case "B":
      return "#0d9488"
    case "C":
      return "#0369a1"
    case "D":
      return "#b45309"
    default:
      return "#b91c1c"
  }
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

// PDF Document Component
export const StudentResultPDF = ({ student, result }: StudentResultProps) => {
  // Calculate total marks
  const totalMarks = result.reduce((sum, item) => sum + item.result, 0)

  // Calculate average marks
  const averageMarks = (totalMarks / result.length).toFixed(2)

  // Calculate overall grade
  const averageNumeric = Number.parseFloat(averageMarks)
  const overallGrade = getGrade(averageNumeric)

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header Section */}
        <View style={styles.header}>
          <Text style={styles.headerText}>STUDENT ACADEMIC RESULTS</Text>
          <Text style={styles.schoolName}>Example High School</Text>
          <View style={styles.academicInfo}>
            <Text style={styles.academicInfoItem}>Academic Year: 2025</Text>
            <Text style={styles.academicInfoItem}>Term: First Term</Text>
            <Text style={styles.academicInfoItem}>Class: {student.class}</Text>
          </View>
        </View>

        {/* Student Information Section */}
        <Text style={styles.sectionTitle}>STUDENT INFORMATION</Text>
        <View style={styles.studentInfoContainer}>
          <View style={styles.studentInfoRow}>
            <View style={styles.studentInfoColumn}>
              <View style={styles.studentDetails}>
                <Text style={{...styles.label , fontSize:12}}>Student Name:</Text>
                <Text style={{...styles.value , fontSize:12}}>
                  {student.firstName} {student.lastName}
                </Text>
              </View>
              <View style={styles.studentDetails}>
                <Text style={{...styles.label , fontSize:12}}>Index Number:</Text>
                <Text style={{...styles.value , fontSize:12}}>{student.indexNo}</Text>
              </View>
              <View style={styles.studentDetails}>
                <Text style={{...styles.label , fontSize:12}}>Gender:</Text>
                <Text style={{...styles.value , fontSize:12}}>{student.gender}</Text>
              </View>
            </View>
            <View style={styles.studentInfoColumn}>
              <View style={styles.studentDetails}>
                <Text style={{...styles.label , fontSize:12}}>Contact:</Text>
                <Text style={{...styles.value , fontSize:12}}>{student.phone}</Text>
              </View>
              <View style={styles.studentDetails}>
                <Text style={{...styles.label , fontSize:12}}>Email:</Text>
                <Text style={{...styles.value , fontSize:12}}>{student.email}</Text>
              </View>
              <View style={styles.studentDetails}>
                <Text style={{...styles.label , fontSize:12}}>Payment Status:</Text>
                <Text style={[styles.paymentStatus, student.paid ? styles.paidStatus : styles.unpaidStatus , {fontSize:12}]}>
                  {student.paid ? "PAID" : "NOT PAID"}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Examination Results Section */}
        <Text style={styles.sectionTitle}>EXAMINATION RESULTS</Text>
        <View style={styles.resultsTable}>
          <View style={styles.tableHeader}>
            <Text style={{...styles.tableHeaderCell , fontSize : 14}}>Subject</Text>
            <Text style={{...styles.tableHeaderCell , fontSize : 14}}>Paper</Text>
            <Text style={{...styles.tableHeaderCell , fontSize : 14}}>Marks</Text>
            <Text style={{...styles.tableHeaderCell , fontSize : 14}}>Grade</Text>
          </View>

          {result.map((item, index) => {
            const grade = getGrade(item.result)
            return (
              <View key={index} style={[styles.tableRow, index % 2 === 0 ? styles.tableRowEven : styles.tableRowOdd]}>
                <Text style={{...styles.tableCell , fontSize : 12}}>{item.subjectpaper.subject.name}</Text>
                <Text style={{...styles.tableCell , fontSize : 12}}>{item.subjectpaper.paper}</Text>
                <Text style={{...styles.tableCell , fontSize : 12}}>{item.result}</Text>
                <Text style={[styles.gradeCell, { color: getGradeColor(grade) } , {fontSize : 12}]}>{grade}</Text>
              </View>
            )
          })}
        </View>

        {/* Summary Section */}
        <View style={styles.summaryContainer}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Total Marks:</Text>
            <Text style={styles.summaryValue}>{totalMarks}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Average:</Text>
            <Text style={styles.summaryValue}>{averageMarks}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Overall Grade:</Text>
            <Text style={[styles.summaryValue, { color: getGradeColor(overallGrade) }]}>{overallGrade}</Text>
          </View>
        </View>

        {/* Watermark */}
        <Text style={styles.watermark}>{student.paid ? "OFFICIAL COPY" : "UNOFFICIAL"}</Text>

        {/* Footer */}
        <View style={styles.footer}>
          <Text>This report was generated on {new Date().toLocaleDateString()}</Text>
          <Text>
            Document ID: {student.id}-{new Date().getTime()}
          </Text>
          <Text>Example High School - Excellence in Education</Text>
        </View>
      </Page>
    </Document>
  )
}

// Component to render the PDF and provide download link
const StudentResultsPDFGenerator = ({ student, result }: StudentResultProps) => {
  return (
    <div className="pdf-container p-6 max-w-2xl mx-auto bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-2">Student Results PDF</h2>
      <p className="text-gray-600 mb-6">
        Click the button below to download the student's academic results as a PDF document.
      </p>

      <div className="flex flex-col sm:flex-row gap-4 items-center">
        <PDFDownloadLink
          document={<StudentResultPDF student={student} result={result} />}
          fileName={`${student.firstName}_${student.lastName}_results.pdf`}
          className="w-full sm:w-auto"
        >
          {({ blob, url, loading, error }) => (
            <Button
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md flex items-center justify-center gap-2"
              disabled={loading}
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Generating PDF...
                </>
              ) : (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  Download Results PDF
                </>
              )}
            </Button>
          )}
        </PDFDownloadLink>

        <Button variant="outline" className="w-full sm:w-auto border-blue-600 text-blue-600 hover:bg-blue-50">
          Print Preview
        </Button>
      </div>

      <div className="mt-6 p-4 bg-blue-50 rounded-md text-sm text-blue-800">
        <p className="flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          The PDF contains the student's complete academic record for the current term.
        </p>
      </div>
    </div>
  )
}

export default StudentResultsPDFGenerator

