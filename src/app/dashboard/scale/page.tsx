
"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
} from "@mui/material";

interface GradeRange {
  grade: string;
  min: number;
  max: number;
}

const oLevelGrades: GradeRange[] = [
  { grade: "D1", min: 80, max: 100 },
  { grade: "D2", min: 75, max: 79 },
  { grade: "C3", min: 70, max: 74 },
  { grade: "C4", min: 65, max: 69 },
  { grade: "C5", min: 60, max: 64 },
  { grade: "C6", min: 55, max: 59 },
  { grade: "P7", min: 45, max: 54 },
  { grade: "P8", min: 35, max: 44 },
  { grade: "F9", min: 0, max: 34 },
];

const aLevelGrades: GradeRange[] = [
  { grade: "A", min: 80, max: 100 },
  { grade: "B", min: 70, max: 79 },
  { grade: "C", min: 60, max: 69 },
  { grade: "D", min: 50, max: 59 },
  { grade: "E", min: 40, max: 49 },
  { grade: "O", min: 35, max: 39 },
  { grade: "F", min: 0, max: 34 },
];

const GradeSettings: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [level, setLevel] = useState("O-Level");
  const [grades, setGrades] = useState<GradeRange[]>(oLevelGrades);

  const handleChangeLevel = (event : any) => {
    const newLevel = event.target.value as string;
    setLevel(newLevel);
    setGrades(newLevel === "O-Level" ? oLevelGrades : aLevelGrades);
  };

  const handleGradeChange = (index: number, key: "min" | "max", value: number) => {
    const updatedGrades = [...grades];
    updatedGrades[index] = { ...updatedGrades[index], [key]: value };
    setGrades(updatedGrades);
  };

  const handleSave = () => {
    console.log("Saved Grades:", grades);
    setOpen(false);
  };

  return (
    <>
      <Button variant="contained" onClick={() => setOpen(true)}>
        Set Grade Boundaries
      </Button>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Set Grade Boundaries</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ my: 2 }}>
            <InputLabel>Education Level</InputLabel>
            <Select value={level} onChange={handleChangeLevel}>
              <MenuItem value="O-Level">O-Level</MenuItem>
              <MenuItem value="A-Level">A-Level</MenuItem>
            </Select>
          </FormControl>
          {grades.map((grade, index) => (
            <Box key={grade.grade} display="flex" gap={2} my={1}>
              <TextField label="Grade" value={grade.grade} disabled fullWidth />
              <TextField
                label="Min %"
                type="number"
                value={grade.min}
                onChange={(e) => handleGradeChange(index, "min", Number(e.target.value))}
                fullWidth
              />
              <TextField
                label="Max %"
                type="number"
                value={grade.max}
                onChange={(e) => handleGradeChange(index, "max", Number(e.target.value))}
                fullWidth
              />
            </Box>
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSave}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default GradeSettings;