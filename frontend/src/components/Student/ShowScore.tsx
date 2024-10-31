import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  DialogActions,
} from "@mui/material";
import { useState } from "react";
import { Course } from "../../models/models";

export const ShowScore = () => {
  const [openDialog, setOpenDialog] = useState(false);

  return (
    <>
      {/* <Button
            variant="outlined"
            size="small"
            sx={{
              marginBottom: 1,
              marginTop: 2,
              marginLeft: 2,
            }}
            onClick={() => setOpenDialog(true)}
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
            open={openDialog}
            onClose={() => setOpenDialog(false)}
          >
            <DialogTitle>Scores</DialogTitle>
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
                onClick={() => setOpenDialog(false)}
                color="secondary"
              >
                Cancel
              </Button>
            </DialogActions>
          </Dialog> */}
    </>
  );
};
