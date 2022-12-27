import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Home } from "./pages/homePage";
import { NavBar } from "./components/navBar";
import { SignIn } from "./pages/signIn";
import { SignUp } from "./pages/signUp";
import { CreateCourse } from "./pages/createCourse";
import { JoinCourse } from "./pages/joinCourse";
import { ListCourses } from "./pages/myCourses";
import { AvailableCourses } from "./pages/availableCourses";
import { ViewCourse } from "./pages/viewCourse";
import { CreatePost } from "./pages/createPost";
import { CreateStudentQuestion } from "./pages/createStudentQuestion";
import { ViewAnnouncements } from "./pages/viewAnnouncements";
import { CreateAnnouncement } from "./pages/createAnnouncement";
import { NotFound } from "./pages/notFound";
import { SchoolSignUp } from "./components/schoolSignUp";
import { ViewCoursePost } from "./pages/viewCoursePost";
import { DepartmentSignUp } from "./components/departmentSignUp";
import { InstructorSignUp } from "./components/instructorSignUp";
import { StudentSignUp } from "./components/studentSignUp";
import { ViewStudentQuestion } from "./pages/viewStudentQuestion";
import { CreateQuiz } from "./pages/createQuiz";
import { ViewQuiz } from "./pages/viewQuiz";
import { ViewGrades } from "./components/viewGrades";

export const App = () => {
  return (
    <BrowserRouter>
      <>
        <NavBar />
      </>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/courses" element={<ListCourses />} />
        <Route path="/courses/available" element={<AvailableCourses />} />
        <Route path="/courses/:courseId" element={<ViewCourse />} />
        <Route path="/new/course" element={<CreateCourse />} />
        <Route path="/join/:courseId" element={<JoinCourse />} />
        <Route path="/courses/:courseId/new/post" element={<CreatePost />} />
        <Route
          path="/courses/:courseId/new/question"
          element={<CreateStudentQuestion />}
        />
        <Route
          path="/courses/:courseId/posts/:postId"
          element={<ViewCoursePost />}
        />
        <Route
          path="/courses/:courseId/questions/:questionId"
          element={<ViewStudentQuestion />}
        />
        <Route path="/announcements" element={<ViewAnnouncements />} />
        <Route path="/new/announcement" element={<CreateAnnouncement />} />
        <Route path="/new/school" element={<SchoolSignUp />} />
        <Route path="/new/department" element={<DepartmentSignUp />} />
        <Route path="/new/instructor" element={<InstructorSignUp />} />
        <Route path="/new/student" element={<StudentSignUp />} />

        <Route path="/courses/:courseId/new/quiz" element={<CreateQuiz />} />
        <Route
          path="/courses/:courseId/quizzes/:quizId"
          element={<ViewQuiz />}
        />
        <Route path="/courses/:courseId/grades" element={<ViewGrades />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};
