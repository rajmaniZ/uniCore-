// import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
// import { AuthProvider, useAuth } from "./pages/Dashboard/context/AuthContext";
// import { DataProvider } from "./pages/Dashboard/context/dataContext";

// // Layouts
// import Layout from "./layout/layout";
// import LoginLayout from "./pages/login/loginLayout";
// import DashboardLayout from "./pages/Dashboard/component/Dashboardlayout/Dashboardlayout";

// // Public Pages
// import Home from "./pages/home/home";
// import Features from "./pages/features/features";
// import About from "./pages/about/about";
// import Contact from "./pages/contact/contact";
// import ComingSoon from "./pages/comingSoon/ComingSoon";

// // Auth Pages
// import Login from "./pages/Dashboard/login";
// import Register from "./pages/login/register/collegeRegister";
// import ForgetPassword from "./pages/login/forget-password";
// import RequestForAccount from "./pages/login/register/requestForAccount";



// // ✅ Universal Pages
// // import StudentsPage from ".";
// import TeachersPage from "./pages/Dashboard/admin/teachers/TeachersPage";
// import Courses from "./pages/Dashboard/admin/courses/courses";
// import DetailsPage from "./pages/Dashboard/common/DetailsPage";


// // ---------------- ADMIN {College admin}----------------
// import AdminHome from "./pages/Dashboard/admin/Home/home";
// import AdminDashboard from "./pages/Dashboard/admin/dashboard/dashboard";
// import AdminProfile from "./pages/Dashboard/admin/profile/profile";

// // ---------------- COMMON / SHARED ----------------
// // import TeachersList from "./pages/Dashboard/superAdmin/TeachersList/TeachersList";
// // import StudentsList from "./pages/Dashboard/superAdmin/studentList/studentList";
// // import JoinRequests from "./pages/Dashboard/component/joinRequests/joinRequests";
// // import Courses from "./pages/Dashboard/admin/courses/courses";

// // ---------------- SUPER ADMIN ----------------
// import SuperAdminDashboard from "./pages/Dashboard/superAdmin/dashboard/dashboard";
// // import AdminProfile from "./pages/Dashboard/admin/profile/profile";
// // import AboutSuperAdmin from "./pages/Dashboard/superAdmin/about/about";
// // import CollegesList from "./pages/Dashboard/superAdmin/colleges/college";
// // import AdminList from "./pages/Dashboard/superAdmin/admins/admin";
// import SuperAdminSettings from "./pages/Dashboard/superAdmin/setting/setting";

// // ---------------- HOD ----------------
// import HodDashboard from "./pages/Dashboard/HoD/dashboard/dashboard";
// import Subjects from "./pages/Dashboard/HoD/subjcts/subjcts";

// // ---------------- OTHERS ----------------
// import Student from "./pages/Dashboard/student/dashboard/dashboard";
// import Teacher from "./pages/Dashboard/teacher/dashboard/dashboard";
// // import Principle from "./pages/Dashboard/Principle/dashboard/dashboard";

// // ✅ PROTECTED ROUTE
// function ProtectedRoute({ allowedRoles }) {
//   const { currentUser, isLoading } = useAuth();

//   if (isLoading) return <div style={{ color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: '#0f0c29' }}>Loading...</div>;
//   if (!currentUser) return <Navigate to="/login" replace />;

//   const role = currentUser.role?.toLowerCase();

//   if (allowedRoles && !allowedRoles.includes(role)) {
//     return <Navigate to={`/${role}`} replace />;
//   }

//   return <Outlet />;
// }

// // ✅ ROUTES
// function AppRoutes() {
//   const { currentUser } = useAuth();

//   const futurePages = [
//     { path: "/career", name: "Future of uniCore" },
//     { path: "/blog", name: "Our Blogs" },
//     { path: "/docs", name: "Documentation" },
//     { path: "/guide", name: "Guide" },
//     { path: "/help", name: "Help" },
//     { path: "/faqs", name: "FAQs" },
//     { path: "/policy", name: "Policy" },
//     { path: "/terms", name: "Terms" },
//   ];

//   return (
//     <Routes>
//       {/* ---------- PUBLIC ---------- */}
//       <Route path="/" element={<Layout />}>
//         <Route
//           index
//           element={
//             currentUser
//               ? <Navigate to={`/${currentUser.role.toLowerCase()}`} replace />
//               : <Home />
//           }
//         />
//         <Route path="about" element={<About />} />
//         <Route path="contact" element={<Contact />} />
//         <Route path="features" element={<Features />} />
//         {futurePages.map((page, i) => (
//           <Route key={i} path={page.path} element={<ComingSoon pageName={page.name} />} />
//         ))}
//       </Route>

//       {/* ---------- AUTH ---------- */}
//       <Route path="/" element={<LoginLayout />}>
//         <Route path="login" element={<Login />} />
//         <Route path="register" element={<Register />} />
//         <Route path="forget-password" element={<ForgetPassword />} />
//         <Route path="request-for-account" element={<RequestForAccount />} />
//       </Route>

//       {/* ---------- SUPER ADMIN ---------- */}
//       <Route element={<ProtectedRoute allowedRoles={["superadmin"]} />}>
//         <Route path="/superadmin" element={<DashboardLayout />}>
//           <Route index element={<SuperAdminDashboard />} />
//           <Route path="dashboard" element={<SuperAdminDashboard />} />
//           <Route path="colleges" element={<CollegesList />} />
//           <Route path="admins" element={<AdminList />} />
//           <Route path="settings" element={<SuperAdminSettings />} />


//           <Route path="students" element={<StudentsPage />} />
//           <Route path="teachers" element={<TeachersPage />} />
//           <Route path="courses" element={<Courses />} />

//           {/* 🔥 UNIVERSAL DETAILS PAGE */}
//           <Route path="students/:id" element={<DetailsPage />} />
//           <Route path="teachers/:id" element={<DetailsPage />} />
//         </Route>
//       </Route>

//       {/* ---------- ADMIN ---------- */}
//       <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
//         <Route path="/admin" element={<DashboardLayout />}>
//           <Route index element={<AdminHome />} />
//           <Route path="dashboard" element={<AdminDashboard />} />
//           <Route path="teachers" element={<TeachersList />} />
//           <Route path="students" element={<StudentsList />} />
//           <Route path="courses" element={<Courses />} />
//           <Route path="join-requests" element={<JoinRequests requests={[]} />} />
//           <Route path="about" element={<about />} />
//           <Route path="profile" element={<AdminProfile />} />
//         </Route>
//       </Route>

//       {/* ---------- HOD ---------- */}
//       <Route element={<ProtectedRoute allowedRoles={["hod"]} />}>
//         <Route path="/hod" element={<DashboardLayout />}>
//           <Route index element={<HodDashboard />} />
//           <Route path="dashboard" element={<HodDashboard />} />
//           <Route path="students" element={<StudentsList />} />
//           <Route path="teachers" element={<TeachersList />} />
//           <Route path="subjects" element={<Subjects />} />
//         </Route>
//       </Route>

//       {/* ---------- TEACHER ---------- */}
//       <Route element={<ProtectedRoute allowedRoles={["teacher"]} />}>
//         <Route path="/teacher" element={<DashboardLayout />}>
//           <Route index element={<Teacher />} />
//           <Route path="dashboard" element={<Teacher />} />
//         </Route>
//       </Route>

//       {/* ---------- STUDENT ---------- */}
//       <Route element={<ProtectedRoute allowedRoles={["student"]} />}>
//         <Route path="/student" element={<DashboardLayout />}>
//           <Route index element={<Student />} />
//           <Route path="dashboard" element={<Student />} />
//         </Route>
//       </Route>

//       {/* ---------- PRINCIPAL ---------- */}
//       {/* <Route element={<ProtectedRoute allowedRoles={["principal"]} />}>
//         <Route path="/principal" element={<DashboardLayout />}>
//           <Route index element={<Principle />} />
//           <Route path="dashboard" element={<Principle />} />
//         </Route>
//       </Route> */}

//       {/* ---------- 404 ---------- */}
//       <Route path="*" element={<Navigate to="/" replace />} />
//     </Routes>
//   );
// }

// // ✅ ROOT — BrowserRouter wraps everything here
// function App() {
//   return (
//     // <BrowserRouter>
//       <AuthProvider>
//         <DataProvider>
//           <AppRoutes />
//         </DataProvider>
//       </AuthProvider>
//     // </BrowserRouter>
//   );
// }

// export default App;



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
import ComingSoon from "./pages/comingSoon/ComingSoon";

// Auth
import Login from "./pages/Dashboard/login";
import Register from "./pages/login/register/collegeRegister";
import ForgetPassword from "./pages/login/forget-password";
import RequestForAccount from "./pages/login/register/requestForAccount";

// ✅ UNIVERSAL SYSTEM
import DataView from "./pages/Dashboard/component/dataView/DataView";
import DetailsPage from "./pages/Dashboard/component/Details/Details";
import JoinRequestsPage from './pages/Dashboard/component/joinRequests/joinRequestPage'
import Profile from "./pages/Dashboard/component/profile/profile";
import SettingsPage from "./pages/Dashboard/component/setting/settingsPage";
import TimetablePage from "./pages/Dashboard/component/timetable/timetablePage";


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
      </Route>

      {/* ---------- AUTH ---------- */}
      <Route path="/" element={<LoginLayout />}>
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="forget-password" element={<ForgetPassword />} />
        <Route path="request-for-account" element={<RequestForAccount />} />
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

          <Route path="students" element={<DataView type="students" />} />
          <Route path="teachers" element={<DataView type="teachers" />} />
          <Route path="courses" element={<DataView type="courses" />} />
          <Route path="requests" element={<DataView type="requests" />} />



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

          <Route path="students" element={<DataView type="students" />} />
          <Route path="teachers" element={<DataView type="teachers" />} />
          <Route path="joinRequests" element={<JoinRequestsPage />} />
          <Route path=":type/:id" element={<DetailsPage />} />

          <Route path="settings" element={<SettingsPage />} />
          <Route path="subjects" element={<Subjects />} />
          <Route path="profile" element={<Profile />} />
        </Route>
      </Route>

      {/* ---------- TEACHER ---------- */}
      <Route element={<ProtectedRoute allowedRoles={["teacher"]} />}>
        <Route path="/teacher" element={<DashboardLayout />}>
          <Route index element={<Teacher />} />
          <Route path="timetable" element={<TimetablePage/>} />

          <Route path="profile" element={<Profile />} />
          {/* <Route path="JoinRequests" element={<JoinRequests type="requests" />} /> */}
          <Route path="settings" element={<SettingsPage />} />
        </Route>
      </Route>

      {/* ---------- STUDENT ---------- */}
      <Route element={<ProtectedRoute allowedRoles={["student"]} />}>
        <Route path="/student" element={<DashboardLayout />}>
          <Route index element={<Student />} />
          <Route path="timetable" element={<TimetablePage/>} />

          <Route path="profile" element={<Profile/>} />
          <Route path="settings" element={<SettingsPage />} />
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