import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Home } from "./pages/homePage";

export const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
};
