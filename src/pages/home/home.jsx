import Hero from '../../component/hero-section/hero'
import Features from "../features/features";
import Testimonials from '../../component/testimonials/testimonials';

import style from './home.module.css'
import { Link } from 'react-router-dom';

// import ShowDashboard from './../../component/linkDashboard'
function Home(){
    return (
        <div className={style.home}>
            
            <Hero/>
            <Features className={style.feature}/>
            <Testimonials/>
            {/* <ShowDashboard/> */}
        </div>
    );
}

export default Home;