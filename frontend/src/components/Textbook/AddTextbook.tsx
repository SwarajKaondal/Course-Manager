import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useState } from "react";
import { PostRequest } from "../../utils/ApiManager";
import { useAuth } from "../../provider/AuthProvider";

export const AddTextbook = () => {
  const [open, setOpen] = useState(false);
  const [textbookName, setTextbookName] = useState("");
  const auth = useAuth();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSave = async () => {
    console.log("Textbook Name:", textbookName);
    const response = await PostRequest("/admin/create_textbook", {
      role: auth.user?.role,
      title: textbookName,
    });
    if (response.ok) {
    }
    setOpen(false);
  };

  return (
    <>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Enter Textbook Name</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Textbook Name"
            type="text"
            fullWidth
            variant="outlined"
            value={textbookName}
            onChange={(e) => setTextbookName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSave} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
      <Button
        variant="outlined"
        size="small"
        startIcon={<AddIcon />}
        sx={{
          marginTop: 2,
          marginLeft: 2,
          marginRight: 2,
        }}
        onClick={handleClickOpen}
      >
        Add Textbook
      </Button>
    </>
  );
};
