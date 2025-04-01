"use client";

import React, { useState, useEffect } from "react";
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
  CircularProgress,
  Snackbar,
  Alert
} from "@mui/material";
import OutlinedInput from '@mui/material/OutlinedInput';

interface GradeRange {
  grade: string;
  min: number;
  max: number;
}

interface GradeSystem {
  id: number;
  name: string;
  gradeRanges: GradeRange[];
}

interface GradeSettingsProps {
  open: boolean;
  onClose: () => void;
}

const GradeSettings: React.FC<GradeSettingsProps> = ({ open, onClose }) => {
  const [level, setLevel] = useState("O-Level");
  const [gradeSystems, setGradeSystems] = useState<GradeSystem[]>([]);
  const [currentSystem, setCurrentSystem] = useState<GradeSystem | null>(null);
  const [grades, setGrades] = useState<GradeRange[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notification, setNotification] = useState({ open: false, message: "", type: "success" as "success" | "error" });

  // Fetch all grade systems on component mount
  useEffect(() => {
    const fetchScales = async () => {
      setLoading(true);
      try {
        const response = await fetch("/api/scale");
        if (!response.ok) throw new Error("Failed to fetch grade systems");
        
        const data = await response.json();
        setGradeSystems(data);
        
        // Set initial system
        if (data.length > 0) {
          const oLevel = data.find((system: GradeSystem) => system.name === "O-Level") || data[0];
          setCurrentSystem(oLevel);
          setGrades(oLevel.gradeRanges);
          setLevel(oLevel.name);
        }
      } catch (error) {
        console.error("Error fetching grade systems:", error);
        setNotification({
          open: true,
          message: "Failed to load grade systems",
          type: "error"
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchScales();
  }, []);

  // Handle changing the selected level
  const handleChangeLevel = async (event: any) => {
    const newLevel = event.target.value as string;
    setLevel(newLevel);
    
    // Find the corresponding grade system in our already fetched data
    const selectedSystem = gradeSystems.find(system => system.name === newLevel);
    
    if (selectedSystem) {
      setCurrentSystem(selectedSystem);
      setGrades(selectedSystem.gradeRanges);
    } else {
      // Fetch the specific system if not found
      try {
        const response = await fetch(`/api/scale?name=${newLevel}`);
        if (!response.ok) throw new Error(`Failed to fetch ${newLevel} grade system`);
        
        const system = await response.json();
        setCurrentSystem(system);
        setGrades(system.gradeRanges);
      } catch (error) {
        console.error(`Error fetching ${newLevel} grade system:`, error);
        setNotification({
          open: true,
          message: `Failed to load ${newLevel} grade system`,
          type: "error"
        });
      }
    }
  };

  // Handle changing grade values
  const handleGradeChange = (index: number, key: "min" | "max", value: number) => {
    const updatedGrades = [...grades];
    updatedGrades[index] = { ...updatedGrades[index], [key]: value };
    setGrades(updatedGrades);
  };

  // Save changes to the server
  const handleSave = async () => {
    if (!currentSystem) return;
    
    setSaving(true);
    
    const data = {
      name: level,
      gradeRanges: grades
    };

    try {
      const response = await fetch(`/api/scale/${currentSystem.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) throw new Error("Failed to update grade system");
      
      const updatedSystem = await response.json();
      
      // Update local data
      setCurrentSystem(updatedSystem);
      setGrades(updatedSystem.gradeRanges);
      
      // Update the systems list
      setGradeSystems(prevSystems => 
        prevSystems.map(system => 
          system.id === updatedSystem.id ? updatedSystem : system
        )
      );
      
      setNotification({
        open: true,
        message: "Grade system updated successfully",
        type: "success"
      });
      
      onClose();
    } catch (error) {
      console.error("Error saving grade system:", error);
      setNotification({
        open: true,
        message: "Failed to save changes",
        type: "error"
      });
    } finally {
      setSaving(false);
    }
  };

  const handleCloseNotification = () => {
    setNotification(prev => ({ ...prev, open: false }));
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
        <DialogTitle>Set Grade Boundaries</DialogTitle>
        <DialogContent>
          {loading ? (
            <Box display="flex" justifyContent="center" my={4}>
              <CircularProgress />
            </Box>
          ) : (
            <>
              <FormControl fullWidth sx={{ my: 2 }}>
                <InputLabel>Level</InputLabel>
                <Select
                  value={level}
                  onChange={handleChangeLevel}
                  input={<OutlinedInput label="Level" />}
                >
                  {gradeSystems.map(system => (
                    <MenuItem key={system.id} value={system.name}>
                      {system.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              
              {grades.map((grade, index) => (
                <Box key={index} display="flex" gap={2} my={1}>
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
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button 
            variant="contained" 
            onClick={handleSave}
            disabled={loading || saving}
          >
            {saving ? <CircularProgress size={24} /> : "Save"}
          </Button>
        </DialogActions>
      </Dialog>
      
      <Snackbar 
        open={notification.open} 
        autoHideDuration={6000} 
        onClose={handleCloseNotification}
      >
        <Alert 
          onClose={handleCloseNotification} 
          severity={notification.type} 
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default GradeSettings;