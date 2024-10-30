import { useEffect, useState } from "react";
import { useAuth } from "../../provider/AuthProvider";
import { Course, Textbook, Waitlist } from "../../models/models";
import { PostRequest } from "../../utils/ApiManager";
import { CommonPage } from "../CommonPage";

export const Faculty = () => {
  const [course_list, setCourseList] = useState<Course[]>([]);
  const [textbook_list, setTextbookList] = useState<Textbook[]>([]);
  const auth = useAuth();
  const viewOnly = false;

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
      showWaitlist={true}
      showStudents={true}
    />
  );
};
