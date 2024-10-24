import { Course, Textbook } from "../../models/models";
import { useEffect, useState } from "react";
import { CommonPage } from "../CommonPage";
import { GetRequest, PostRequest } from "../../utils/ApiManager";
import { useAuth } from "../../provider/AuthProvider";

const textbook: Textbook = {
  textbook_id: 1,
  title: "Programming Basics",
  chapters: [
    {
      chapter_id: 1,
      chapter_number: "1",
      title: "Getting Started",
      sections: [
        {
          section_id: 1,
          title: "Introduction to Programming",
          section_number: 1,
          content_blocks: [
            {
              content_block_id: 1,
              hidden: false,
              created_by: {
                user_id: "u2",
                first_name: "Harry ",
                last_name: "Smith",
                email: "h@s.com",
                role_name: "Faculty",
                role: 2,
              },
              sequence_number: 1,
              text_block: {
                text_block_id: 1,
                text: "This section introduces programming concepts.",
              },
              image: undefined,
              activity: {
                activity_id: 1,
                question: "What is programming?",
                answer1: {
                  answer_id: 1,
                  answer_text: "The process of creating software.",
                  answer_explaination: "",
                  correct: true,
                },
                answer2: {
                  answer_id: 2,
                  answer_text: "A way to solve problems.",
                  answer_explaination: "",
                  correct: false,
                },
                answer3: {
                  answer_id: 3,
                  answer_text: "Just writing code.",
                  answer_explaination: "",
                  correct: false,
                },
                answer4: {
                  answer_id: 4,
                  answer_text: "None of the above.",
                  answer_explaination: "",
                  correct: false,
                },
                score: undefined,
              },
            },
          ],
        },
      ],
    },
  ],
};

const sampleCourse: Course = {
  course_id: "CS101",
  title: "Introduction to Computer Science",
  faculty: {
    user_id: "u1",
    first_name: "Ben ",
    last_name: "Smith",
    email: "b@s.com",
    role_name: "Faculty",
    role: 2,
  },
  start_date: new Date("2024-01-10"),
  end_date: new Date("2024-05-15"),
  type: "Lecture",
  token: "ABC123",
  course_capacity: 30,
  textbooks: [textbook],
};

export const Admin = () => {
  const [course_list, setCourseList] = useState<Course[]>([]);
  const [textbook_list, setTextbookList] = useState<Textbook[]>([]);
  const auth = useAuth();

  const fetchCourses = async () => {
    const courses: Course[] = await PostRequest("/common/textbooks", {
      role_id: auth.user?.role,
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
      viewOnly={false}
    />
  );
};
