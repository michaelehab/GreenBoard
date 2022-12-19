import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Home } from "./pages/homePage";
import { NavBar } from "./components/navBar";

export const App = () => {
  return (
    <BrowserRouter>
      <>
        <NavBar />
      </>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
};
