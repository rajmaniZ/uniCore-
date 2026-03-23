import {Routes, Route} from 'react-router-dom';

import Layout from './layout/layout';
import Home from './pages/home/home';
import Features from './pages/features/features';
import About from './pages/about/about';
import Contact from './pages/contact/contact';

import Login from './pages/login/login';
import Register from './pages/login/register';
import ForgetPassword from './pages/login/forget-password';
import ComingSoon from './pages/comingSoon/ComingSoon';


// import Home from './pages/home/home';

function App(){
  const futurePages=[
        {
            path:"/career",
            name:'Future of uniCore'
        },
        {
            path:'/blog',
            name:'Our Blogs'
        },
        {
            path:'/docs',
            name:'Documantation'
        },
        {
            path:'/guide',
            name:'How to use our features'
        },
        {
            path:'/help',
            name:'How we helped you!'
        },
        {
            path:'/faqs',
            name:'FAQs'
        },
        {
            path:'/policy',
            name:'privacy Guidelines'
        },
        {
            path:'/terms',
            name:"Terms of Service"
        }
    ];

  return (
    <>
      <Routes>
          <Route path='/' element={<Layout/>}>
          <Route path='/' element={<Home/>}/>
          <Route path='/about' element={<About/>}/>
          <Route path='/contact' element={<Contact/>}/>
          <Route path='/features' element={<Features/>}/>

          {/* upcoming pages */}
          {futurePages.map((page, index)=>(
          <Route 
            key={index}
            path={page.path}
            element={<ComingSoon pageName={page.name}/>}
          />
        ))}


        </Route>
        <Route path='/login' element={<Login/>}/>
        <Route path='/register' element={<Register/>}/>
        <Route path='/forget-password' element={<ForgetPassword/>}/>
        
      </Routes>
    </>
  )

}

export default App;