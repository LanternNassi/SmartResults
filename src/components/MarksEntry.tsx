import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import { TransitionProps } from '@mui/material/transitions';
import Slide from '@mui/material/Slide';
import { Tag } from "@/components/ChipInput";
import { Box, Typography } from '@mui/material';
import OutlinedInput from '@mui/material/OutlinedInput';

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement<any, any>;
    },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} {...props} />;
});

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
    results: Mark[] | null | undefined;
}

interface SubjectPaper {
    id: number;
    paper: string;
}

export interface Mark {
    subject: number | null;
    paper: number | null;
    mark: string | null;
    grade?: string | null;
}

interface MarksEntryProps {
    open: boolean;
    student: Student | null;
    level: string;
    setOpen: (open: boolean) => void;
    onSubmit: (marks: Mark[], student: Student) => void;
    gradeSystem?: GradeSystem;
}

interface Subject {
    id: number;
    name: string;
    code: string;
    class: string;
    description?: string;
    createdAt: string;
    updatedAt: string;
    papers: { id: number, paper: string }[];
}

interface GradeRange {
    min: number;
    max: number;
    grade: string;
    description?: string;
}

interface GradeSystem {
    name: string;
    gradeRanges: GradeRange[];
}

// Default grading system
const defaultGradeSystem: GradeSystem = {
    name: "Standard",
    gradeRanges: [
        { min: 80, max: 100, grade: "A", description: "Excellent" },
        { min: 70, max: 79, grade: "B", description: "Very Good" },
        { min: 60, max: 69, grade: "C", description: "Good" },
        { min: 50, max: 59, grade: "D", description: "Pass" },
        { min: 0, max: 49, grade: "F", description: "Fail" }
    ]
};

export default function MarksEntry(props: MarksEntryProps) {
    const gradeSystem = props.gradeSystem || defaultGradeSystem;
    
    const [subjects, setSubjects] = React.useState<Subject[]>([]);
    const [subjectMap, setSubjectMap] = React.useState<Record<number, Subject>>({});
    const [paperDetailsMap, setPaperDetailsMap] = React.useState<Record<number, SubjectPaper>>({});
    const [rows, setRows] = React.useState<Mark[]>([]);
    const [isLoading, setIsLoading] = React.useState<Record<string, boolean>>({});

    // Calculate grade based on mark
    const calculateGrade = (mark: string | null): string => {
        if (!mark) return '';
        
        const numericMark = parseFloat(mark);
        if (isNaN(numericMark)) return '';
        
        const gradeRange = gradeSystem.gradeRanges.find(
            range => numericMark >= range.min && numericMark <= range.max
        );
        
        return gradeRange ? gradeRange.grade : '';
    };

    const getSubjects = async (): Promise<Subject[]> => {
        try {
            const response = await fetch(`/api/subjects?class=${props.level}`);
            if (!response.ok) {
                throw new Error("Failed to fetch subjects");
            }
            return await response.json();
        } catch (error) {
            console.error("Error fetching subjects:", error);
            return [];
        }
    };

    const getSubjectById = async (id: number): Promise<Subject | null> => {
        try {
            // If we already have this subject in the map, return it
            if (subjectMap[id]) {
                return subjectMap[id];
            }
            
            // Otherwise fetch from API
            const response = await fetch(`/api/subjects/${id}`);
            if (!response.ok) {
                throw new Error("Failed to fetch subject");
            }
            const subject = await response.json();
            
            // Update the subject map
            setSubjectMap(prev => ({
                ...prev,
                [id]: subject
            }));
            
            return subject;
        }
        catch (error) {
            console.error("Error fetching subject:", error);
            return null;
        }
    };

    const getSubjectPaperById = async (id: number): Promise<SubjectPaper | null> => {
        try {
            // If we already have this paper in the map, return it
            if (paperDetailsMap[id]) {
                return paperDetailsMap[id];
            }
            
            // Otherwise fetch from API
            const response = await fetch(`/api/subjectpapers/${id}`);
            if (!response.ok) {
                throw new Error("Failed to fetch subject paper");
            }
            const paper = await response.json();
            
            // Update the paper map
            setPaperDetailsMap(prev => ({
                ...prev,
                [id]: paper
            }));
            
            return paper;
        }
        catch (error) {
            console.error("Error fetching subject paper:", error);
            return null;
        }
    }

    // Handle subject change
    const handleSubjectChange = async (index: number, subjectId: number) => {
        setIsLoading({ ...isLoading, [`subject-${index}`]: true });
        
        const newRows = [...rows];
        newRows[index].subject = subjectId;
        newRows[index].paper = null; // Reset paper when subject changes
        setRows(newRows);
        
        // Fetch the subject if not already in our map
        if (!subjectMap[subjectId]) {
            await getSubjectById(subjectId);
        }
        
        setIsLoading({ ...isLoading, [`subject-${index}`]: false });
    };

    // Handle paper change
    const handlePaperChange = async (index: number, paperId: number) => {
        setIsLoading({ ...isLoading, [`paper-${index}`]: true });
        
        const newRows = [...rows];
        newRows[index].paper = paperId;
        setRows(newRows);
        
        // Fetch the paper if not already in our map
        if (!paperDetailsMap[paperId]) {
            await getSubjectPaperById(paperId);
        }
        
        setIsLoading({ ...isLoading, [`paper-${index}`]: false });
    };

    // Initialize component
    React.useEffect(() => {
        const fetchSubjects = async () => {
            const fetchedSubjects = await getSubjects();
            if (fetchedSubjects.length > 0) {
                setSubjects(fetchedSubjects);
                
                // Initialize the subject map
                const subjectMapInit: Record<number, Subject> = {};
                fetchedSubjects.forEach(subject => {
                    subjectMapInit[subject.id] = subject;
                });
                setSubjectMap(subjectMapInit);
            }
        };
        fetchSubjects();
    }, []);

    // Initialize rows with student results or empty row
    React.useEffect(() => {
        if (props.open && props.student) {
            if (props.student.results && props.student.results.length > 0) {
                // Add grade to existing results
                const resultsWithGrades = props.student.results.map(result => ({
                    ...result,
                    grade: calculateGrade(result.mark)
                }));
                setRows(resultsWithGrades);
                
                // Preload paper details and subjects for existing results
                const loadDetails = async () => {
                    for (const result of resultsWithGrades) {
                        if (result.paper) {
                            await getSubjectPaperById(result.paper);
                        }
                        
                        if (result.subject) {
                            await getSubjectById(result.subject);
                        }
                    }
                };
                
                loadDetails();
            } else {
                setRows([{ subject: null, paper: null, mark: null, grade: null }]);
            }
        }
    }, [props.open, props.student]);

    const handleClose = () => {
        props.setOpen(false);
        setRows([]);
    };

    // Handle mark change and automatically calculate grade
    const handleMarkChange = (index: number, value: string) => {
        const newRows = [...rows];
        newRows[index].mark = value;
        newRows[index].grade = calculateGrade(value);
        setRows(newRows);
    };

    // Get available papers for a specific subject
    const getAvailablePapers = (subjectId: number | null) => {
        if (!subjectId) return [];
        
        const subject = subjectMap[subjectId];
        return subject?.papers || [];
    };

    return (
        <React.Fragment>
            <Dialog
                open={props.open}
                onClose={handleClose}
                TransitionComponent={Transition}
                maxWidth="lg"
                fullWidth
                slotProps={{
                    paper: {
                        component: 'form',
                        onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
                            event.preventDefault();
                            props.onSubmit(rows, props.student as Student);
                            handleClose();
                        },
                    },
                }}
            >
                <DialogTitle>{`${props.student?.firstName} ${props.student?.lastName}`}</DialogTitle>
                <DialogContent sx={{ overflow: "auto" }}>
                    <DialogContentText>
                        You are entering marks for {`${props.student?.firstName} ${props.student?.lastName}`}
                        <br />
                        <Typography variant="caption" color="text.secondary">
                            Using {gradeSystem.name} grading system: {gradeSystem.gradeRanges.map(r => 
                                `${r.grade} (${r.min}-${r.max}${r.description ? `, ${r.description}` : ''})`
                            ).join(', ')}
                        </Typography>
                    </DialogContentText>
                    
                    {rows.map((row, index) => (
                        <Box key={index} style={{ display: 'flex', gap: '1rem', marginTop: '2rem', flexWrap: 'wrap' }}>
                            <FormControl sx={{ minWidth: "25%", flexGrow: 1 }}>
                                <InputLabel id={`subject-label-${index}`}>Subject</InputLabel>
                                <Select
                                    labelId={`subject-label-${index}`}
                                    name={`subject-${index}`}
                                    value={row.subject || ''}
                                    input={<OutlinedInput label="Subject" />}
                                    onChange={(e) => handleSubjectChange(index, Number(e.target.value))}
                                    disabled={isLoading[`subject-${index}`]}
                                >
                                    {subjects.map((subject) => (
                                        <MenuItem key={subject.id} value={subject.id}>
                                            {subject.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            
                            <FormControl sx={{ minWidth: "25%", flexGrow: 1 }}>
                                <InputLabel id={`paper-label-${index}`}>Paper</InputLabel>
                                <Select
                                    labelId={`paper-label-${index}`}
                                    name={`paper-${index}`}
                                    value={row.paper || ''}
                                    input={<OutlinedInput label="Paper" />}
                                    onChange={(e) => handlePaperChange(index, Number(e.target.value))}
                                    disabled={!row.subject || isLoading[`paper-${index}`]}
                                >
                                    {row.subject ? (
                                        getAvailablePapers(row.subject).map((paper) => (
                                            <MenuItem key={paper.id} value={paper.id}>
                                                {paper.paper}
                                            </MenuItem>
                                        ))
                                    ) : row.paper && paperDetailsMap[row.paper] ? (
                                        <MenuItem value={row.paper}>
                                            {paperDetailsMap[row.paper].paper}
                                        </MenuItem>
                                    ) : (
                                        <MenuItem value="">
                                            {isLoading[`paper-${index}`] ? "Loading..." : "Select Subject First"}
                                        </MenuItem>
                                    )}
                                </Select>
                            </FormControl>
                            
                            <TextField
                                margin="dense"
                                id={`mark-${index}`}
                                name={`mark-${index}`}
                                label="Mark"
                                type="number"
                                variant="outlined"
                                value={row.mark || ''}
                                onChange={(e) => handleMarkChange(index, e.target.value)}
                                inputProps={{ min: 0, max: 100, step: 0.1 }}
                                sx={{ minWidth: "15%", flexGrow: 0.5 , top : "-0.5rem" }}
                            />
                            
                            <TextField
                                margin="dense"
                                id={`grade-${index}`}
                                name={`grade-${index}`}
                                label="Grade"
                                value={row.grade || ''}
                                InputProps={{ readOnly: true }}
                                variant="outlined"
                                sx={{ minWidth: "15%", flexGrow: 0.5 , top : "-0.5rem" }}
                            />
                            
                            <Button 
                                color="error" 
                                onClick={() => {
                                    const newRows = [...rows];
                                    newRows.splice(index, 1);
                                    if (newRows.length === 0) {
                                        newRows.push({ subject: null, paper: null, mark: null, grade: null });
                                    }
                                    setRows(newRows);
                                }}
                                sx={{ alignSelf: "center" }}
                                disabled={rows.length <= 1}
                            >
                                Remove
                            </Button>
                        </Box>
                    ))}
                </DialogContent>
                <DialogActions>
                    <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', padding: '0 16px' }}>
                        <Button 
                            variant="outlined" 
                            onClick={() => {
                                setRows((prevRows) => [
                                    ...prevRows,
                                    { subject: null, paper: null, mark: null, grade: null },
                                ]);
                            }}
                        >
                            Add Mark
                        </Button>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <Button onClick={handleClose}>Cancel</Button>
                            <Button type="submit" variant="contained">Submit</Button>
                        </div>
                    </div>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
}