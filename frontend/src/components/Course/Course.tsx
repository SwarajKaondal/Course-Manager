import { Course, Textbook } from "../../models/models";
import { styled } from "@mui/material/styles";
import { format } from "date-fns";
import AddIcon from "@mui/icons-material/Add";
import Grid from "@mui/material/Grid2";
import {
  Badge,
  Card,
  CardContent,
  Typography,
  Chip,
  CardActions,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Container,
  Dialog,
  DialogTitle,
  TextField,
  DialogContent,
  DialogActions,
  Link,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useState } from "react";
import { PostRequest } from "../../utils/ApiManager";
import { useAuth } from "../../provider/AuthProvider";

export const CourseComponent = ({
  course,
  selectTextbook,
  refreshCourses,
  viewOnly,
}: {
  course: Course;
  selectTextbook: React.Dispatch<React.SetStateAction<Number | undefined>>;
  refreshCourses: () => void;
  viewOnly: Boolean;
}) => {
  const [open, setOpen] = useState(false);
  const [textbookName, setTextbookName] = useState("");

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const auth = useAuth();

  const handleSave = async () => {
    console.log("Textbook Name:", textbookName);
    const response = await PostRequest("/admin/create_textbook", {
      role: auth.user?.role,
      title: textbookName,
      course_id: course.course_id,
    });
    if (response.ok) {
      refreshCourses();
    }
    setOpen(false);
  };

  return (
    <Container maxWidth="sm">
      <Card sx={{ witdh: "200px", border: 1 }}>
        <CardContent>
          <Grid container>
            <Grid size={10}>
              <Typography variant="h5" component="div">
                {course.title}
              </Typography>
            </Grid>
            <Grid size={2}>
              <Chip
                color={course.type === "Active" ? "success" : "primary"}
                label={course.type}
              />
            </Grid>
          </Grid>

          <Typography variant="h6" component="div">
            Instructor: {course.faculty.first_name} {course.faculty.last_name}
          </Typography>

          <Typography sx={{ color: "text.secondary", mb: 1.5 }}>
            {format(course.start_date, "MMMM d, yyyy")} -{" "}
            {format(course.end_date, "MMMM d, yyyy")}
            <br />
            Student Capacity: {course.course_capacity ?? "N/A"}
          </Typography>

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
          {course.textbooks === undefined && (
            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              size="small"
              sx={{
                marginBottom: 1,
                display: viewOnly ? "none" : "",
              }}
              onClick={handleClickOpen}
            >
              Add Textbook
            </Button>
          )}
          {course.textbooks !== undefined && (
            <Link
              component="button"
              variant="body2"
              onClick={() => {
                selectTextbook(course.textbooks?.textbook_id);
              }}
              sx={{ cursor: "pointer" }}
            >
              {course.textbooks?.title}
            </Link>
          )}
        </CardContent>
      </Card>
    </Container>
  );
};
