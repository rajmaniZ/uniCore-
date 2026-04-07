import {Link} from 'react-router-dom';

function ShowDashboard(){
    return (
            <div >
                <li><Link to='/Admin' >admin</Link></li>
                
                <li><Link to='/Teacher'>Teacher</Link></li>
                
                <li><Link to='/Student'>Student</Link></li>
                
                <li><Link to='/HomePage'>principle</Link></li>
            </div>
    );
}
export default ShowDashboard;