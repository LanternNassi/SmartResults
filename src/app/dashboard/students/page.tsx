"use client";
/* eslint-disable react-hooks/rules-of-hooks */


import React, { useState, useEffect, ReactNode } from "react";
import { Button } from "@/components/ui/button";
import LoadingButton from "@mui/lab/LoadingButton";
import SaveIcon from "@mui/icons-material/Save";
import { TextField, MenuItem, Select, InputLabel, FormControl } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import Edit from "@/components/Edit";
import { toast } from "sonner";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

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

interface StudentDto {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    indexNo: string;
    class: string;
    gender: string;
    schoolId: number;
}

interface School {
    id: number;
    name: string;
}

const getSchools = async (): Promise<School[]> => {
    try {
        const response = await fetch("/api/schools");
        if (!response.ok) {
            throw new Error("Failed to fetch schools");
        }
        return await response.json();
    } catch (error) {
        console.error("Error fetching schools:", error);
        return [];
    }
};

const createStudent = async (
    data: StudentDto,
    onSuccess: () => void,
    onError: () => void
) => {
    try {
        const response = await fetch("/api/students", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            throw new Error("Failed to create student");
        }

        onSuccess();
    } catch (error) {
        console.error("Error creating student:", error);
        onError();
    }
};

const updateStudent = async (
    data: Student,
    onSuccess: () => void,
    onError: () => void
) => {
    try {
        const response = await fetch(`/api/students/${data.id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            throw new Error("Failed to update student");
        }

        onSuccess();
    } catch (error) {
        console.error("Error updating student:", error);
        onError();
    }
};

const deleteStudent = async (
    id: number,
    onSuccess: () => void,
    onError: () => void
) => {
    try {
        const response = await fetch(`/api/students/${id}`, {
            method: "DELETE",
        });

        if (!response.ok) {
            throw new Error("Failed to delete student");
        }

        onSuccess();
    } catch (error) {
        console.error("Error deleting student:", error);
        onError();
    }
};

const page = () => {
    const [editRow, setEditRow] = useState<Student | null>(null);
    const [edit, setEdit] = useState<boolean>(false);
    const [students, setStudents] = useState<Student[]>([]);
    const [schools, setSchools] = useState<School[]>([]);
    const [submitting, setSubmitting] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const fetchStudents = async () => {
        try {
            const response = await fetch("/api/students");
            const data = await response.json();
            setStudents(data);
            setIsLoading(false);
        } catch (error) {
            console.error("Error fetching students:", error);
            setIsLoading(false);
        }
    };

    useEffect(() => {

        const fetchSchools = async () => {
            const schoolData = await getSchools();
            setSchools(schoolData);
        };

        fetchStudents();
        fetchSchools();
    }, []);

    const toggleEditDrawer = (newOpen: boolean) => {
        setEdit(newOpen);
    };

    const Fields = (): ReactNode => {
        return (
            <>
                <TextField
                    variant="outlined"
                    name="firstName"
                    label="First Name"
                    defaultValue={editRow ? editRow.firstName : ""}
                    sx={{ width: "25vw" }}
                    margin="normal"
                />

                <TextField
                    variant="outlined"
                    name="lastName"
                    label="Last Name"
                    defaultValue={editRow ? editRow.lastName : ""}
                    sx={{ width: "25vw" }}
                    margin="normal"
                />

                <TextField
                    variant="outlined"
                    name="email"
                    label="Email"
                    defaultValue={editRow ? editRow.email : ""}
                    sx={{ width: "25vw" }}
                    margin="normal"
                />

                <FormControl sx={{ width: "25vw", margin: "normal" }}>
                    <InputLabel id="gender-select-label">Class</InputLabel>
                    <Select
                        labelId="gender-select-label"
                        name="class"
                        defaultValue={editRow ? editRow.class : ""}
                    >
                        <MenuItem value="S.4">S.4</MenuItem>
                        <MenuItem value="S.6">S.6</MenuItem>
                    </Select>
                </FormControl>

                <TextField
                    variant="outlined"
                    name="indexNo"
                    label="Index Number"
                    defaultValue={editRow ? editRow.indexNo : ""}
                    sx={{ width: "25vw" }}
                    margin="normal"
                />

                <TextField
                    variant="outlined"
                    name="phone"
                    label="Phone Number"
                    defaultValue={editRow ? editRow.phone : ""}
                    sx={{ width: "25vw" }}
                    margin="normal"
                />

                <FormControl sx={{ width: "25vw", margin: "normal" }}>
                    <InputLabel id="gender-select-label">Gender</InputLabel>
                    <Select
                        labelId="gender-select-label"
                        name="gender"
                        defaultValue={editRow ? editRow.gender : ""}
                    >
                        <MenuItem value="Male">Male</MenuItem>
                        <MenuItem value="Female">Female</MenuItem>
                        <MenuItem value="Other">Other</MenuItem>
                    </Select>
                </FormControl>

                <FormControl sx={{ width: "25vw", margin: "normal" }}>
                    <InputLabel id="school-select-label">School</InputLabel>
                    <Select
                        labelId="school-select-label"
                        name="schoolId"
                        defaultValue={editRow ? editRow.schoolId : ""}
                    >
                        {schools.map((school) => (
                            <MenuItem key={school.id} value={school.id}>
                                {school.name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <LoadingButton
                    type="submit"
                    sx={{ width: "25vw", height: "8vh" }}
                    variant="contained"
                    loading={submitting}
                    loadingPosition="start"
                    startIcon={<SaveIcon fontSize="large" />}
                >
                    <span>Submit</span>
                </LoadingButton>
            </>
        );
    };

    const handleEdit = (student: Student) => {
        setEditRow(student);
        setEdit(true);
    };

    const editStudent = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (editRow) {
            const formData = new FormData(event.target as HTMLFormElement);

            const updatedStudent: Student = {
                ...editRow,
                firstName: formData.get("name") as string,
                email: formData.get("email") as string,
                phone: formData.get("phoneNumber") as string,
                schoolId: parseInt(formData.get("schoolId") as string, 10),
            };

            await updateStudent(
                updatedStudent,
                () => {
                    toast("Student successfully updated.");
                    setEdit(false);
                    setStudents((prev) =>
                        prev.map((student) =>
                            student.id === updatedStudent.id ? updatedStudent : student
                        )
                    );
                },
                () => {
                    toast("An error occurred. Student couldn't be updated.");
                }
            );
        }
    };

    const handleDelete = async (id: number) => {
        await deleteStudent(
            id,
            () => {
                toast("Student successfully deleted.");
                setStudents((prev) => prev.filter((student) => student.id !== id));
            },
            () => {
                toast("An error occurred. Student couldn't be deleted.");
            }
        );
    };

    const handleSave = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        setSubmitting(true);
        const formData = new FormData(event.target as HTMLFormElement);

        const data: StudentDto = {
            firstName: formData.get("firstName") as string,
            lastName: formData.get("lastName") as string,
            email: formData.get("email") as string,
            phone: formData.get("phone") as string,
            indexNo: formData.get("indexNo") as string,
            class: formData.get("class") as string,
            gender: formData.get("gender") as string || "Other",
            schoolId: parseInt(formData.get("schoolId") as string, 10),
        };

        await createStudent(
            data,
            () => {
                setSubmitting(false);
                toast("Student successfully created.");
                setEdit(false);
                // setStudents((prev) => [
                //     ...prev,
                //     {
                //         id: Date.now(),
                //         firstName: data.firstName.split(" ")[0] || "",
                //         lastName: data.lastName.split(" ")[1] || "",
                //         email: data.email,
                //         phone: data.phone,
                //         gender: "Other", // Default value, adjust as needed
                //         schoolId: data.schoolId,
                //         createdAt: new Date().toISOString(),
                //         updatedAt: new Date().toISOString(),
                //     },
                // ]);
                fetchStudents();
            },
            () => {
                setSubmitting(false);
                toast("An error occurred. Student couldn't be added.");
            }
        );
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold mb-4">Manage Students</h2>

                <div className="space-x-4">
                    <Button
                        onClick={() => {
                            setEditRow(null);
                            setEdit(true);
                        }}
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                        <i className="fas fa-plus mr-2"></i>Add
                    </Button>
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                        <i className="fas fa-print mr-2"></i>Print
                    </Button>
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                        <i className="fas fa-file-excel mr-2"></i>Export To Excel
                    </Button>
                </div>
            </div>

            {isLoading ? (
                <div className="flex justify-center items-center flex-col h-80 w-full">
                    <CircularProgress />
                    <h3 className="mt-4">Loading Students...</h3>
                </div>
            ) : (
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>ID</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Phone Number</TableHead>
                            <TableHead>School</TableHead>
                            <TableHead>Index Number</TableHead>
                            <TableHead>Class</TableHead>
                            <TableHead>Paid</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {students.map((row) => (
                            <TableRow key={row.id}>
                                <TableCell>{row.id}</TableCell>
                                <TableCell>{`${row.firstName} ${row.lastName}`}</TableCell>
                                <TableCell>{row.email}</TableCell>
                                <TableCell>{row.phone}</TableCell>
                                <TableCell>
                                    {schools.find((school) => school.id === row.schoolId)?.name}
                                </TableCell>
                                <TableCell>{row.indexNo}</TableCell>
                                <TableCell>{row.class}</TableCell>
                                <TableCell>
                                    <div>
                                        {row.paid ? (
                                            <span className="bg-green-100 text-green-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded">
                                                Paid
                                            </span>
                                        ) : (
                                            <span className="bg-red-100 text-red-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded">
                                                Not Paid
                                            </span>
                                        )}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex space-x-2">
                                        <Button
                                            size="sm"
                                            variant={"secondary"}
                                            onClick={() => handleEdit(row)}
                                        >
                                            Edit
                                        </Button>

                                        <Button
                                            size="sm"
                                            variant="destructive"
                                            onClick={() => handleDelete(row.id)}
                                        >
                                            Delete
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            )}

            <Edit
                open={edit}
                Heading={editRow ? "UPDATE STUDENT" : "ADD STUDENT"}
                onSubmit={editRow ? editStudent : handleSave}
                toggleDrawer={toggleEditDrawer}
                Fields={Fields}
            />
        </div>
    );
};

export default page;