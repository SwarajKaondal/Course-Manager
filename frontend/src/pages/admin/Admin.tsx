import { Course, Textbook } from "../../models/models";
import { useEffect, useState } from "react";
import { CommonPage } from "../CommonPage";
import { GetRequest, PostRequest } from "../../utils/ApiManager";
import { useAuth } from "../../provider/AuthProvider";

export const Admin = () => {
  const [course_list, setCourseList] = useState<Course[]>([]);
  const [textbook_list, setTextbookList] = useState<Textbook[]>([]);
  const auth = useAuth();
  const viewOnly =
    auth.user?.role_name.toLowerCase() === "student" ? true : false;
  const showWaitlist =
    auth.user?.role_name.toLowerCase() === "faculty" ? true : false;

  const fetchCourses = async () => {
    const courses: Course[] = await PostRequest("/common/course", {
      role_id: auth.user?.role,
      user_id: auth.user?.user_id,
    }).then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    });
    setCourseList(courses);
    const textbooks = courses
      .map((course) => course.textbooks)
      .flat()
      .filter((textbook) => textbook !== undefined);

    setTextbookList(textbooks as Textbook[]);
  };

  const refreshTextbooks = () => {
    fetchCourses();
  };

  const refreshCourses = () => {
    fetchCourses();
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  return (
    <CommonPage
      courses={course_list}
      textbooks={textbook_list}
      refreshTextbooks={refreshTextbooks}
      refreshCourses={refreshCourses}
      viewOnly={viewOnly}
      showWaitlist={false}
      showStudents={false}
    />
  );
};
