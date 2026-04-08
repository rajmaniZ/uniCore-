import IntroSection from "../component/introSection/intro";
import AcademicDetails from "../component/academicDetails/academicDetails";


import PersonalInfo from "../component/personalInfo/personalInfo";
import styles from './Student.module.css';
function Student(){
    return(
        <div className={StyleSheet.div}>
        <IntroSection/>
        <PersonalInfo/>
        <AcademicDetails/>
        </div>
    )
}

export default Student;