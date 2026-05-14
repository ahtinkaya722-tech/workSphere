import {Routes,Route} from "react-router-dom";
import LoginPage from './features/auth/LoginPage';
import './App.css';
import ProtectedRoute from './features/auth/ProtectedRoute';
import Dashboard from './features/dashboard/Dashboard';
import Project from './features/project/Project';
import DashboardHome from './features/dashboard/DashboardHome';
import Setting from './features/setting/Setting';
import Tasks from './features/tasks/Tasks';
import Project_Detail from "./features/projectdetail/Project_Detail";
import Members_And_Tasks from "./features/tasks/Members_And_Tasks";




export default function App() {


  return (
    <>
     <Routes>
        <Route path='/'element={ <LoginPage/>} ></Route>

      
  
    
      
      <Route path='/dashboard' element={     <ProtectedRoute> <Dashboard/> </ProtectedRoute>} > 
        <Route index element={<DashboardHome/>}></Route>
        <Route path='project' element={ <Project/>}/>
          <Route path="project/:id" element={<Project_Detail/>} ></Route>
        <Route path='settings' element={ <Setting/>}/>
        <Route path="member_And_Tasks" element={ <Members_And_Tasks/>}></Route>
        <Route path='tasks' element={ <Tasks/>}/>
       
       </Route>

    

     </Routes>
    </>
     
  )
}

