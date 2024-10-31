import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useEffect, useState } from "react";
import Grid from "@mui/material/Grid2";
import { GetRequest, PostRequest } from "../../utils/ApiManager";
import { useAuth } from "../../provider/AuthProvider";

export const AddCourse = ({
  courseType,
}: {
  courseType: "active" | "evaluation";
}) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [values, setValues] = useState<{ [key: string]: string }>({});
  const [textbooks, setTextbooks] = useState<
    { textbook_id: string; title: string }[]
  >([]);
  const [selectedTextbook, setSelectedTextbook] = useState<string | null>(null);
  const auth = useAuth();

  const handleInputChange =
    (fieldName: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
      setValues((prevValues) => ({
        ...prevValues,
        [fieldName]: event.target.value,
      }));
    };

  const handleSubmit = async () => {
    const payload = {
      role: auth.user?.role,
      course_id: values["course_id"],
      course_name: values["course_name"],
      faculty: values["faculty"],
      start_date: values["start_date"],
      end_date: values["end_date"],
      textbook_id: selectedTextbook,
      ...(courseType === "active" && {
        token: values["token"],
        course_cap: values["course_cap"],
      }),
    };

    const endpoint =
      courseType === "active"
        ? "/admin/add_active_course"
        : "/admin/add_eval_course";
    const response = await PostRequest(endpoint, payload).then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      setOpenDialog(false);
      return response.json();
    });
  };

  const handleTextbookChange = (event: { target: { value: string } }) => {
    setSelectedTextbook(event.target.value as string);
  };

  useEffect(() => {
    const fetchTextbooks = async () => {
      try {
        const response = await GetRequest("/common/get_textbook_info");
        if (response.ok) {
          const data = await response.json();
          setTextbooks(data);
        } else {
          console.error("Failed to fetch textbooks");
        }
      } catch (error) {
        console.error("Error fetching textbooks:", error);
      }
    };
    fetchTextbooks();
  }, []);

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
        Add {courseType} course
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
        <DialogTitle>Enter Course Details</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            {["course_id", "course_name", "faculty", "start_date", "end_date"]
              .concat(courseType === "active" ? ["token", "course_cap"] : [])
              .map((field) => (
                <Grid key={field} size={6}>
                  <TextField
                    label={field
                      .replace("_", " ")
                      .replace(/\b\w/g, (char) => char.toUpperCase())}
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    type={
                      field === "start_date" || field === "end_date"
                        ? "date"
                        : "text"
                    }
                    value={values[field] || ""}
                    onChange={handleInputChange(field)}
                  />
                </Grid>
              ))}
            <Grid size={12}>
              <FormControl fullWidth margin="normal">
                <InputLabel>Select Textbook</InputLabel>
                <Select
                  value={selectedTextbook || ""}
                  onChange={handleTextbookChange}
                >
                  {textbooks.map((textbook) => (
                    <MenuItem
                      key={textbook.textbook_id}
                      value={textbook.textbook_id}
                    >
                      {textbook.title}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
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
