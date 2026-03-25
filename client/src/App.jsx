import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";

import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";
import Settings from "./pages/Settings";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Connections from "./pages/Connections";
import Services from "./pages/Services";
import Professionals from "./pages/Professionals";
import ProfessionalProfile from "./pages/ProfessionalProfile";
import EditProfile from "./pages/EditProfile";
import Feed from "./pages/Feed";
import BookAppointment from "./pages/BookAppointment";
import MyAppointments from "./pages/MyAppointments.jsx";
import ProfessionalAppointments from "./pages/ProfessionalAppointments";
import {ScrollToTop} from "./components/ScrollToTop";
import AdminFeed from "./pages/AdminFeed";
import Vacancies from "./pages/Vacancies.jsx";
import GenerateResume from "./pages/GenerateResume.jsx";

import PrivateRoute from "./routes/PrivateRoute";

function AppWrapper() {
  const location = useLocation();

  // Hide header & footer on these pages
  const hideLayout =
    location.pathname === "/login" ||
    location.pathname === "/signup";

  return (
    <>
      {!hideLayout && <Header />}
      <ScrollToTop />

      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />

        <Route
          path="/connections"
          element={
            <PrivateRoute>
              <Connections />
            </PrivateRoute>
          }
        />

        <Route
          path="/settings"
          element={
            <PrivateRoute>
              <Settings />
            </PrivateRoute>
          }
        />

        <Route path="/services" element={<Services />} />

        <Route
          path="/professionals/:role"
          element={
            <PrivateRoute>
              <Professionals />
            </PrivateRoute>
          }
        />

        <Route
          path="/professional/:id"
          element={
            <PrivateRoute>
              <ProfessionalProfile />
            </PrivateRoute>
          }
        />

        <Route
          path="/edit-profile"
          element={
            <PrivateRoute>
              <EditProfile />
            </PrivateRoute>
          }
        />

        <Route
          path="/feed"
          element={
            <PrivateRoute>
              <Feed />
            </PrivateRoute>
          }
        />

        <Route
          path="/appointments"
          element={
            <PrivateRoute>
              {JSON.parse(localStorage.getItem("user"))?.role === "professional"
                ? <ProfessionalAppointments />
                : <BookAppointment />}
            </PrivateRoute>
          }
        />

        <Route 
          path="/my-appointments" 
          element={<MyAppointments/>
          } 
        />

        <Route 
          path="/admin/feed" 
          element={<AdminFeed />
          } 
        />

        <Route
          path="/vacancies"
          element={
            <PrivateRoute>
              <Vacancies />
            </PrivateRoute>
          }
        />

        <Route
          path="/resume"
          element={
            <PrivateRoute>
              <GenerateResume />
            </PrivateRoute>
          }
        />

      </Routes>

      {!hideLayout && <Footer />}
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppWrapper />
    </BrowserRouter>
  );
}

export default App;
