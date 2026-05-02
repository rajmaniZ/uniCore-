import Loader from "./component/loader/loader";

import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/authContext";

import { useEffect, useState } from "react";

import Layout from "./layout/layout";
import LoginLayout from "./pages/login/loginLayout";
import DashboardLayout from "./pages/Dashboard/component/Dashboardlayout/Dashboardlayout";

import Home from "./pages/home/home";
import Features from "./pages/features/features";
import About from "./pages/about/about";
import Contact from "./pages/contact/contact";
import AboutFeature from "./pages/features/about";
import Career from "./pages/careers/careers";
import Blog from "./pages/blog/blog";
import TermsOfservice from "./pages/termsOfservice/termsOfservice";
import PrivacyPolicy from "./pages/privacyPolicy/privacyPolicy";
import HelpCenter from "./pages/helpCenter/helpCenter";
import Guide from "./pages/Guide/guides";
import Faqs from "./pages/faqs/faqs";
import Document from "./pages/documentation/Documantation";
import PublicInstitute from "./pages/aboutInstitute/aboutInstitute";
import Aichat from './pages/aiChat/chat';

import Login from "./pages/login/login";
import Register from "./pages/login/register/collegeRegister";
import ForgetPassword from "./pages/login/forget-password";
import RequestForAccount from "./pages/login/register/requestForAccount";

import DataView from "./pages/Dashboard/component/dataView/DataView";

import JoinRequestsPage from "./pages/Dashboard/component/joinRequests/joinRequests";
import Profile from "./pages/Dashboard/component/profile/profile";
import SettingsPage from "./pages/Dashboard/component/setting/settingsPage";
import TimetablePage from "./pages/Dashboard/component/timetable/timetablePage";
import Attendance from "./pages/Dashboard/component/markAttandence/Attendance";
import Subjects from "./pages/Dashboard/component/subjects/subjects";
import CreateAssignment from "./pages/Dashboard/component/createAssignments/assignment";
import SubmitAssignment from "./pages/Dashboard/component/submitAssignments/assignment";
import AboutInstitute from "./pages/Dashboard/admin/aboutInstitute/aboutInstitute";

import AdminDashboard from "./pages/Dashboard/admin/dashboard/dashboard";
import SuperAdminDashboard from "./pages/Dashboard/superAdmin/dashboard/dashboard";
import HodDashboard from "./pages/Dashboard/HoD/dashboard/dashboard";
import StudentDashboard from "./pages/Dashboard/student/dashboard/dashboard";
import TeacherDashboard from "./pages/Dashboard/teacher/dashboard/dashboard";

const rolePath = (role) => {
  const normalized = role?.toLowerCase();
  return normalized === "superadmin" ? "/superadmin" : `/${normalized || "login"}`;
};

function ProtectedRoute({ allowedRoles }) {
  const { user, token, isLoading } = useAuth();

  if (isLoading) return <Loader />;
  if (!token || !user) return <Navigate to="/login" replace />;

  const role = user.role?.toLowerCase();
  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to={rolePath(role)} replace />;
  }

  return <Outlet />;
}

function GuestRoute() {
  const { user, token, isLoading } = useAuth();

  if (isLoading) return <Loader />;
  if (token && user) return <Navigate to={rolePath(user.role)} replace />;

  return <Outlet />;
}

function AppRoutes() {
  const { user, isLoading } = useAuth();

  const [showLoader, setShowLoader] = useState(true);
  const [fade, setFade] = useState(true);

  const home = user ? rolePath(user.role) : "/login";

  useEffect(() => {
    const timer = setTimeout(() => {
      setFade(false); 

      setTimeout(() => {
        setShowLoader(false); 
      }, 650); 
    },5000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading || showLoader) {
    return (
      <div
        style={{
          opacity: fade ? 1 : 0,
          transition: "opacity .9s ease",
        }}
      >
        <Loader />
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={user ? <Navigate to={home} replace /> : <Home />} />
        <Route path="features" element={<Features />} />
        <Route path="features/:id" element={<AboutFeature />} />
        <Route path="about" element={<About />} />
        <Route path="contact" element={<Contact />} />
        <Route path="career" element={<Career />} />
        <Route path="blog" element={<Blog />} />
        <Route path="terms" element={<TermsOfservice />} />
        <Route path="privacy" element={<PrivacyPolicy />} />
        <Route path="help" element={<HelpCenter />} />
        <Route path="guide" element={<Guide />} />
        <Route path="faqs" element={<Faqs />} />
        <Route path="docs" element={<Document />} />
        <Route path="institute/:id" element={<PublicInstitute />} />
        <Route path="aiChat" element={<Aichat />} />
      </Route>

      <Route element={<GuestRoute />}>
        <Route path="/" element={<LoginLayout />}>
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="forgotPassword" element={<ForgetPassword />} />
          <Route path="requestAccount" element={<RequestForAccount />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute allowedRoles={["superadmin"]} />}>
        <Route path="/superadmin" element={<DashboardLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<SuperAdminDashboard />} />
          <Route path="students" element={<DataView type="students" />} />
          <Route path="teachers" element={<DataView type="teachers" />} />
          <Route path="joinRequests" element={<JoinRequestsPage />} />
          <Route path="profile" element={<Profile />} />
          <Route path="settings" element={<SettingsPage />} />
          {}
          <Route path="aiChat" element={<Aichat />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
        <Route path="/admin" element={<DashboardLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="joinRequests" element={<JoinRequestsPage />} />
          <Route path="students" element={<DataView type="students" />} />
          <Route path="teachers" element={<DataView type="teachers" />} />
          <Route path="subjects" element={<Subjects />} />
          <Route path="attendance" element={<Attendance />} />
          <Route path="timetable" element={<TimetablePage />} />
          <Route path="profile" element={<Profile />} />
          <Route path="aiChat" element={<Aichat />} />
          <Route path="aboutInstitute" element={<AboutInstitute />} />
          <Route path="settings" element={<SettingsPage />} />
          {}
        </Route>
      </Route>

      <Route element={<ProtectedRoute allowedRoles={["hod"]} />}>
        <Route path="/hod" element={<DashboardLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<HodDashboard />} />
          <Route path="joinRequests" element={<JoinRequestsPage />} />
          <Route path="students" element={<DataView type="students" />} />
          <Route path="teachers" element={<DataView type="teachers" />} />
          <Route path="aiChat" element={<Aichat />} />
          <Route path="subjects" element={<Subjects />} />
          <Route path="attendance" element={<Attendance />} />
          <Route path="timetable" element={<TimetablePage />} />
          <Route path="profile" element={<Profile />} />
          <Route path="settings" element={<SettingsPage />} />
          {}
        </Route>
      </Route>

      <Route element={<ProtectedRoute allowedRoles={["teacher"]} />}>
        <Route path="/teacher" element={<DashboardLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<TeacherDashboard />} />
          <Route path="assignment" element={<CreateAssignment />} />
          <Route path="subjects" element={<Subjects />} />
          <Route path="attendance" element={<Attendance />} />
          <Route path="timetable" element={<TimetablePage />} />
          <Route path="profile" element={<Profile />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="aiChat" element={<Aichat />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute allowedRoles={["student"]} />}>
        <Route path="/student" element={<DashboardLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<StudentDashboard />} />
          <Route path="subjects" element={<Subjects />} />
          <Route path="submitAssignment" element={<SubmitAssignment />} />
          <Route path="attendance" element={<Attendance />} />
          <Route path="timetable" element={<TimetablePage />} />
          <Route path="profile" element={<Profile />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="aiChat" element={<Aichat />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to={home} replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}
