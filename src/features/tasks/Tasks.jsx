import React, { useEffect, useState } from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import "../css/Tasks.css";

const Tasks = () => {

  const user = JSON.parse(localStorage.getItem("user"));
  const [showModel, setModel] = useState(false);
  const [editTask, setEditTask] = useState(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [tasks, setProjects] = useState([]);
  const [form, setForm] = useState({
    title: "",
    priority: "",
    dueDate: "",
    desc:""
  });

  const clearForm = () => {
    setForm({
      title: "",
      dueDate: "",
      priority: "",
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const openEdit = (task) => {
    setEditTask(task.id);
    setForm({
      title: task.title,
      priority: task.priority,
      dueDate: task.dueDate,
      desc:task.desc
    });
    setIsEditOpen(true);
  };

  const updateTask = async () => {
    if (!editTask) return;

    const updatedTask = {
      title: form.title,
      priority: form.priority,
      dueDate: form.dueDate,
      desc:form.desc
    };

    const current_Task = tasks.find((t)=> t.id === editTask );
      const final_Task = {...current_Task,...updatedTask};

    try {
      const res = await fetch(`http://localhost:4000/tasks/${editTask}`, {
        method: 'PUT',
        headers: {
          "Content-Type": "application/json",
        },
          body: JSON.stringify(
       final_Task
    ),
      });

      if (!res.ok) { 
        throw new Error(`Failed to update task: ${res.status}`);
      }

      const savedTask = await res.json();
      
      // UI Update
      setProjects((prev)=> prev.map((task)=>task.id === editTask ? savedTask :task));


      setIsEditOpen(false);
      setEditTask(null);
      clearForm();
    } catch (error) {
      console.error("Update failed:", error);
    }
  };

  // const normalizeSearch = search.trim().toLowerCase();
  // const filterTasks = tasks.filter((task) =>
  //   task.title.toLowerCase().includes(normalizeSearch)
  // );

  const deleteTask = async (task_id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete");
    if (!confirmDelete) return;

    try {
      await fetch(`http://localhost:4000/tasks/${task_id.id}`, {
        method: 'DELETE',
      });

      setProjects((prev) => prev.filter((task) => task.id !== task_id.id));
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const res = await fetch("http://localhost:4000/tasks");
        const data = await res.json();
        const member_task= data.filter((d)=> d.memberId === Number(user.id) );
        setProjects(member_task);
         
        console.log(member_task);

       if (member_task.length>0) {
        console.log("this is working");
        
          setProjects( member_task);
       } else {
         console.log("this is not working");
       }
      
        
        
      } catch (error) {
        console.error("Failed to load tasks:", error);
      }
    };

    loadProjects();
  }, [user.id]);

  const addTask = async () => {
    const newTask = {
      id: Date.now(),
      title: form.title,
      memberId: Number(user.id),
         desc:form.desc,      dueDate: form.dueDate,
      priority: form.priority
   
    };

    try {
      const res = await fetch('http://localhost:4000/tasks', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newTask),
      });

      if (!res.ok) {
        throw new Error(`Failed to create task: ${res.status}`);
      }

      const savedTask = await res.json();
      setProjects([...tasks, savedTask]);
      clearForm();
      setModel(false);
    } catch (error) {
      console.error("Create task failed:", error);
    }
  };

  return (
    <div className="tasks-page">
      <header className="tasks-header">
        <div>
          <h1>Tasks</h1>
          <p>Track your personal and team action items.</p>
        </div>

         { user.role == "admin" && (  <button className="add-task-btn" onClick={() => setModel(true)}>
          + Add Task
        </button>
)  }

       
      </header>

<div className="daily-schedule-container">
  {/* Repeat this section for each day (Monday, Tuesday, etc.) */}
  <div className="day-column">
    <h3 className="day-label">Monday</h3>
    <div className="tasks-grid">
      {tasks.map((task) => (
        <div key={task.id} className={`task-square-box ${task.priority.toLowerCase()}`}>
          <div className="square-header">

            <div className={`priority-dot ${task.priority.toLowerCase()}`}> </div>
          </div>
          
          <div className="square-content">
            <span className="task-title">{`${task.dueDate} : ( ${task.title} )`} </span>
            <p className="task-desc-short">{task.desc || "No details"}</p>
          </div>

          <div className="square-actions">
            <button onClick={() => openEdit(task)} className="icon-btn">✎</button>
            <button onClick={() => deleteTask(task)} className="icon-btn delete">✕</button>
          </div>
        </div>
      ))}
    </div>
  </div>
</div>
       {showModel && (
        <div className='model-overlay' onClick={() => setModel(false)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <h2>Add Task</h2>
            <input
              type="text"
              name='title'
              placeholder='add title name'
              value={form.title}
              onChange={handleChange}
            />

            <input
              type="date"
              name="dueDate"
              value={form.dueDate}
              onChange={handleChange}
            />

            <select
              name="priority"
              value={form.priority}
              onChange={handleChange}
            >
             
              <option value="Medium">Moring</option>
              <option value="High">Night</option>
           
            </select>

            <textarea 
         name="desc" 
          value={form.desc} 
        onChange={handleChange} 
       placeholder="Add a detailed description..."
          className="modal-textarea"
></textarea>

            <button onClick={addTask}>Create Task</button>
            <button onClick={() => setModel(false)}>Cancel</button>
          </div>
        </div>
      )}

      {isEditOpen && (
        <div className="edit-modal-overlay" onClick={() => setIsEditOpen(false)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <h2>Edit Task</h2>

            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Title"
            />

            <select
              name="priority"
              value={form.priority}
              onChange={handleChange}
            >
              <option value="Medium">Morning</option>
              <option value="High">Night</option>
            
            </select>

            <input
              type="date"
              name="dueDate"
              value={form.dueDate}
              onChange={handleChange}
            />
          
<textarea 
  name="desc" 
  value={form.desc} 
  onChange={handleChange} 
  placeholder="Add a detailed description..."
  className="modal-textarea"
></textarea>

            <button onClick={updateTask}>Update</button>
            <button onClick={() => setIsEditOpen(false)}>Cancel</button>
          </div>
        </div>
      )} 
      
    </div>
  );
};

export default Tasks;
