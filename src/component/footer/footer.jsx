import {FaHome} from "react-icons/fa"

import {Link } from 'react-router-dom';

import SocialContact from '../contect card/contact-card';
import styles from './footer.module.css';

function Footer(){
    return ( 
        <>
            <svg width="0" height="0">
                <defs>
                    <linearGradient id="uniGradient" x1="60%" y1="90%" x2="0%" y2="30%">
                    <stop offset="10%" stopColor="#ff6ec4" />
                    <stop offset="10%" stopColor="#ff9a44" />
                    <stop offset="30%" stopColor="#f9c449" />
                    <stop offset="60%" stopColor="#4cd964" />
                    <stop offset="10%" stopColor="#5ac8fa" />
                    <stop offset="90%" stopColor="#5856d6" />
                    </linearGradient>
                </defs>
            </svg>
        
            <div className={styles.footer}>
                <hr className={styles.hrFaded}/>
                <div className={styles.logoDiv}>
                    <img src="/logo.png" alt="Logo" className={styles.logo} />
                    <h1>uniCore</h1>
                </div>
                <hr className={styles.hrFaded}/>
                <div className={styles.infoDiv}>
                    <div className={styles.companyDiv}>
                        <h1>Company</h1>
                        <ul>
                            <Link to="/about"><li>About us</li></Link>
                            
                            <Link to="/career"><li>Careers</li></Link>
                            
                            <Link to="/blog"><li>Blog</li></Link>
                            
                            <Link to="/contact" ><li>Contact Us</li></Link>
                        </ul>
                    </div>
                    
                    <div className={styles.resourcesDiv}>
                        <h1>Resources</h1>
                        <ul>
                            <Link to="/document"><li>Documentation</li></Link>
                            
                            <Link to="/guide"><li>Guides</li></Link>
                            
                            <Link to="/helpCenter"><li>Help Center</li></Link>
                        </ul>
                    </div>
                    <div className={styles.supportDiv}>
                        <h1>Support</h1>
                        <ul>
                            <Link to="/faqs"><li>FAQs</li></Link>
                            
                            <Link to="/privacyPolicy"><li>Privacy policy</li></Link>
                            
                            <Link to="/termsofService"><li>Terms of Service</li></Link>
                        </ul>
                    </div>
                    <div className={styles.subscribe}>
                        <h1>Subscribe to newsletter</h1>
                        <ul>
                            <li>Get the latest news and updates in to your inbox</li>
                            <li>
                                <div className={styles.subscribeInput}>
                                    <input type="email" placeholder="Enter your email" />
                                    <button sendto="mr.raj725sharma@gmail.com">Subscribe</button>
                                </div>
                            </li>
                        </ul>
                    </div>
                    <div><SocialContact/></div>
                </div>
                
                <div className={styles.copyright}>
                    <p>&copy; uniCore 2026. All rights reserved
                        
                    </p>
                    <Link to="/">
                            <svg width="40" height="40" viewBox="0 0 24 24" className="icons">
                                <path
                                fill="url(#uniGradient)"
                                d="M12 3l9 8h-3v9h-5v-6H11v6H6v-9H3l9-8z"
                                />
                            </svg>
                    </Link>
                </div>
            </div>
        
        </>
    );
}

export default Footer;