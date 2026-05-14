import React, { useEffect, useRef, useState } from "react";
import { useOutletContext,useNavigate } from "react-router-dom";
import "../css/Project.css";
import { deleteProjectAPI } from "../js/Project";


const Project = () => {

  const user = JSON.parse(localStorage.getItem("user"));
   const[ showUDModel,setShowUDModel]=useState(null);
  const [showModel, setShowModel] = useState(false);
  const [projects, setProjects] = useState([]);
  const [form, setForm] = useState({
    name: "",
    status: "",
    tasks: "",
    color: "",
  });
  const {search} = useOutletContext();  
  const [mode,setMode]=useState('');
  const [editId, setEditId] = useState(null);
  const dropdownrRef= useRef(null);

  const openEdit=(project)=>{
    setMode('edit');
      setEditId(project.id);

  setForm({
    name: project.name,
    status: project.status,
    tasks: project.tasks,
    color: project.color,
  });

  setShowModel(true);
};
  

 const navigate= useNavigate();

const deleteProject = async(id)=>{

const success =await deleteProjectAPI(id);

if(success){
  setProjects((prev)=> prev.filter((p)=>p.id !==id))
}


}


  useEffect(() => {

    const handleClickOutside =(event)=>{
      if(dropdownrRef.current && !dropdownrRef.current.contains(event.target)){
        setShowUDModel(null);
      }

    }
      document.addEventListener("click", handleClickOutside);

    const loadProjects = async () => {
      try {
        const res = await fetch("http://localhost:3000/projects");
        const data = await res.json();
        const visible_Project= data.filter((d)=>
          
          
         d.participant_Email?. includes(user.email))
              
        setProjects(visible_Project);
        
      } catch (error) {
        console.error("Failed to load projects:", error);
      }
    };

    loadProjects();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const addProject = async () => {

    if(mode === "add"){ 
       const newProject = {
      id: Date.now(),
      name: form.name,
      status: form.status,
      tasks: Number(form.tasks),
      color: form.color,  
      participant_Email: user.email
    };

    const res = await fetch("http://localhost:3000/projects", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newProject),
    });

    const savedProject = await res.json();
    setProjects([...projects, savedProject]);
    setForm({
      name: "",
      status: "",
      tasks: "",
      color: "",
    });
   
    setShowModel(false);

    }else if(mode === "edit"){

        const res = await fetch(`http://localhost:3000/projects/${editId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    const updated = await res.json();

    setProjects((prev) =>
      prev.map((p) => (p.id === editId ? updated : p))
    );
  }

  setShowModel(false);

   
  };

  // search project

  const normalizedSearch = search.trim().toLowerCase();
  const filterProjects = projects.filter((project) =>
    project.name.toLowerCase().includes(normalizedSearch) 

  );
  const displayProjects = normalizedSearch ? filterProjects : projects;

  return (
    <>
      <div className="project-page">
        <header className="project-header">
          <div>
            <h1>Projects</h1>
            <p>Manage and track your team's active work.</p>
          </div>

        { user.role == "admin" && (  <button className="add-project-btn" onClick={()=>{ setShowModel(true); setMode('add')}}>
            + New Project
          </button>
)  }
        
        </header>

        <div className="project-grid">
          { displayProjects.map((project) => (
            <div key={project.id} className="project-card">
              <div className="card-top">
                <div
                  className="status-badge"
                  style={{
                    backgroundColor: `${project.color}20`,
                    color: project.color,
                  }}
                >
                  {project.status}
                </div>
                <button className="options-btn" 
                  onClick={(e)=>{
                    
                    e.stopPropagation();
                    setShowUDModel((prev)=> prev === project.id ? null : project.id ); 
                  
                    console.log(showUDModel);
                                    
                  }}

                >•••</button>




                {showUDModel === project.id &&  (


  <div className="project-dropdown-menu">

        
       <div ref={dropdownrRef}
      className="project-dropdown-item"
      onClick={(e)=> {  
          navigate(`/dashboard/project/${project.id}`);
      }
    
      }
      
    
    >
    View
    </div>

      
    { user.role == "admin" && ( 
        <>
     <div ref={dropdownrRef}
      className="project-dropdown-item"
      onClick={(e) => {
        e.stopPropagation();
        openEdit(project);
        setShowUDModel(null);
      }}
    >
      Edit
    </div>
      

         <div ref={dropdownrRef}
      className="project-dropdown-item delete"
      onClick={(e) => {
        e.stopPropagation();
        deleteProject(project.id);
        setShowUDModel(null);
      }}
    >
      Delete
    </div>


      </>

    




)  }


 
  </div>
)} 
                
              
              </div>
              <h3 className="project-name">{project.name}</h3>
              <div className="project-meta">
                <span>📋 {project.tasks} Tasks</span>
                <div className="avatar-group">
                  <div className="mini-avatar"></div>
                  <div className="mini-avatar"></div>
                </div>
              </div>
              <div className="progress-bar-bg">
                <div
                  className="progress-bar-fill"
                  style={{ width: "65%", backgroundColor: project.color }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {showModel && (
        <div className="Model-overlay">
          <div className="model-box" onClick={(e) => e.stopPropagation()}>
        <h2>{mode === "add" ? "Add Project" : "Edit Project"}</h2>
            <input
              type="text"
              placeholder="Project Name"
              name="name"
              value={form.name}
              onChange={handleChange}
            />
            <select name="status" value={form.status} onChange={handleChange}>
              <option value="">Select Status</option>
              <option value="In Progress">In Progress</option>
              <option value="Review">Review</option>
              <option value="Planning">Planning</option>
              <option value="Completed">Completed</option>
            </select>

            <input
              type="number"
              name="tasks"
              placeholder="Tasks"
              value={form.tasks}
              onChange={handleChange}
            />
            <input
              type="color"
              name="color"
              value={form.color}
              onChange={handleChange}
            />

            {mode === "add" &&  (<button  onClick={addProject}>Create Project</button>)}
            {mode === "edit" &&  ( <button onClick={addProject}>Update Project</button>)}

         
            <button onClick={() => {setShowModel(false),   setForm({
      name: "",
      status: "",
      tasks: "",
      color: "",
    });   }}>Cancel</button>
          </div>
        </div>
      )}
    </>
  );
}

export default Project;
