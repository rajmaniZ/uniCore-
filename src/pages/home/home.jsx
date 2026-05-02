import Hero from '../../component/hero-section/hero'
import Features from "../features/features";
import Testimonials from '../../component/testimonials/testimonials';

import style from './home.module.css'
import { Link } from 'react-router-dom';

function Home(){
    return (
        <div className={style.home}>
            
            <Hero/>
            <Features className={style.feature}/>
            <Testimonials/>
            {}
        </div>
    );
}

export default Home;