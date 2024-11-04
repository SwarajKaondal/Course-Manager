import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useState } from "react";
import Grid from "@mui/material/Grid2";
import { PostRequest } from "../../utils/ApiManager";
import { useAuth } from "../../provider/AuthProvider";
import { useAlert } from "../Alert";

export const AddFaculty = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [values, setValues] = useState<{ [key: string]: string }>({});
  const auth = useAuth();
  const { showAlert } = useAlert();

  const handleInputChange =
    (fieldName: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
      setValues((prevValues) => ({
        ...prevValues,
        [fieldName]: event.target.value,
      }));
    };

  const handleSubmit = async () => {
    const response = await PostRequest("/admin/create_faculty", {
      role: auth.user?.role,
      first_name: values["firstName"],
      last_name: values["lastName"],
      email: values["email"],
      password: values["password"],
    }).then((response) => {
      if (!response.ok) {
        showAlert("Error: " + response.statusText, "error");
      } else {
        showAlert("Faculty created successfully!", "success");
        setOpenDialog(false);
        return response.json();
      }
    });
  };

  return (
    <>
      <Button
        variant="outlined"
        size="small"
        startIcon={<AddIcon />}
        sx={{
          marginTop: 2,
          marginLeft: 2,
          marginRight: 2,
        }}
        onClick={() => setOpenDialog(true)}
      >
        Add Faculty
      </Button>
      <Dialog
        sx={{
          "& .MuiDialog-paper": {
            minWidth: "400px",
          },
          textAlign: "center",
        }}
        open={openDialog}
        onClose={() => setOpenDialog(false)}
      >
        <DialogTitle>Enter Details</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid size={6}>
              <TextField
                key="firstName"
                label="First Name"
                variant="outlined"
                fullWidth
                margin="normal"
                value={values["firstName"] || ""}
                onChange={handleInputChange("firstName")}
              />
            </Grid>
            <Grid size={6}>
              <TextField
                key="lastName"
                label="Last Name"
                variant="outlined"
                fullWidth
                margin="normal"
                value={values["lastName"] || ""}
                onChange={handleInputChange("lastName")}
              />
            </Grid>
            <Grid size={6}>
              <TextField
                key="email"
                label="Email"
                variant="outlined"
                fullWidth
                margin="normal"
                value={values["email"] || ""}
                onChange={handleInputChange("email")}
              />
            </Grid>
            <Grid size={6}>
              <TextField
                key="password"
                label="Password"
                type="password"
                variant="outlined"
                fullWidth
                margin="normal"
                value={values["password"] || ""}
                onChange={handleInputChange("password")}
              />
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleSubmit} color="primary">
            Submit
          </Button>
          <Button onClick={() => setOpenDialog(false)} color="secondary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
