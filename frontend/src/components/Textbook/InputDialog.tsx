import React, { useState } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  TextField,
} from "@mui/material";

interface InputDialogProps {
  open: boolean;
  fieldNames: string[];
  onClose: (values: { [key: string]: string }) => void;
  onCancel: () => void;
}

const InputDialog: React.FC<InputDialogProps> = ({
  open,
  fieldNames,
  onClose,
  onCancel,
}) => {
  const [values, setValues] = useState<{ [key: string]: string }>({});

  const handleInputChange =
    (fieldName: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
      setValues((prevValues) => ({
        ...prevValues,
        [fieldName]: event.target.value,
      }));
    };

  const handleSubmit = () => {
    onClose(values);
  };

  const handleCancel = () => {
    setValues({});
    onCancel();
  };

  return (
    <Dialog open={open} onClose={handleCancel}>
      <DialogTitle>Enter the Values</DialogTitle>
      <DialogContent>
        {fieldNames.map((fieldName) => (
          <TextField
            key={fieldName}
            label={fieldName}
            variant="outlined"
            fullWidth
            margin="normal"
            value={values[fieldName] || ""}
            onChange={handleInputChange(fieldName)}
          />
        ))}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCancel}>Cancel</Button>
        <Button onClick={handleSubmit} color="primary">
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default InputDialog;
