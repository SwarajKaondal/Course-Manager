import { Box, Paper } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { CourseComponent } from "../../components/Course/Course";
import { TextbookComponent } from "../../components/Textbook/Textbook";
import { Course, Textbook } from "../../models/models";
import { Header } from "../../components/Header/Header";
import { useEffect, useState } from "react";
import { useAuth } from "../../provider/AuthProvider";

export const Faculty = () => {
  const [courses, setCourses] = useState<Course[] | null>(null);
  const auth = useAuth();
  useEffect(() => {
    const faculty = auth.user;
  }, []);

  return <></>;
};
