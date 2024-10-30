import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { TextbookComponent } from "../components/Textbook/Textbook";
import { Course, Textbook, Waitlist } from "../models/models";
import Grid from "@mui/material/Grid2";
import { Header } from "../components/Header/Header";
import { CourseComponent } from "../components/Course/Course";
import { useEffect, useState } from "react";
import { useAuth } from "../provider/AuthProvider";
import { PostRequest } from "../utils/ApiManager";

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
  const [selectedTextbook, setSelectedTextbook] = useState<Number | undefined>(
    undefined,
  );
  const [textbook, setTextBook] = useState<Textbook | undefined>(undefined);
  const [showChangePass, setChangePass] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const isFormValid =
    currentPassword && newPassword && newPassword === confirmPassword;

  const handlePasswordChange = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Add logic to handle the password change here

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

  useEffect(() => {
    setTextBook(
      textbooks.find((textbook) => textbook.textbook_id === selectedTextbook),
    );
  }, [selectedTextbook]);

  useEffect(() => {
    setTextBook(
      textbooks.find((textbook) => textbook.textbook_id === selectedTextbook),
    );
  }, [textbooks]);

  return (
    <Box
      sx={{
        flexDirection: "column",
        height: "100vh",
      }}
    >
      <Header setChangePass={setChangePass} />
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
                    selectTextbook={setSelectedTextbook}
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
    </Box>
  );
};
