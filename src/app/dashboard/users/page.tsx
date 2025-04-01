"use client";
/* eslint-disable react-hooks/rules-of-hooks */
import React, { useState, useEffect, ReactNode } from "react";

import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import LoadingButton from "@mui/lab/LoadingButton";
import SaveIcon from "@mui/icons-material/Save";
import { TextField, MenuItem } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import Edit from "@/components/Edit";
import { toast } from "sonner";

interface User {
    id: string;
    username: string;
    email: string;
    telephone: string;
    gender: "Male" | "Female";
    role: "admin" | "normal";
    status?: string;
    addedBy?: string;
}

interface UserDto {
    username: string;
    password: string;
    email: string;
    telephone: string;
    gender: "Male" | "Female";
    role: "admin" | "normal";
}

const getUserById = async (id: string): Promise<User | null> => {
    try {
        const response = await fetch(`/api/users/${id}`);
        if (!response.ok) {
            throw new Error("Failed to fetch user");
        }
        const user: User = await response.json();
        return user;
    } catch (error) {
        console.error("Error fetching user by ID:", error);
        return null;
    }
};

const createUser = async (
    data: UserDto,
    onSuccess: () => void,
    onError: () => void
) => {
    try {
        const response = await fetch("/api/users", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            throw new Error("Failed to create user");
        }

        onSuccess();
    } catch (error) {
        console.error("Error creating user:", error);
        onError();
    }
};

const updateUser = async (
    data: User,
    onSuccess: () => void,
    onError: () => void
) => {
    try {
        const response = await fetch(`/api/users/${data.id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            throw new Error("Failed to update user");
        }

        onSuccess();
    } catch (error) {
        console.error("Error updating user:", error);
        onError();
    }
};

const deleteUser = async (
    id: string,
    onSuccess: () => void,
    onError: () => void
) => {
    try {
        const response = await fetch(`/api/users/${id}`, {
            method: "DELETE",
        });

        if (!response.ok) {
            throw new Error("Failed to delete user");
        }

        onSuccess();
    } catch (error) {
        console.error("Error deleting user:", error);
        onError();
    }
};

const page = () => {
    const [editRow, setEditRow] = useState<User | null>(null);
    const [edit, setEdit] = useState<boolean>(false);
    const [users, setUsers] = useState<User[]>([]);
    const [submitting, setSubmitting] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch("/api/users");
                const data = await response.json();
                setUsers(data);
                setIsLoading(false);
            } catch (error) {
                console.error("Error fetching users:", error);
                setIsLoading(false);
            }
        };

        fetchUsers();
    }, []);

    const toggleEditDrawer = (newOpen: boolean) => {
        setEdit(newOpen);
    };

    const Fields = (): ReactNode => {
        return (
            <>
                <TextField
                    variant="outlined"
                    name="username"
                    label="Username"
                    defaultValue={editRow ? editRow.username : ""}
                    sx={{ width: "25vw" }}
                    margin="normal"
                />

                <TextField
                    variant="outlined"
                    name="passwordHash"
                    label="Password"
                    defaultValue=""
                    sx={{ width: "25vw" }}
                    margin="normal"
                />

                <TextField
                    select
                    name="gender"
                    label="Gender"
                    defaultValue={editRow ? editRow.gender : ""}
                    sx={{ width: "25vw" }}
                    margin="normal"
                >
                    <MenuItem value="Male">Male</MenuItem>
                    <MenuItem value="Female">Female</MenuItem>
                </TextField>

                <TextField
                    variant="outlined"
                    name="telephone"
                    label="Telephone"
                    defaultValue={editRow ? editRow.telephone : ""}
                    sx={{ width: "25vw" }}
                    margin="normal"
                />

                <TextField
                    variant="outlined"
                    label="Email"
                    name="email"
                    defaultValue={editRow ? editRow.email : ""}
                    sx={{ width: "25vw" }}
                    margin="normal"
                />

                <TextField
                    select
                    name="role"
                    label="Account Type"
                    defaultValue={editRow ? editRow.role : ""}
                    sx={{ width: "25vw" }}
                    margin="normal"
                >
                    <MenuItem value="admin">Admin</MenuItem>
                    <MenuItem value="normal">Normal</MenuItem>
                </TextField>
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

    const handleEdit = async (id: string) => {
        const user = await getUserById(id);
        if (user) setEditRow(user);
        setEdit(true);
    };

    const editUser = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (editRow) {
            const formData = new FormData(event.target as HTMLFormElement);

            const updatedUser: User = {
                ...editRow,
                username: formData.get("username") as string,
                // passwordHash: formData.get("passwordHash") as string,
                email: formData.get("email") as string,
                gender: formData.get("gender") as "Male" | "Female",
                telephone: formData.get("telephone") as string,
                role: formData.get("role") as "admin" | "normal",
            };

            await updateUser(
                updatedUser,
                () => {
                    toast("User successfully updated.");
                    setEdit(false);
                    setUsers((prev) =>
                        prev.map((user) =>
                            user.id === updatedUser.id ? updatedUser : user
                        )
                    );
                },
                () => {
                    toast("An error occurred. User couldn't be updated.");
                }
            );
        }
    };

    const handleDelete = async (id: string) => {
        await deleteUser(
            id,
            () => {
                toast("User successfully deleted.");
                setUsers((prev) => prev.filter((user) => user.id !== id));
            },
            () => {
                toast("An error occurred. User couldn't be deleted.");
            }
        );
    };

    const handleSave = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        setSubmitting(true);
        const formData = new FormData(event.target as HTMLFormElement);

        const data: UserDto = {
            username: formData.get("username") as string,
            password: formData.get("passwordHash") as string,
            email: formData.get("email") as string,
            gender: formData.get("gender") as "Male" | "Female",
            telephone: formData.get("telephone") as string,
            role: formData.get("role") as "admin" | "normal",
        };

        console.log(data);

        await createUser(
            data,
            () => {
                setSubmitting(false);
                toast("User successfully created.");
                setEdit(false);
                setUsers((prev) => [...prev, { ...data, id: Date.now().toString() }]);
            },
            () => {
                setSubmitting(false);
                toast("An error occurred. User couldn't be added.");
            }
        );
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold mb-4">Manage Users</h2>

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
                    <h3 className="mt-4">Loading System Users...</h3>
                </div>
            ) : (
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>ID</TableHead>
                            <TableHead>User</TableHead>
                            <TableHead>Gender</TableHead>
                            <TableHead>Telephone</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Added By</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {users.map((row) => (
                            <TableRow key={row.id}>
                                {/* <TableCell>{`${row.id.slice(0, 6)}...`}</TableCell> */}
                                <TableCell>{row.id}</TableCell>
                                <TableCell>{row.username}</TableCell>
                                <TableCell>{row.gender}</TableCell>
                                <TableCell>{row.telephone}</TableCell>
                                <TableCell>{row.email}</TableCell>
                                <TableCell>{row.addedBy || "N/A"}</TableCell>
                                <TableCell>{row.role}</TableCell>
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
                Heading={editRow ? "UPDATE USER" : "ADD USER"}
                onSubmit={editRow ? editUser : handleSave}
                toggleDrawer={toggleEditDrawer}
                Fields={Fields}
            />
        </div>
    );
};

export default page;