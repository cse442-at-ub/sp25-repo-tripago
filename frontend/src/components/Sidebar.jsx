import { useNavigate, useLocation } from 'react-router-dom';
import '../styles/Sidebar.css';
import {
  FaUser,
  FaPlaneDeparture,
  FaPlus,
  FaUsers,
  FaCog,
} from 'react-icons/fa';
import PropTypes from 'prop-types';

const Sidebar = ({ username }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <p>
          Hello, <span className="username">{username}</span>.
        </p>
      </div>

      <div className="sidebar-menu">
        <button 
          className={`sidebar-item ${currentPath === '/user-profile' && 'sidebar-item-active'}`} 
          onClick={() => navigate('/user-profile')}
        >
          <FaUser className="sidebar-icon" />
          <span>Profile</span>
        </button>

        <button 
          className={`sidebar-item ${currentPath === '/all-trips' && 'sidebar-item-active'}`} 
          onClick={() => navigate('/all-trips')}
        >
          <FaPlaneDeparture className="sidebar-icon" />
          <span>All trips</span>
        </button>

        <button 
          className={`sidebar-item ${currentPath === '/profile' && 'sidebar-item-active'}`} 
          onClick={() => navigate('/profile')}
        >
          <FaPlus className="sidebar-icon" />
          <span>New trip</span>
        </button>

        <button 
          className={`sidebar-item ${currentPath === '/community' && 'sidebar-item-active'}`} 
          onClick={() => navigate('/community')}
        >
          <FaUsers className="sidebar-icon" />
          <span>Community</span>
        </button>

        <button 
          className={`sidebar-item ${currentPath.startsWith('/settings') && 'sidebar-item-active'}`} 
          onClick={() => navigate('/settings')}
        >
          <FaCog className="sidebar-icon" />
          <span>Settings</span>
        </button>
      </div>
    </div>
  );
};

Sidebar.propTypes = {
  username: PropTypes.string.isRequired,
};

export default Sidebar;
