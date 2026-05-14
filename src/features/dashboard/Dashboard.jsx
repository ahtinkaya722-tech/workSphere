import React, { useState } from 'react';
import '../css/Dashboard.css';
import {Outlet,useNavigate} from "react-router-dom"



const Dashboard = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const [search,setSearch]=useState('');


const [activeItem,setActiveItem]=useState('dashboard');

const navigate = useNavigate();
const logout = ()=>{

  const isConfirmed = window.confirm("Are you sure you want to logout?");

  if(isConfirmed){
localStorage.removeItem("user");
  navigate("/");
  }

  
}

const handleNavClick = (item,path)=>{
setActiveItem(item);
navigate(path);

}

  return (
    <div className="dashboard-container">
      {/* SIDEBAR */}
  <aside className="sidebar">
      <div className="brand">
        <div className="dot"></div>
        <span>TeamSpace</span>
      </div>
      <nav className="menu">
        <div 
          className={`menu-item ${activeItem === 'dashboard' ? 'active' : ''}`} 
          onClick={() => handleNavClick('dashboard', '/dashboard')}
        >
          Dashboard
        </div>
        <div 
          className={`menu-item ${activeItem === 'project' ? 'active' : ''}`} 
          onClick={() => handleNavClick('project', 'project')}
        >
          Projects
        </div>
        <div 
          className={`menu-item ${activeItem === 'tasks' ? 'active' : ''}`} 
          onClick={() => handleNavClick('tasks', 'tasks')}
        >
          Tasks
        </div>
          <div 
          className={`menu-item ${activeItem === 'member_And_Tasks' ? 'active' : ''}`} 
          onClick={() => handleNavClick('member_And_Tasks', 'member_And_Tasks')}
        >
          Member And Task
        </div>
        <div 
          className={`menu-item ${activeItem === 'settings' ? 'active' : ''}`} 
          onClick={() => handleNavClick('settings', 'settings')}
        >
          Settings
        </div>
        <div className="menu-item" onClick={() => logout()}>Logout</div>
      </nav>
    </aside>

      {/* RIGHT SIDE (Topbar + Content) */}
      <div className="main-wrapper">
        <header className="topbar">
          <div className="search-bar">
            <input type="text"  value={search} onChange={(e)=>setSearch(e.target.value) } placeholder="Search workspace..." />
          </div>
          <div className="user-actions">
            <button className="btn-notif">🔔</button>
           
              {user.avatar ? (<img src={user.avatar} className = "avatar"/>) :(  <div className="avatar-large">AK</div> )}
          </div>
        </header>

        <main className="content">
          <div className="content-inner">
          
                <Outlet  context={{search}}/>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
