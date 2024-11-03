import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  RadioGroup,
  FormControlLabel,
  Radio,
  Checkbox,
  TextField,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import { ActivityFormData } from "../Textbook/Textbook";

interface ActivityDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (formData: ActivityFormData) => void;
}

export const ActivityDialog: React.FC<ActivityDialogProps> = ({
  open,
  onClose,
  onSubmit,
}) => {
  const [formData, setFormData] = useState<ActivityFormData>({
    question_id: "",
    question: "",
    ans_txt_1: "",
    ans_explain_1: "",
    correct_1: false,
    ans_txt_2: "",
    ans_explain_2: "",
    correct_2: false,
    ans_txt_3: "",
    ans_explain_3: "",
    correct_3: false,
    ans_txt_4: "",
    ans_explain_4: "",
    correct_4: false,
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = event.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = () => {
    onSubmit(formData);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Create Activity</DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          <Grid container spacing={2}>
            <Grid size={2}>
              <TextField
                label="ID"
                name="question_id"
                value={formData.question_id}
                onChange={handleChange}
                fullWidth
                variant="outlined"
              />
            </Grid>
            <Grid size={10}>
              <TextField
                label="Question"
                name="question"
                value={formData.question}
                onChange={handleChange}
                fullWidth
                variant="outlined"
              />
            </Grid>
          </Grid>

          {[1, 2, 3, 4].map((num) => (
            <Grid container key={num} spacing={2}>
              <Grid size={6}>
                <TextField
                  label={`Answer Text ${num}`}
                  name={`ans_txt_${num}`}
                  value={(formData as any)[`ans_txt_${num}`]}
                  onChange={handleChange}
                  fullWidth
                  variant="outlined"
                />
              </Grid>
              <Grid size={6}>
                <TextField
                  label={`Answer Explanation ${num}`}
                  name={`ans_explain_${num}`}
                  value={(formData as any)[`ans_explain_${num}`]}
                  onChange={handleChange}
                  fullWidth
                  variant="outlined"
                />
              </Grid>
              <Grid size={12}>
                <FormControlLabel
                  control={
                    <Checkbox
                      name={`correct_${num}`}
                      checked={(formData as any)[`correct_${num}`]}
                      onChange={handleChange}
                    />
                  }
                  label={`Correct Answer ${num}`}
                />
              </Grid>
            </Grid>
          ))}
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleSubmit} color="primary">
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ActivityDialog;
