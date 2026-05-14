import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import "../css/Project_Detail.css";
  

const Project_Detail = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const { id } = useParams(); 
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [links,setLinks]=useState([]);
  const [FillLink,setFillLink]=useState({label:'',url:''})
  const [isExiting, setIsExiting] = useState(false);
  const [error,setError]=useState('');
const [isEditingDesc, setIsEditingDesc] = useState(false);
const [desc, setDesc] = useState("");
const [email,setEmail]=useState("");
const [loadingEmail,setLoadingEmail]=useState(false);
const [Message,setMessage]=useState({type:"",text:""});


  useEffect(() => {
    const fetchProject = async () => {
      try {
        const res = await fetch(`http://localhost:3000/projects/${id}`);
        const data = await res.json();
         setDesc(data.description || "");
        setLinks(data.links || []);
        setTimeout(() => {
          setProject(data);
          setLoading(false);
        }, 800);
      } catch (err) {
        console.error("Fetch error:", err);
        setLoading(false);
      }
    };
    fetchProject();
  }, [id]);

  const handleBack = () => {
    setIsExiting(true);
    setTimeout(() => navigate(-1), 300); 
  };

  const handleLink = (e)=>{
      const{name,value} = e.target;
      setFillLink((prev)=>({...prev,[name]:value}));
     
    
  }
  const handleEmail = (e)=>{

    setEmail(e.target.value);
  

  }

const addEmail = async () => {
  if (!email) {
    return setMessage({ type: "error", text: "Email required" });
  }

  try {
    setLoadingEmail(true);

    const res = await fetch("http://localhost:7000/invite", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, projectId: id }),
    });

    const data = await res.json();

    if (!res.ok) {
      return setMessage({
        type: "error",
        text: data.message || "Something went wrong",
      });
    }

    setMessage({ type: "success", text: data.message });

    setEmail("");

  } catch {
    setMessage({ type: "error", text: "Server error" });
  } finally {
    setLoadingEmail(false);
  }
};

    // setTimeout(async()=>{
    //     const res =await fetch(`http://localhost:3000/projects/${id}`);
    //     const data= await res.json();

    //       const currentEmails = data.participant_Email || [];
    //     const updatedEmails = [...emails,email];
      
    //     await fetch(`http://localhost:3000/projects/${id}`,{
    //   method:'PATCH',
    //   headers:{ 'Content-Type':'application/json',},
    //   body:JSON.stringify({participant_Email:updatedEmails}),

    // })
    
    //     setMessage({type:"success",text:"Email added successfully 🎉"});
    //   setEmail("");
    //  setLoadingEmail(false);
    // },3000)




  const addLink = async()=>{
      
    if( !(FillLink.label && FillLink.url)) return setError("Both fields are required");
    const updateLink = [...links,FillLink];


    setTimeout(async()=>{
        await fetch(`http://localhost:3000/projects/${id}`,{
      method:'PATCH',
      headers:{ 'Content-Type':'application/json',},
      body:JSON.stringify({links:updateLink}),

    })
      setInterval(setLinks(updateLink),1000);

      setLinks(updateLink);
      setFillLink({ label: "", url: "" });

    },1000)
  

  }


  const saveDescription = async () => {
  await fetch(`http://localhost:3000/projects/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ description: desc }),
  });

  setProject((prev) => ({ ...prev, description: desc }));
  setIsEditingDesc(false);
};

  if (loading) return <div className="loader">Loading workspace...</div>;
  if (!project) return <div className="error">Project not found.</div>;

  const accentStyle = { borderTop: `6px solid ${project.color}` };

  return (
    <div className={`project-detail-wrapper ${isExiting ? 'fade-out' : ''}`}>
      <button className="btn-back" onClick={handleBack}>
        ← Back to Projects
      </button>

      <div className="project-detail-view" style={accentStyle}>
        <header className="detail-header">
          <div className="title-section">
            <h1>{project.name}</h1>
            <span className="status-badge" style={{ backgroundColor: project.color + '22', color: project.color }}>
              {project.status}
            </span>
          </div>
          <div className="stats-row">
            <div className="stat-pill"><strong>{project.tasks}</strong> Tasks</div>
          
            {project.deadline && <div className="stat-pill">Due: {project.deadline}</div>
            
            }
          </div>
        </header>

              <div className="description-box">
  <h3>Description</h3>

  {isEditingDesc && user.role === "admin"? (
    <>
      <textarea
        className="desc-input" 
        value={desc}
        onChange={(e) => setDesc(e.target.value)}
        placeholder="Write project description..."
      />

      <div className="desc-actions">
        <button className="btn-save" onClick={saveDescription}>
          Save
        </button>
        <button
          className="btn-cancel"
          onClick={() => setIsEditingDesc(false)}
        >
          Cancel
        </button>
      </div>
    </>
  ) : (
    <p
      className="project-description"
      onClick={() => setIsEditingDesc(true)}
    >
      {desc || "Click to add description..."}
    </p>
  )}
</div>

         

        <section className="content-section">
          <h3>Project Resources</h3>

          <div className="links-grid">
            {links.length > 0 ? (links.map((link,index)=>( <a href={link.url} key={index}    target="_blank"
        rel="noreferrer"
        className="resource-card"  >   🔗 {link.label +" : "+ link.url} </a> )) ) :(<p>No links added yet.</p>)}



            </div>

             {error && <p className='error-text'>{error}</p>}
          <div className="add-link-form">
           
          
            <input type="text" name='label' placeholder="Label (e.g. Youtube)" 
              value={FillLink.label} onChange={handleLink} required
            />
            <input type="text" placeholder="URL"  name='url' value={FillLink.url} onChange={handleLink} required/>
            <button className="btn-add" type='button' onClick={addLink}>+ Add</button>
          </div>
        </section>


               { user.role == "admin" && (    <section className="content-section">
          <h3>Invite Member</h3>

              {Message.text &&  ( <p className = {Message.type ==="error"? 'error-text':"success-text"}  >{Message.text}</p>)  }

       
          <div className="invite-box">
            <input type="email" placeholder="Enter email (user@gmail.com)" value={email} onChange={handleEmail} />
            <button className="btn-invite" type='button' onClick={addEmail} disabled={loadingEmail}>{loadingEmail ?"Adding...":"Invite"}</button>
          </div>
          <div className='member-list'></div>
        </section>
)  }

      

        <footer className="detail-actions">
         
          <button className="btn-primary" style={{ backgroundColor: project.color }}>
            Mark as Complete
          </button>
        </footer>
      </div>
    </div>
  );
};

export default Project_Detail;
