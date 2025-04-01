"use client";
/* eslint-disable react-hooks/rules-of-hooks */


import React, { useState, useEffect, ReactNode } from "react";
import { Button } from "@/components/ui/button";
import LoadingButton from "@mui/lab/LoadingButton";
import SaveIcon from "@mui/icons-material/Save";
import { TextField } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import Edit from "@/components/Edit";
import { toast } from "sonner";

import{
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

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

interface SchoolDto {
    name: string;
    address: string;
    email: string;
    phoneNumber: string;
    principal: string;
}

const getSchoolById = async (id: number): Promise<School | null> => {
    try {
        const response = await fetch(`/api/schools/${id}`);
        if (!response.ok) {
            throw new Error("Failed to fetch school");
        }
        const school: School = await response.json();
        return school;
    } catch (error) {
        console.error("Error fetching school by ID:", error);
        return null;
    }
};

const createSchool = async (
    data: SchoolDto,
    onSuccess: () => void,
    onError: () => void
) => {
    try {
        console.log(data)
        const response = await fetch("/api/schools", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            throw new Error("Failed to create school");
        }

        onSuccess();
    } catch (error) {
        console.error("Error creating school:", error);
        onError();
    }
};

const updateSchool = async (
    data: School,
    onSuccess: () => void,
    onError: () => void
) => {
    try {
        const response = await fetch(`/api/schools/${data.id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            throw new Error("Failed to update school");
        }

        onSuccess();
    } catch (error) {
        console.error("Error updating school:", error);
        onError();
    }
};

const deleteSchool = async (
    id: number,
    onSuccess: () => void,
    onError: () => void
) => {
    try {
        const response = await fetch(`/api/schools/${id}`, {
            method: "DELETE",
        });

        if (!response.ok) {
            throw new Error("Failed to delete school");
        }

        onSuccess();
    } catch (error) {
        console.error("Error deleting school:", error);
        onError();
    }
};

const page = () => {
    const [editRow, setEditRow] = useState<School | null>(null);
    const [edit, setEdit] = useState<boolean>(false);
    const [schools, setSchools] = useState<School[]>([]);
    const [submitting, setSubmitting] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchSchools = async () => {
            try {
                const response = await fetch("/api/schools");
                const data = await response.json();
                setSchools(data);
                setIsLoading(false);
            } catch (error) {
                console.error("Error fetching schools:", error);
                setIsLoading(false);
            }
        };

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
                    name="name"
                    label="School Name"
                    defaultValue={editRow ? editRow.name : ""}
                    sx={{ width: "25vw" }}
                    margin="normal"
                />

                <TextField
                    variant="outlined"
                    name="address"
                    label="Address"
                    defaultValue={editRow ? editRow.address : ""}
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

                <TextField
                    variant="outlined"
                    name="phoneNumber"
                    label="Phone Number"
                    defaultValue={editRow ? editRow.phoneNumber : ""}
                    sx={{ width: "25vw" }}
                    margin="normal"
                />

                <TextField
                    variant="outlined"
                    name="principal"
                    label="Principal"
                    defaultValue={editRow ? editRow.principal : ""}
                    sx={{ width: "25vw" }}
                    margin="normal"
                />

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

    const handleEdit = async (id: number) => {
        const school = await getSchoolById(id);
        if (school) setEditRow(school);
        setEdit(true);
    };

    const editSchool = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (editRow) {
            const formData = new FormData(event.target as HTMLFormElement);

            const updatedSchool: School = {
                ...editRow,
                name: formData.get("name") as string,
                address: formData.get("address") as string,
                email: formData.get("email") as string,
                phoneNumber: formData.get("phoneNumber") as string,
                principal: formData.get("principal") as string,
            };

            await updateSchool(
                updatedSchool,
                () => {
                    toast("School successfully updated.");
                    setEdit(false);
                    setSchools((prev) =>
                        prev.map((school) =>
                            school.id === updatedSchool.id ? updatedSchool : school
                        )
                    );
                },
                () => {
                    toast("An error occurred. School couldn't be updated.");
                }
            );
        }
    };

    const handleDelete = async (id: number) => {
        await deleteSchool(
            id,
            () => {
                toast("School successfully deleted.");
                setSchools((prev) => prev.filter((school) => school.id !== id));
            },
            () => {
                toast("An error occurred. School couldn't be deleted.");
            }
        );
    };

    const handleSave = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        setSubmitting(true);
        const formData = new FormData(event.target as HTMLFormElement);

        const data: SchoolDto = {
            name: formData.get("name") as string,
            address: formData.get("address") as string,
            email: formData.get("email") as string,
            phoneNumber: formData.get("phoneNumber") as string,
            principal: formData.get("principal") as string,
        };

        await createSchool(
            data,
            () => {
                setSubmitting(false);
                toast("School successfully created.");
                setEdit(false);
                setSchools((prev) => [
                    ...prev,
                    {
                        ...data,
                        id: Date.now(),
                        createdAt: new Date().toISOString(),
                        updatedAt: new Date().toISOString(),
                    },
                ]);
            },
            () => {
                setSubmitting(false);
                toast("An error occurred. School couldn't be added.");
            }
        );
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold mb-4">Manage Schools</h2>

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
                    <h3 className="mt-4">Loading Schools...</h3>
                </div>
            ) : (
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>ID</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Address</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Phone Number</TableHead>
                            <TableHead>Principal</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {schools.map((row) => (
                            <TableRow key={row.id}>
                                <TableCell>{row.id}</TableCell>
                                <TableCell>{row.name}</TableCell>
                                <TableCell>{row.address}</TableCell>
                                <TableCell>{row.email}</TableCell>
                                <TableCell>{row.phoneNumber}</TableCell>
                                <TableCell>{row.principal}</TableCell>
                                <TableCell>
                                    <div className="flex space-x-2">
                                        <Button
                                            size="sm"
                                            variant={"secondary"}
                                            onClick={() => handleEdit(row.id)}
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
                Heading={editRow ? "UPDATE SCHOOL" : "ADD SCHOOL"}
                onSubmit={editRow ? editSchool : handleSave}
                toggleDrawer={toggleEditDrawer}
                Fields={Fields}
            />
        </div>
    );
};

export default page;