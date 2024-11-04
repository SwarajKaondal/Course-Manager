import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { TextbookComponent } from "../components/Textbook/Textbook";
import { Course, CourseInfo, Textbook, Waitlist } from "../models/models";
import Grid from "@mui/material/Grid2";
import { Header } from "../components/Header/Header";
import { CourseComponent } from "../components/Course/Course";
import { useEffect, useState } from "react";
import { useAuth } from "../provider/AuthProvider";
import { GetRequest, PostRequest } from "../utils/ApiManager";
import { AddFaculty } from "../components/AddPerson/AddFaculty";
import { AddCourse } from "../components/Course/AddCourse";
import { AddTextbook } from "../components/Textbook/AddTextbook";

export const CommonPage = ({
  courses,
  textbooks,
  refreshTextbooks,
  refreshCourses,
  viewOnly,
  showWaitlist,
  showStudents,
}: {
  courses: Course[];
  textbooks: Textbook[];
  refreshTextbooks: () => void;
  refreshCourses: () => void;
  viewOnly: Boolean;
  showWaitlist: Boolean;
  showStudents: Boolean;
}) => {
  const auth = useAuth();

  const [allCourses, setAllCourses] = useState<CourseInfo[]>([]);
  const [textbook, setTextBook] = useState<Textbook | undefined>(undefined);
  const [showChangePass, setChangePass] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<String[]>([]);
  const isFormValid =
    currentPassword && newPassword && newPassword === confirmPassword;

  const setSelectedTextbookForCourse = (
    textbook_id: number,
    course_id: String
  ) => {
    setTextBook(
      textbooks.find(
        (textbook) =>
          textbook.textbook_id === textbook_id &&
          textbook.course_id == course_id
      )
    );
  };

  const fetchNotifications = async () => {
    const requestData = {
      user_id: auth.user?.user_id,
    };
    const response = await PostRequest("/common/notification", requestData);
    const data = (await response.json()) as String[];
    return data;
  };

  const handlePasswordChange = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const changePassData = {
      user_id: auth.user?.user_id,
      old_password: currentPassword,
      new_password: newPassword,
      confirm_password: confirmPassword,
    };

    PostRequest("/person/password", changePassData)
      .then((res) => {
        if (res.status === 201) {
          setChangePass(false);
          setCurrentPassword("");
          setNewPassword("");
          setConfirmPassword("");
        } else {
          alert("Password change failed");
        }
      })
      .catch((err) => {
        alert("Password change failed");
      });
  };

  const handleShowNotifications = (val: boolean) => {
    if (val === true) {
      fetchNotifications().then((data) => {
        setNotifications(data);
        setShowNotifications(true);
      });
    } else {
      setShowNotifications(false);
    }
  };

  useEffect(() => {
    if (textbook !== undefined) {
      setTextBook(
        textbooks.find(
          (textbook_) =>
            textbook_.textbook_id === textbook.textbook_id &&
            textbook_.course_id == textbook.course_id
        )
      );
    }
  }, [textbook, textbooks]);

  useEffect(() => {
    fetchAllCourses();
  }, [courses]);

  const [openCourseList, setOpenCourseList] = useState(false);

  const fetchAllCourses = async () => {
    let course_infos: CourseInfo[] = await PostRequest(
      "/common/get_course_info",
      { user_id: auth.user?.user_id }
    ).then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    });
    course_infos = course_infos.filter(
      (c) => !courses.map((c1) => c1.course_id).includes(c.Course_Id)
    );
    setAllCourses(course_infos);
  };

  const handleEnroll = async (email: String, course_token: String) => {
    const response = await PostRequest("/student/enroll", {
      email: email,
      course_token: course_token,
    });
    if (response.ok) {
      fetchAllCourses();
    }
  };

  return (
    <Box
      sx={{
        flexDirection: "column",
        height: "100vh",
      }}
    >
      <Header
        setChangePass={setChangePass}
        setShowNotification={handleShowNotifications}
      />

      {auth.user?.role_name === "Admin" && (
        <>
          <AddFaculty />
          <AddTextbook />
          <AddCourse courseType="active" />
          <AddCourse courseType="evaluation" />
          Textbook dropdown | Add edit and delete on chapter, section
        </>
      )}
      {auth.user?.role_name === "Student" && (
        <>
          <Button
            variant="outlined"
            size="small"
            sx={{
              marginBottom: 1,
              marginTop: 2,
              marginLeft: 2,
            }}
            onClick={() => setOpenCourseList(true)}
          >
            Show Courses
          </Button>
          <Dialog
            sx={{
              "& .MuiDialog-paper": {
                minWidth: "400px",
              },
              textAlign: "center",
            }}
            open={openCourseList}
            onClose={() => setOpenCourseList(false)}
          >
            <DialogTitle>Course List</DialogTitle>
            <DialogContent>
              <TableContainer component={Paper}>
                <Table sx={{}}>
                  <TableHead>
                    <TableRow>
                      <TableCell align="right">Course Name</TableCell>
                      <TableCell align="right">Course Id</TableCell>
                      <TableCell align="right">Enroll</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {allCourses?.map((course, id) => (
                      <TableRow key={id}>
                        <TableCell align="right">{course.Title}</TableCell>
                        <TableCell align="right">{course.Course_Id}</TableCell>
                        <TableCell align="right">
                          <Button
                            variant="contained"
                            color="primary"
                            size="small"
                            onClick={() =>
                              handleEnroll(
                                auth.user !== null ? auth.user.email : "",
                                course.Token as String
                              )
                            }
                          >
                            Enroll
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </DialogContent>
            <DialogActions>
              <Button
                onClick={() => setOpenCourseList(false)}
                color="secondary"
              >
                Cancel
              </Button>
            </DialogActions>
          </Dialog>
        </>
      )}

      <Grid
        sx={{
          flexGrow: 1,
        }}
        container
        spacing={2}
        margin={2}
      >
        <Grid
          sx={{
            flexGrow: 1,
            maxHeight: "80vh",
          }}
          size={3}
        >
          {" "}
          <Paper
            elevation={3}
            sx={{ height: "100%", padding: "16px", overflow: "auto" }}
          >
            {courses.length > 0 &&
              courses.map((course) => (
                <div key={"" + course.course_id} style={{ marginBottom: 10 }}>
                  <CourseComponent
                    course={course}
                    refreshCourses={refreshCourses}
                    selectTextbook={setSelectedTextbookForCourse}
                    viewOnly={viewOnly}
                    showWaitlist={showWaitlist}
                    showStudents={showStudents}
                  />
                </div>
              ))}
            {courses.length === 0 && (
              <Typography variant="h6"> No courses available</Typography>
            )}
          </Paper>
        </Grid>
        <Grid
          sx={{
            flexGrow: 1,
            maxHeight: "80vh",
          }}
          size={9}
        >
          {" "}
          <Paper
            elevation={3}
            style={{ height: "100%", padding: "16px", overflow: "auto" }}
          >
            {textbook && (
              <TextbookComponent
                textbook={textbook}
                refreshTextbooks={refreshTextbooks}
                viewOnly={viewOnly}
              />
            )}
            {textbook === undefined && (
              <Typography variant="h6">
                {" "}
                Select a textbook from course list{" "}
              </Typography>
            )}
          </Paper>
        </Grid>
      </Grid>
      <Dialog open={showChangePass} onClose={() => setChangePass(false)}>
        <DialogTitle>Change Password</DialogTitle>
        <DialogContent>
          <form onSubmit={handlePasswordChange}>
            <TextField
              label="Current Password"
              type="password"
              fullWidth
              margin="dense"
              required
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
            <TextField
              label="New Password"
              type="password"
              fullWidth
              margin="dense"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <TextField
              label="Confirm New Password"
              type="password"
              fullWidth
              margin="dense"
              required
              error={newPassword !== confirmPassword && confirmPassword !== ""}
              helperText={
                newPassword !== confirmPassword && confirmPassword !== ""
                  ? "Passwords do not match"
                  : ""
              }
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <DialogActions>
              <Button onClick={() => setChangePass(false)} color="secondary">
                Cancel
              </Button>
              <Button type="submit" color="primary" disabled={!isFormValid}>
                Submit
              </Button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>
      <Dialog
        open={showNotifications}
        onClose={() => setShowNotifications(false)}
        PaperProps={{
          sx: {
            width: "400px",
            borderRadius: "8px",
            boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
          },
        }}
      >
        <DialogTitle sx={{ textAlign: "center", fontWeight: "bold" }}>
          Notifications
        </DialogTitle>
        <DialogContent>
          <TableContainer
            component={Paper}
            sx={{
              mt: 2,
              boxShadow: "none",
              border: "1px solid #e0e0e0",
              borderRadius: "4px",
              maxHeight: "250px", // Optional: make the table scrollable
            }}
          >
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell
                    align="center"
                    sx={{ fontWeight: "bold", color: "#333" }}
                  >
                    Notifications
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {notifications.length > 0 ? (
                  notifications.map((notification, id) => (
                    <TableRow key={id}>
                      <TableCell
                        align="center"
                        sx={{ padding: "12px", fontSize: "14px" }}
                      >
                        {notification}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      align="center"
                      sx={{ padding: "20px", color: "#757575" }}
                    >
                      No Notifications
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <DialogActions>
            <Button
              onClick={() => setShowNotifications(false)}
              color="secondary"
              variant="contained"
              sx={{
                mt: 2,
                width: "100%",
                fontWeight: "bold",
                boxShadow: "none",
              }}
            >
              Close
            </Button>
          </DialogActions>
        </DialogContent>
      </Dialog>
    </Box>
  );
};
