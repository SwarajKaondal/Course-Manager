import React, { useEffect, useState } from "react";
import { useAuth } from "../../provider/AuthProvider";
import { CourseInfo, User } from "../../models/models";

// Material-UI imports
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  Select,
  FormControl,
  InputLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
} from "@mui/material";
import Grid from "@mui/material/Grid2";

import { GetRequest, PostRequest } from "../../utils/ApiManager";
import MenuItem from "@mui/material/MenuItem";

interface DialogMessage {
  title: string;
  message: string;
}

export const Login: React.FC = () => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [allCourses, setAllCourses] = useState<CourseInfo[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<string>("");
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [dialogMessage, setDialogMessage] = useState<DialogMessage>({
    title: "",
    message: "",
  });
  const { login } = useAuth();

  const fetchAllCourses = async () => {
    const courses: CourseInfo[] = await GetRequest(
      "/common/get_course_info",
    ).then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    });
    setAllCourses(courses);
  };

  const handleEnrollCourse = () => {
    const jsonData = {
      first_name: firstName,
      last_name: lastName,
      email: email,
      course_token: selectedCourse,
    };
    PostRequest("/person/enroll", jsonData).then((response) => {
      if (response.ok) {
        const currentDate = new Date();
        const month = String(currentDate.getMonth() + 1).padStart(2, "0"); // Ensures two digits for month
        const year = String(currentDate.getFullYear()).slice(-2); // Last two digits of the year
        setDialogMessage({
          title: "Enrollment Successful",
          message: `Username: ${firstName.slice(0, 2)}${lastName.slice(
            0,
            2,
          )}${month}${year} Password: temppass`,
        });
        setDialogOpen(true);
      } else {
        response.text().then((text) => {
          setDialogMessage({
            title: "Enrollment Failed",
            message: `Cannot enroll!!! Please check if not already enrolled.`,
          });
          setDialogOpen(true);
        });
      }
    });
  };
  // Handle form submission
  const handleLogin = async (
    e: React.FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    e.preventDefault();
    setError(null);
    const response = await PostRequest("/person/login", {
      user_id: username,
      password: password,
    });
    if (response.ok) {
      const userData: User = await response.json();
      await login(userData);
    } else {
      setError("Invalid username or password");
    }
  };

  useEffect(() => {
    fetchAllCourses();
  }, []);

  return (
    <Grid container spacing={2}>
      <Grid size={6}>
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          minHeight="100vh"
        >
          <Typography variant="h4" gutterBottom>
            Login to Course Manager!!!
          </Typography>
          {error && <Alert severity="error">{error}</Alert>}
          <form onSubmit={handleLogin}>
            <Box marginBottom={2}>
              <TextField
                id="username"
                label="Username"
                variant="outlined"
                fullWidth
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </Box>
            <Box marginBottom={2}>
              <TextField
                id="password"
                label="Password"
                type="password"
                variant="outlined"
                fullWidth
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Box>
            <Button type="submit" variant="contained" color="primary" fullWidth>
              Login
            </Button>
          </form>
        </Box>
      </Grid>
      <Grid size={6}>
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          minHeight="100vh"
          maxWidth={400}
        >
          <Typography variant="h4" gutterBottom>
            Enroll in course
          </Typography>
          <Grid container spacing={2} direction="column">
            <Grid>
              <TextField
                fullWidth
                label="First Name"
                variant="outlined"
                margin="normal"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </Grid>
            <Grid>
              <TextField
                fullWidth
                label="Last Name"
                variant="outlined"
                margin="normal"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </Grid>
            <Grid>
              <TextField
                fullWidth
                label="Email"
                variant="outlined"
                margin="normal"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Grid>
            <Grid>
              <FormControl fullWidth margin="normal" variant="outlined">
                <InputLabel id="course-label">Course</InputLabel>
                <Select
                  labelId="course-label"
                  value={selectedCourse || ""}
                  onChange={(e) => setSelectedCourse(e.target.value)}
                  label="Course"
                >
                  {allCourses.map((course, id) => (
                    <MenuItem key={course.Token} value={course.Token}>
                      {course.Title + "(" + course.Token + ")"}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                sx={{ marginTop: "20px" }}
                onClick={handleEnrollCourse}
              >
                Enroll
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Grid>
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle>{dialogMessage.title}</DialogTitle>
        <DialogContent>
          <DialogContentText
            style={{ fontSize: "1rem", color: "gray" }} // You can change the color as needed
          >
            {dialogMessage.message}
          </DialogContentText>
        </DialogContent>
      </Dialog>
    </Grid>
  );
};
