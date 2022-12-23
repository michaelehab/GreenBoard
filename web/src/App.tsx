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
        <Route path="/announcements" element={<ViewAnnouncements />} />
      </Routes>
    </BrowserRouter>
  );
};
