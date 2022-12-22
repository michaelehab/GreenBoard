import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Home } from "./pages/homePage";
import { NavBar } from "./components/navBar";
import { SignIn } from "./pages/signIn";
import { SignUp } from "./pages/signUp";
import { CreateCourse } from "./pages/createCourse";
import { JoinCourse } from "./pages/joinCourse";
import { ListCourses } from "./pages/myCourses";

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
        <Route path="/new/course" element={<CreateCourse />} />
        <Route path="/join/course" element={<JoinCourse />} />
      </Routes>
    </BrowserRouter>
  );
};
