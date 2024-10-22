import { Course } from "../../models/models";
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
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useState } from "react";

export const CourseComponent = ({
  course,
  viewOnly,
}: {
  course: Course;
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

  const handleSave = () => {
    console.log("Textbook Name:", textbookName);
    // Add your save logic here (e.g., API call)
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

          {course.textbooks !== undefined && course.textbooks.length > 0 && (
            <Accordion sx={{ boxShadow: "none", border: "none" }}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1-content"
                id="panel1-header"
              >
                Textbooks
              </AccordionSummary>
              <AccordionDetails>
                <ol>
                  {course.textbooks.map((textbook, i) => (
                    <li key={i}>{textbook.title}</li>
                  ))}
                </ol>
              </AccordionDetails>
            </Accordion>
          )}
        </CardContent>
      </Card>
    </Container>
  );
};
