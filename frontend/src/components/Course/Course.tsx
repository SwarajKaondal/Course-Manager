import { Course, Textbook, User, Waitlist } from "../../models/models";
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
  TableContainer,
  Paper,
  TableHead,
  TableRow,
  TableCell,
  Table,
  TableBody,
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
  showWaitlist,
  showStudents,
}: {
  course: Course;
  selectTextbook: React.Dispatch<React.SetStateAction<Number | undefined>>;
  refreshCourses: () => void;
  viewOnly: Boolean;
  showWaitlist: Boolean;
  showStudents: Boolean;
}) => {
  const [open, setOpen] = useState(false);
  const [openWaitlist, setOpenWaitlist] = useState(false);
  const [openStudents, setOpenStudents] = useState(false);
  const [textbookName, setTextbookName] = useState("");
  const [waitlist, setWaitlist] = useState<Waitlist | null>(null);
  const [students, setStudents] = useState<User[]>([]);

  const fetchWaitlist = async () => {
    const response = await PostRequest("/faculty/waitlist", {
      course_id: course.course_id,
    });
    if (response.ok) {
      const data = (await response.json()) as Waitlist;
      return data;
    }
  };

  const fetchStudents = async () => {
    const response = await PostRequest("/faculty/students", {
      course_id: course.course_id,
    });
    if (response.ok) {
      const data = (await response.json()) as User[];
      return data;
    }
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleClickOpenWaitlist = async () => {
    const waitlist = await fetchWaitlist();
    setWaitlist(waitlist ?? null);
    if (waitlist !== null) {
      setOpenWaitlist(true);
    }
  };

  const handleOpenStudents = async () => {
    const students = await fetchStudents();
    setStudents(students ?? []);
    if (students !== null) {
      setOpenStudents(true);
    }
  };

  const handleCloseStudents = () => {
    setOpenStudents(false);
  };

  const handleCloseWaitlist = () => {
    setOpenWaitlist(false);
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

  const handleApprove = async (student_id: string) => {
    const response = await PostRequest("/faculty/approve", {
      course_id: course.course_id,
      student_id: student_id,
    });
    if (response.ok) {
      fetchWaitlist().then((res) => {
        if (res !== undefined) {
          setWaitlist(res);
        }
      });
    }
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
                display: viewOnly ? "" : "",
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

          <Dialog open={openWaitlist} onClose={handleCloseWaitlist}>
            <DialogTitle>Approve students</DialogTitle>
            <DialogContent>
              <TableContainer component={Paper}>
                <Table sx={{}}>
                  <TableHead>
                    <TableRow>
                      <TableCell align="right">First Name</TableCell>
                      <TableCell align="right">Last Name</TableCell>
                      <TableCell align="right">Email</TableCell>
                      <TableCell align="right">Approve</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {waitlist?.students.map((student, id) => (
                      <TableRow key={id}>
                        <TableCell align="right">
                          {student.first_name}
                        </TableCell>
                        <TableCell align="right">{student.last_name}</TableCell>
                        <TableCell align="right">{student.email}</TableCell>
                        <TableCell align="right">
                          <Button
                            variant="contained"
                            color="primary"
                            size="small"
                            onClick={() => handleApprove(student.user_id)}
                          >
                            Approve
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseWaitlist} color="secondary">
                Cancel
              </Button>
            </DialogActions>
          </Dialog>
          {showWaitlist && course.type.toLowerCase() === "active" && (
            <Button
              variant="outlined"
              startIcon={<ExpandMoreIcon />}
              size="small"
              sx={{
                marginBottom: 1,
                marginTop: 1,
                display: viewOnly ? "none" : "",
              }}
              onClick={handleClickOpenWaitlist}
            >
              View Waitlist
            </Button>
          )}
          <Dialog open={openStudents} onClose={handleCloseStudents}>
            <DialogTitle>View Students</DialogTitle>
            <DialogContent>
              <TableContainer component={Paper}>
                <Table sx={{}}>
                  <TableHead>
                    <TableRow>
                      <TableCell align="right">Student Id</TableCell>
                      <TableCell align="right">First Name</TableCell>
                      <TableCell align="right">Last Name</TableCell>
                      <TableCell align="right">Email</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {students?.map((student, id) => (
                      <TableRow key={id}>
                        <TableCell align="right">{student.user_id}</TableCell>
                        <TableCell align="right">
                          {student.first_name}
                        </TableCell>
                        <TableCell align="right">{student.last_name}</TableCell>
                        <TableCell align="right">{student.email}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseStudents} color="secondary">
                Cancel
              </Button>
            </DialogActions>
          </Dialog>
          {showStudents && course.type.toLowerCase() === "active" && (
            <Button
              variant="outlined"
              startIcon={<ExpandMoreIcon />}
              size="small"
              sx={{
                marginBottom: 1,
                marginTop: 1,
                display: viewOnly ? "none" : "",
              }}
              onClick={handleOpenStudents}
            >
              View Students
            </Button>
          )}
        </CardContent>
      </Card>
    </Container>
  );
};
