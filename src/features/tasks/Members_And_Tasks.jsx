import React, { useEffect, useState } from 'react'
import "../css/Member_And_Task.css";
import {useOutletContext} from "react-router-dom";

const Members_And_Tasks = () => {
    const [members,setMembers]=useState([]);
    const [error,setError]=useState("");
    const [selected,setSelected]=useState('');
      const [tasks,setTasks]=useState([]);
      const [showbox,setShowbox]=useState(false);
      const [memberEmail,setMemberEmail]=useState('');
      const [memberType,setMemberType]=useState('');
      const [memberPassword,setMemberPassword]=useState('');

      const {search}= useOutletContext();


    useEffect(()=>{
        const fetchData =async()=>{
            try {
                const ress = await fetch("https://worksphere-h7y0.onrender.com/tasks");
                const res = await fetch("https://worksphere-h7y0.onrender.com/members");
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

    const addMember = async()=> {

      try {
          const lastMember = memberEmail.length-1;
         const newMemberId= lastMember ? Number(lastMember.id)+1 :1 ;
          const newMember = {
            id:String(newMemberId),
            email: memberEmail,
            password:memberPassword,
            nickname:"undefined nickname",
           role: memberType


          };

     
    const res=      await fetch("https://worksphere-h7y0.onrender.com/members",{method:"POST",
            headers:{ "Content-type":"application/json",},
              body:JSON.stringify(newMember),

          })

          const reloadMembers = await res.json();
          console.log("Member Added");
          setMembers(reloadMembers);
      } catch (error) {
          console.error(error);
      }

    }

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
    <button className='btn btn-primary' onClick={()=>setShowbox(true)} >Add Member</button>

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

 {showbox && (
  <div className="member-model">
    <div className="member-box">
      <h3>Add Member</h3>
      
      <div className="input-group">
        <input 
          type="text" 
          placeholder='Email' 
          value={memberEmail} 
          onChange={(e)=>setMemberEmail(e.target.value)}
        />
        <input 
          type="password" 
          placeholder='Password' 
          value={memberPassword} 
          onChange={(e)=>setMemberPassword(e.target.value)}
        />
        <select 
          className="member-select" 
          name="memberType" 
          onChange={(e)=>setMemberType(e.target.value)}
        >
          <option value="" disabled selected>Select Role</option>
          <option value="sensei">Sensei</option>
          <option value="admin">Admin</option>
          <option value="media">Media</option>
          <option value="cs">CS</option>
        </select>
      </div>

      <div className="modal-actions">
        <button className="btn-add-member" onClick={addMember}>
          Add Member
        </button>
        <button className="btn-cancel-member" onClick={() => setShowBox(false)}>
          Cancel
        </button>
      </div>
    </div>
  </div>
)}



</div>

  </div>
    
    
    </>
  )
}

export default Members_And_Tasks
