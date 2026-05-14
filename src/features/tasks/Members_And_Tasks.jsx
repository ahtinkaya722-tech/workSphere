import React, { useEffect, useState } from 'react'
import "../css/Member_And_Task.css";
import {useOutletContext} from "react-router-dom";

const Members_And_Tasks = () => {
    const [members,setMembers]=useState([]);
    const [error,setError]=useState("");
    const [selected,setSelected]=useState('');
      const [tasks,setTasks]=useState([]);

      const {search}= useOutletContext();


    useEffect(()=>{
        const fetchData =async()=>{
            try {
                const ress = await fetch("http://localhost:4000/tasks");
                const res = await fetch("http://localhost:5000/members");
                if (!res.ok || !ress.ok) {
                    throw new Error("Failed to load members");
                }

                const data = await res.json();
                const second_data = await ress.json();
                setMembers(data);
                setTasks(second_data);
            } catch (err) {
                setError(err.message);
            }
        }
        fetchData();

    },[]) 

 

const member_Task = tasks.filter((t)=> 
    Number( t.memberId)
    
  === Number(selected?.id) );
 
   const normalizedSearch = search.trim().toLowerCase();
  const filterMember = members.filter((m) =>
    m.nickname.toLowerCase().includes(normalizedSearch) 

  );
  const displayMembers = normalizedSearch ? filterMember : members;

  const hod = displayMembers?.filter((m) => m.role === "hod") || [];
  const media = displayMembers?.filter((m) => m.role === "media") || [];
const sensei = displayMembers?.filter((m) => m.role === "sensei") || [];
const admin = displayMembers?.filter((m) => m.role === "admin") || [];
const cs = displayMembers?.filter((m) => m.role === "cs") || [];

  return (
    <>
     <div className="dashboard">
      {error && <p>{error}</p>}
    <div className="left-panel">  
      <h3>{hod.length === 0 ? (""):"HOD"}</h3>
      {hod.map((m) => <p key={m.id} className={`member-item ${selected?.id === m.id?"active" :""}`}  onClick={()=>setSelected(m)} >{m.nickname}</p>)}

        <h3>{media.length === 0 ? "":"Media"}</h3>
      {media.map((m) =><p key={m.id} className={`member-item ${selected?.id === m.id?"active" :""}`}  onClick={()=>setSelected(m)} >{m.nickname}</p>)}

       <h3>{sensei.length === 0 ? "":"Sensei"}</h3>
      {sensei.map((m) => <p key={m.id} className={`member-item ${selected?.id === m.id?"active" :""}`}  onClick={()=>setSelected(m)} >{m.nickname}</p>)}

        <h3>{admin.length === 0 ? "":"Admin"}</h3>
      {admin.map((m) =><p key={m.id} className={`member-item ${selected?.id === m.id?"active" :""}`} onClick={()=>setSelected(m)}  >{m.nickname}</p>)}
      
       <h3>{cs.length === 0 ? "":"CS"}</h3>
      {cs.map((m) =><p key={m.id} className={`member-item ${selected?.id === m.id?"active" :""}`} onClick={()=>setSelected(m)}  >{m.nickname}</p>)}
      

      
      
    </div>
   <div className="workspace-content">
  {!selected ? (
    <div className="empty-state">
      <p>Select a member to view tasks</p>
    </div>
  ) : (
    <>
      <h2 className="member-heading">{selected.nickname}</h2>
      
      {member_Task.length === 0 ? (
        <div className="empty-state">
          <p>There is no task yet.</p>
        </div>
      ) : ( 
        <div className="tasks-container">
          {tasks.map((task) => (
            <div key={task.id} className={`task-card ${task.priority.toLowerCase()}`}>
              <div className="task-card-header">
                <div className={`status-indicator ${task.priority.toLowerCase()}`}></div>
              </div>
              
              <div className="task-card-body">
                <span className="task-meta-title">
                  {`${task.dueDate} : ( ${task.title} )`}
                </span>
                <p className="task-description-preview">
                  {task.desc || "No details provided"}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  )}
</div>

  </div>
    
    
    </>
  )
}

export default Members_And_Tasks
