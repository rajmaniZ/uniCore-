import Logo from "./../logo/logo"
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import styles from "./navbar.module.css";
import { getInstitutes } from "../../api/instituteApi";

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const isHome = location.pathname === "/";

  const [institutes, setInstitutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false); 

  useEffect(() => {
    getInstitutes()
      .then((data) => setInstitutes(data || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleInstituteClick = (id) => {
    navigate(`/institute/${id}`);
    setOpen(false);
    setMenuOpen(false); 
  };

  return (
    <>
      <nav className={`${styles.nav} ${isHome ? styles.homeNav : ""}`}>
        
        {}
        <NavLink to="/">
        <Logo className={styles.logo}/>
          {}
        </NavLink>

        {}
        <div
          className={styles.hamburger}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰
        </div>

        {}
        <div
          className={`${styles.listOfNavMenu} ${
            menuOpen ? styles.mobileMenu : ""
          }`}
        >
          <NavLink to="/" end className={styles.navMenu}>
            Home
          </NavLink>

          <NavLink to="/features" className={styles.features}>
            Features
          </NavLink>

          <NavLink to="/about" className={styles.about}>
            About
          </NavLink>

          {}
          <div
            className={styles.dropdown}
            onMouseEnter={() => setOpen(true)}
            onMouseLeave={() => setOpen(false)}
          >
            <span className={styles.dropdownTitle}>Institutes</span>

            {open && (
              <div className={styles.dropdownMenu}>
                {loading ? (
                  <div className={styles.dropdownItem}>Loading...</div>
                ) : institutes.length === 0 ? (
                  <div className={styles.dropdownItem}>No Institutes</div>
                ) : (
                  institutes.map((inst) => (
                    <div
                      key={inst._id}
                      className={styles.dropdownItem}
                      onClick={() => handleInstituteClick(inst._id)}
                    >
                      {inst.name}
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          <NavLink to="/contact" className={styles.contact}>
            Contact
          </NavLink>

          <div className={styles.loginAndRegister}>
            <NavLink to="/login">Login</NavLink>
            <NavLink to="/register">Sign Up</NavLink>
          </div>
        </div>
      </nav>

      <hr className={styles.hrFaded} />
    </>
  );
}

export default Navbar;