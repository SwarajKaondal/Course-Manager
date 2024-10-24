import { Box, Paper, Typography } from "@mui/material";
import { TextbookComponent } from "../components/Textbook/Textbook";
import { Course, Textbook } from "../models/models";
import Grid from "@mui/material/Grid2";
import { Header } from "../components/Header/Header";
import { CourseComponent } from "../components/Course/Course";
import { useEffect, useState } from "react";

export const CommonPage = ({
  courses,
  textbooks,
  refreshTextbooks,
  refreshCourses,
  viewOnly,
}: {
  courses: Course[];
  textbooks: Textbook[];
  refreshTextbooks: () => void;
  refreshCourses: () => void;
  viewOnly: Boolean;
}) => {
  const [selectedTextbook, setSelectedTextbook] = useState<Number | undefined>(
    undefined
  );

  let textbook;
  useEffect(() => {
    textbook = textbooks.find(
      (textbook) => textbook.textbook_id === selectedTextbook
    );
  }, [selectedTextbook]);

  return (
    <Box
      sx={{
        flexDirection: "column",
        height: "100vh",
      }}
    >
      <Header />
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
                <div style={{ marginBottom: 10 }}>
                  <CourseComponent
                    course={course}
                    refreshCourses={refreshCourses}
                    selectTextbook={setSelectedTextbook}
                    viewOnly={viewOnly}
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
                viewOnly={false}
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
    </Box>
  );
};
