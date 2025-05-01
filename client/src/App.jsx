import { BrowserRouter, Routes, Route } from "react-router";
import HomePage from "./pages/home.page";
import LandingPage from "./pages/landing.page";
import RegisterPage from "./pages/register.app";
import LoginPage from "./pages/login.page";
import DetailPage from "./pages/detail.page";
import FavoritePage from "./pages/favorite.page";

function AuthenticatedLayout() {
  const access_token = localStorage.getItem("access_token");
  if (!access_token) {
    return <Navigate to="/login" />;
  }
  return (
    <div>
      <Navbar />
      <Outlet />
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/landing-page" element={<LandingPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/devices/:id" element={<DetailPage />} />
        <Route path="/favorites" element={<FavoritePage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
