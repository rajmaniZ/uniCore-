
import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import { AuthProvider, useAuth } from "./pages/Dashboard/context/AuthContext";
import { DataProvider } from "./pages/Dashboard/context/dataContext";



// Layouts
import Layout from "./layout/layout";
import LoginLayout from "./pages/login/loginLayout";
import DashboardLayout from "./pages/Dashboard/component/Dashboardlayout/Dashboardlayout";

// Public Pages
import Home from "./pages/home/home";
import Features from "./pages/features/features";
import About from "./pages/about/about";
import Contact from "./pages/contact/contact";
import AboutFeature from './pages/features/about';



import Career from "./pages/careers/careers";
import Blog from "./pages/blog/blog";
import TermsOfservice from "./pages/termsOfservice/termsOfservice";
import PrivacyPolicy from "./pages/privacyPolicy/privacyPolicy";
import HelpCenter from "./pages/helpCenter/helpCenter";
import Guide from "./pages/Guide/guides";
import Faqs from "./pages/faqs/faqs";
import Document from "./pages/documentation/Documantation";



import ComingSoon from "./pages/comingSoon/ComingSoon";

// Auth
import Login from "./pages/login/login";
import Register from "./pages/login/register/collegeRegister";
import ForgetPassword from "./pages/login/forget-password";
import RequestForAccount from "./pages/login/register/requestForAccount";

//  UNIVERSAL SYSTEM
import DataView from "./pages/Dashboard/component/dataView/DataView";
import DetailsPage from "./pages/Dashboard/component/Details/Details";
import JoinRequestsPage from './pages/Dashboard/component/joinRequests/joinRequestPage'
import Profile from "./pages/Dashboard/component/profile/profile";
import SettingsPage from "./pages/Dashboard/component/setting/settingsPage";
import TimetablePage from "./pages/Dashboard/component/timetable/timetablePage";
import Subject from './pages/Dashboard/component/submitAssignments/subjectListAndAttendence/subjects'
import Attendance from "./pages/Dashboard/component/markAttandence/Attendance";
import Assignment from "./pages/Dashboard/component/createAssignments/assignment";
import AssignmentStudent from "./pages/Dashboard/component/submitAssignments/assignment";
import Grades from "./pages/Dashboard/component/grrades/grades";



// Admin
import AdminHome from "./pages/Dashboard/admin/Home/home";
import AdminDashboard from "./pages/Dashboard/admin/dashboard/dashboard";
import AboutAdmin from "./pages/Dashboard/admin/about/about";
import AboutInstitute from "./pages/Dashboard/admin/aboutInstitute/aboutInstitute";




// Super Admin
import SuperAdminDashboard from "./pages/Dashboard/superAdmin/dashboard/dashboard";
import SuperAdminSettings from "./pages/Dashboard/superAdmin/setting/setting";

// HOD
import HodDashboard from "./pages/Dashboard/HoD/dashboard/dashboard";
import Subjects from "./pages/Dashboard/HoD/subjcts/subjcts";

// Others
import Student from "./pages/Dashboard/student/dashboard/dashboard";
import Teacher from "./pages/Dashboard/teacher/dashboard/dashboard";
import { MdHelpCenter } from "react-icons/md";

// ---------------- PROTECTED ROUTE ----------------
function ProtectedRoute({ allowedRoles }) {
  const { currentUser, isLoading } = useAuth();

  if (isLoading) return <div style={{ color: "white", textAlign: "center" }}>Loading...</div>;
  if (!currentUser) return <Navigate to="/login" replace />;

  const role = currentUser.role?.toLowerCase();

  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to={`/${role}`} replace />;
  }

  return <Outlet />;
}

// ---------------- ROUTES ----------------
function AppRoutes() {
  const { currentUser } = useAuth();

  return (
    <Routes>

      {/* ---------- PUBLIC ---------- */}
      <Route path="/" element={<Layout />}>
        <Route
          index
          element={
            currentUser
              ? <Navigate to={`/${currentUser.role.toLowerCase()}`} replace />
              : <Home />
          }
        />

 
        <Route path="about" element={<About />} />
        <Route path="contact" element={<Contact />} />
        <Route path="features" element={<Features />} />
        <Route path="aboutFeature" element ={<AboutFeature/>}/>
        <Route path="career" element={<Career />} />
        <Route path="blog" element={<Blog/>} />
        <Route path="termsofService" element={<TermsOfservice />} />
        <Route path="privacyPolicy" element ={<PrivacyPolicy/>}/>
        <Route path="helpCenter" element={<HelpCenter />} />
        <Route path="Guide" element={<Guide />} />
        <Route path="faqs" element={<Faqs />} />
        <Route path="document" element ={<Document/>}/>
      </Route>

      {/* ---------- AUTH ---------- */}
      <Route path="/" element={<LoginLayout />}>
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="forget-password" element={<ForgetPassword />} />
        <Route path="RequestForAccount" element={<RequestForAccount />} />
      </Route>

      {/* ---------- SUPER ADMIN ---------- */}
      <Route element={<ProtectedRoute allowedRoles={["superadmin"]} />}>
        <Route path="/superadmin" element={<DashboardLayout />}>
          <Route index element={<SuperAdminDashboard />} />

          {/* 🔥 UNIVERSAL DATA */}
          <Route path="students" element={<DataView type="students" />} />
          <Route path="teachers" element={<DataView type="teachers" />} />
          <Route path="colleges" element={<DataView type="colleges" />} />
          <Route path="admins" element={<DataView type="admins" />} />
          <Route path="requests" element={<DataView type="requests" />} />
          <Route path="joinRequests" element={<JoinRequestsPage />} />
          <Route path="profile" element={<Profile/>} />
          <Route path="timetable" element={<TimetablePage/>} />
          <Route path="subject" element={<Subject/>} />
          <Route path="assignment" element={<Assignment/>} />
          <Route path="submitAssignment" element={<AssignmentStudent/>} />

          {/* DETAILS */}
          <Route path=":type/:id" element={<DetailsPage />} />

          <Route path="settings" element={<SettingsPage />} />
        </Route>
      </Route>

      {/* ---------- ADMIN ---------- */}
      <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
        <Route path="/admin" element={<DashboardLayout />}>
          <Route index element={<AdminHome />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="aboutInstitute" element={<AboutInstitute/>} />
          <Route path="joinRequests" element={<JoinRequestsPage />} />

          {/* 🔥 UNIVERSAL DATA */}
          <Route path="timetable" element={<TimetablePage/>} />
          <Route path="subject" element={<Subject/>} />
          <Route path="students" element={<DataView type="students" />} />
          <Route path="teachers" element={<DataView type="teachers" />} />
          <Route path="courses" element={<DataView type="courses" />} />
          <Route path="requests" element={<DataView type="requests" />} />
          <Route path="attendance" element={<Attendance />} />
          <Route path="assignment" element={<Assignment/>} />
          <Route path="submitAssignment" element={<AssignmentStudent/>} />


          {/* DETAILS */}
          <Route path=":type/:id" element={<DetailsPage />} />

          <Route path="about" element={<AboutAdmin />} />
          <Route path="profile" element={<Profile />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
      </Route>

      {/* ---------- HOD ---------- */}
      <Route element={<ProtectedRoute allowedRoles={["hod"]} />}>
        <Route path="/hod" element={<DashboardLayout />}>
          <Route index element={<HodDashboard />} />
          <Route path="timetable" element={<TimetablePage/>} />
          <Route path="subject" element={<Subject/>} />
          <Route path="students" element={<DataView type="students" />} />
          <Route path="teachers" element={<DataView type="teachers" />} />
          <Route path="joinRequests" element={<JoinRequestsPage />} />
          <Route path=":type/:id" element={<DetailsPage />} />

          <Route path="assignment" element={<Assignment/>} />
          <Route path="submitAssignment" element={<AssignmentStudent/>} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="subjects" element={<Subjects />} />
          <Route path="profile" element={<Profile />} />
          <Route path="attendance" element={<Attendance />} />
        </Route>
      </Route>

      {/* ---------- TEACHER ---------- */}
      <Route element={<ProtectedRoute allowedRoles={["teacher"]} />}>
        <Route path="/teacher" element={<DashboardLayout />}>
          <Route index element={<Teacher />} />
          <Route path="timetable" element={<TimetablePage/>} />
          <Route path="subject" element={<Subject/>} />
          <Route path="profile" element={<Profile />} />
          <Route path="students" element={<DataView type="students" />} />
          <Route path="assignment" element={<Assignment/>} />

          {/* <Route path="JoinRequests" element={<JoinRequests type="requests" />} /> */}
          <Route path="settings" element={<SettingsPage />} />
          <Route path="attendance" element={<Attendance />} />
        </Route>
      </Route>

      {/* ---------- STUDENT ---------- */}
      <Route element={<ProtectedRoute allowedRoles={["student"]} />}>
        <Route path="/student" element={<DashboardLayout />}>
          <Route index element={<Student />} />
          <Route path="timetable" element={<TimetablePage/>} />
          <Route path="subject" element={<Subject/>} />
          <Route path="profile" element={<Profile/>} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="attandence" element={<Subject />} />
          <Route path="grades" element={<Grades />} />



          <Route path="submitAssignment" element={<AssignmentStudent/>} />
        </Route>
      </Route>

      {/* ---------- 404 ---------- */}
      <Route path="*" element={<Navigate to="/" replace />} />

    </Routes>
  );
}

// ---------------- ROOT ----------------
function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <AppRoutes />
      </DataProvider>
    </AuthProvider>
  );
}

export default App;