import { Routes, Route } from 'react-router-dom';

import Layout from './layout/layout';
import Home from './pages/home/home';
import Features from './pages/features/features';
import About from './pages/about/about';
import Contact from './pages/contact/contact';

import Login from './pages/login/login';
import Register from './pages/login/register/collegeRegister';
import ForgetPassword from './pages/login/forget-password';
import RequestForAccount from './pages/login/register/requestForAccount'

import HomePage from './pages/Homepageforcollege/homePage'


import ComingSoon from './pages/comingSoon/ComingSoon';
// Dashboard
import Admin from "./pages/Dashboard/AdminDashboard/Admin";
import Student from "./pages/Dashboard/StudentDashboard/Student";
import Teacher from "./pages/Dashboard/TeacherDashboard/Teacher";
import Principle from "./pages/Dashboard/PrincipleDashboard/Principle";


import LoginLayout from './pages/login/loginLayout';
import AboutCollegeForm from './pages/Dashboard/PrincipleDashboard/component/aboutCollege/aboutCollege';
import AboutCollege from './pages/Dashboard/PrincipleDashboard/pages/about';
// import Home from './pages/home/home';

function App() {
  const futurePages = [
    {
      path: "/career",
      name: 'Future of uniCore'
    },
    {
      path: '/blog',
      name: 'Our Blogs'
    },
    {
      path: '/docs',
      name: 'Documantation'
    },
    {
      path: '/guide',
      name: 'How to use our features'
    },
    {
      path: '/help',
      name: 'How we helped you!'
    },
    {
      path: '/faqs',
      name: 'FAQs'
    },
    {
      path: '/policy',
      name: 'privacy Guidelines'
    },
    {
      path: '/terms',
      name: "Terms of Service"
    }
  ];

  return (
    <>
      <Routes>
        <Route path='/' element={<Layout />}>
          <Route path='/' element={<Home />} />
          <Route path='/about' element={<About />} />
          <Route path='/contact' element={<Contact />} />
          <Route path='/features' element={<Features />} />

          {/* upcoming pages */}
          {futurePages.map((page, index) => (
            <Route
              key={index}
              path={page.path}
              element={<ComingSoon pageName={page.name} />}
            />
          ))}


        </Route>


        <Route path="/" element={<LoginLayout/>}>
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path='/forget-password' element={<ForgetPassword />} />
          <Route path='/RequestForAccount' element={<RequestForAccount/>}/>
          
        </Route>
        <Route path='/Admin' element={<Admin />} />
        <Route path='/Principle' element={<Principle />} />
         <Route path='/AboutCollegeForm' element={<AboutCollegeForm/>}/>
         <Route path='/AboutCollege' element={<AboutCollege/>}/>

        <Route path='/HomePage' element={<HomePage/>}/>
        <Route path='/Teacher' element={<Teacher />} />
        <Route path='/Student' element={<Student />} />

      </Routes>
    </>
  )

}

export default App;