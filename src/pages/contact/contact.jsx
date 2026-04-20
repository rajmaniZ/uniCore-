import style from './contact.module.css';


function Contact(){
    return(
        <>
            <div className={style.contactpage}>
                <h1>Contact Us</h1>
                <p className="subtitle">
                    Have question? We'd love to hear from you!
                </p>
                <div className={style["contact-card"]}>
                    <form>
                        <input type="text" placeholder="Your Name">
                        </input>
                        <input type="email" placeholder="Your-email"></input>
                        <textarea placeholder="Your message" row="10"></textarea>
                        <button type="submit">Send Message</button>
                        

                    </form>
                </div>
                <div className={style.contactdetails}>
                    <p>Email:support@uniCore.com</p>
                    <p>Phone:+91 1234456789</p>
                </div>
        
            </div>

        </>
    );

}

export default Contact;