import {Routes, Route} from 'react-router-dom';

import Layout from './layout/layout';
import Home from './pages/home/home';
import Features from './pages/features/features';
import About from './pages/about/about';
import Contact from './pages/contact/contact';

import Login from './pages/login/login';
import Register from './pages/login/register';
import ForgetPassword from './pages/login/forget-password';


// import Home from './pages/home/home';

function App(){
  return (
    <>
      <Routes>
        <Route path='/' element={<Layout/>}>
          <Route path='/' element={<Home/>}/>
          <Route path='/about' element={<About/>}/>
          <Route path='/contact' element={<Contact/>}/>
          <Route path='/features' element={<Features/>}/>
        </Route>

        <Route path='/login' element={<Login/>}/>
        <Route path='/register' element={<Register/>}/>
        <Route path='/forget-password' element={<ForgetPassword/>}/>
        
      </Routes>
    </>
  )

}

export default App;