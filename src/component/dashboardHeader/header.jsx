import style from './header.module.css';
import {Link} from 'react-router-dom';
// import {FaSearch} from 'react-';

function DashboardHeader(){
  return (
    <>
      <nav>
        <ul className={style.navMenu}>
          <li><input type="text"placeholder='Search'></input></li>
          <li>
           <a href="/HomePage" >home</a>
            </li>
          <li>Notification</li>
          <li><Link to="/Principle" >profile</Link></li>
          
        </ul>
      </nav>
    </>
  );

}

export default DashboardHeader;
