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

import ChipInput, { Tag } from "@/components/ChipInput";

import { toDDMMYYYY } from "@/Utils/ConvertDateTime";

interface Subject {
    id: number;
    name: string;
    code: string;
    class: string;
    description?: string;
    createdAt: string;
    updatedAt: string;

    papers: Tag[];
}

interface SubjectDto {
    name: string;
    code: string;
    class: string;
    description?: string;

    papers: Tag[];
}



const getSubjects = async (): Promise<Subject[]> => {
    try {
        const response = await fetch("/api/subjects");
        if (!response.ok) {
            throw new Error("Failed to fetch subjects");
        }
        return await response.json();
    } catch (error) {
        console.error("Error fetching subjects:", error);
        return [];
    }
};

const createSubject = async (
    data: SubjectDto,
    onSuccess: () => void,
    onError: () => void
) => {
    try {
        const response = await fetch("/api/subjects", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            throw new Error("Failed to create subject");
        }

        onSuccess();
    } catch (error) {
        console.error("Error creating subject:", error);
        onError();
    }
};

const updateSubject = async (
    data: Subject,
    onSuccess: () => void,
    onError: () => void
) => {
    try {
        const response = await fetch(`/api/subjects/${data.id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            throw new Error("Failed to update subject");
        }

        onSuccess();
    } catch (error) {
        console.error("Error updating subject:", error);
        onError();
    }
};

const deleteSubject = async (
    id: number,
    onSuccess: () => void,
    onError: () => void
) => {
    try {
        const response = await fetch(`/api/subjects/${id}`, {
            method: "DELETE",
        });

        if (!response.ok) {
            throw new Error("Failed to delete subject");
        }

        onSuccess();
    } catch (error) {
        console.error("Error deleting subject:", error);
        onError();
    }
};



const page = () => {
    const [editRow, setEditRow] = useState<Subject | null>(null);
    const [edit, setEdit] = useState<boolean>(false);
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [submitting, setSubmitting] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const [Addpapers, setAddpapers] = useState<Tag[]>([]);

    const fetchSubjects = async () => {
        try {
            const data = await getSubjects();
            setSubjects(data);
            setIsLoading(false);
        } catch (error) {
            console.error("Error fetching subjects:", error);
            setIsLoading(false);
        }
    };

    const onTagsChange = (papers: Tag[]) => {
        if (editRow != null) {
            setEditRow({ ...editRow, papers: papers })
        } else {
            setAddpapers(papers);
        }
    }

    const searchPaperTags = async (query: string): Promise<Tag[]> => {
        if (query.length < 3) {
            return [];
        }
        try {
            const response = await fetch(`/api/subjectpapers?search=${query}`);
            if (!response.ok) {
                throw new Error("Failed to fetch paper tags");
            }
            return await response.json();
        } catch (error) {
            console.error("Error fetching paper tags:", error);
            return [];
        }
    };

    useEffect(() => {
        fetchSubjects();
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
                    label="Name"
                    defaultValue={editRow ? editRow.name : ""}
                    sx={{ width: "25vw" }}
                    margin="normal"
                />

                <TextField
                    variant="outlined"
                    name="code"
                    label="Code"
                    defaultValue={editRow ? editRow.code : ""}
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
                    name="description"
                    label="Description"
                    multiline
                    rows={4}
                    defaultValue={editRow ? editRow.description : ""}
                    sx={{ width: "25vw" }}
                    margin="normal"
                />

                <ChipInput
                    styles={{ width: "25vw" }}
                    onTagsChange={onTagsChange}
                    searchTags={searchPaperTags}
                    label="Attach Tags eg. Paper 2(This is history paper 2)"
                    tags={editRow ? editRow.papers : []}
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

    const handleEdit = async (id: Number) => {
        const subject = await getSubjectById(id as number);
        if (!subject) {
            toast("Subject not found.");
            return;
        } 
        setEditRow(subject);
        setEdit(true);
    };

    const editSubject = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (editRow) {
            const formData = new FormData(event.target as HTMLFormElement);

            const updatedSubject: Subject = {
                ...editRow,
                name: formData.get("name") as string,
                code: formData.get("code") as string,
                description: formData.get("description") as string || undefined,
            };

            await updateSubject(
                updatedSubject,
                () => {
                    toast("Subject successfully updated.");
                    setEdit(false);
                    setSubjects((prev) =>
                        prev.map((subject) =>
                            subject.id === updatedSubject.id ? updatedSubject : subject
                        )
                    );
                },
                () => {
                    toast("An error occurred. Subject couldn't be updated.");
                }
            );
        }
    };

    const getSubjectById = async (id: number): Promise<Subject | null> => {
        try {
            const response = await fetch(`/api/subjects/${id}`);
            if (!response.ok) {
                throw new Error("Failed to fetch subject");
            }
            return await response.json();
        } catch (error) {
            console.error("Error fetching subject:", error);
            return null;
        }
    }

    const handleDelete = async (id: number) => {
        await deleteSubject(
            id,
            () => {
                toast("Subject successfully deleted.");
                setSubjects((prev) => prev.filter((subject) => subject.id !== id));
            },
            () => {
                toast("An error occurred. Subject couldn't be deleted.");
            }
        );
    };

    const handleSave = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        setSubmitting(true);
        const formData = new FormData(event.target as HTMLFormElement);

        const data: SubjectDto = {
            name: formData.get("name") as string,
            code: formData.get("code") as string,
            class: formData.get("class") as string,
            description: formData.get("description") as string || undefined,
            papers: editRow ? editRow.papers : Addpapers,
        };

        await createSubject(
            data,
            () => {
                setSubmitting(false);
                toast("Subject successfully created.");
                setEdit(false);
                fetchSubjects();
            },
            () => {
                setSubmitting(false);
                toast("An error occurred. Subject couldn't be added.");
            }
        );
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold mb-4">Manage Subjects</h2>

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
                </div>
            </div>

            {isLoading ? (
                <div className="flex justify-center items-center flex-col h-80 w-full">
                    <CircularProgress />
                    <h3 className="mt-4">Loading Subjects...</h3>
                </div>
            ) : (
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>ID</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Code</TableHead>
                            <TableHead>Class</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead>Papers</TableHead>
                            <TableHead>Date Created</TableHead>
                            <TableHead>Last Update</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {subjects.map((row) => (
                            <TableRow key={row.id}>
                                <TableCell>{row.id}</TableCell>
                                <TableCell>{row.name}</TableCell>
                                <TableCell>{row.code}</TableCell>
                                <TableCell>{row.class}</TableCell>
                                <TableCell>{row.description || "N/A"}</TableCell>
                                <TableCell>{row.papers.length}</TableCell>
                                <TableCell>{toDDMMYYYY(row.createdAt)}</TableCell>
                                <TableCell>{toDDMMYYYY(row.updatedAt)}</TableCell>
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
                Heading={editRow ? "UPDATE SUBJECT" : "ADD SUBJECT"}
                onSubmit={editRow ? editSubject : handleSave}
                toggleDrawer={toggleEditDrawer}
                Fields={Fields}
            />
        </div>
    );
};

export default page;