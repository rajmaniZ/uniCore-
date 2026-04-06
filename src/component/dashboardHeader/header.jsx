import style from './header.module.css';
import {Link} from 'react-router-dom'

function DashboardHeader(){
  return (
    <>
      <nav>
        <div className={style.navDiv} >
        
          <img src="/uniCore.png" alt="" />
        </div>
        <ul className={style.navMenu}>
          <li><img className={style.searchImg}src="OIP.jpg" alt="" /></li>
          <li>
           <a href="/HomePage" >home</a>
            </li>
          <li>Profile</li>
          <li>about</li>
          <li>help</li>
          <li><Link path='/HomePage'>logout </Link></li>
          {/* <li>home</li> */}
        </ul>
      </nav>
    </>
  );

}

export default DashboardHeader;
