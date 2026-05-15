import React, { useState } from 'react'
import "../css/Setting.css";
import { resizeAvatar } from '../js/image_Upload';
import { addNewdata } from '../js/addNewdata';

const Setting = () => {
  const [notifications, setNotifications] = useState(true);
  const user = JSON.parse(localStorage.getItem("user"));
  const [form,setForm]=useState({

fullname : user.nickname,
email: user.email
  }
    


  );

  const handleChange = (e)=>{
    const {name,value}=e.target;
    setForm((prev)=> ({ ...prev, [name]:value,

    }));
  }

  const UpdateData = async()=>{

    try { const updateUserData = await addNewdata(user.id,form);
          localStorage.setItem("user",JSON.stringify(updateUserData));
            window.location.reload();
    } catch (error) {
       console.error("Update failed:", error);
    alert("Failed to update profile");
    }


   
   

  }


  const handleImage =async(e)=>{
     const file = e.target.files[0];
  if (!file) return;


    try {
      const base64 = await resizeAvatar(file);

      const res = await fetch(`https://worksphere-h7y0.onrender.com/members/${user.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ avatar: base64 }),
      });

      if(!res.ok){
         alert("Failed to update photo");
      return;
      }

      const updatedUser = await res.json();
      localStorage.setItem("user", JSON.stringify(updatedUser));

      window.location.reload();
    } catch (err) {
      console.error("Upload failed:", err);
    }
};

  return (
    <>
      <div className="settings-page">
        <header className="settings-header">
          <h1>Settings</h1>
          <p>Manage your account settings and workspace preferences.</p>
        </header>

        <div className="settings-container">
          {/* Profile Section */}
          <section className="settings-section">
            <h3>Profile Information</h3>
            <div className="settings-item">
              <div className="profile-upload">
                {user.avatar ? (<img src={user.avatar} className = "avatar-large"/>) :(  <div className="avatar-large">AK</div> )}
              
                <label className="btn-secondary">
  Change Photo
  <input type="file" hidden onChange={handleImage} />
</label>
              </div>
              <div className="input-grid">
                <div className="input-field">
                  <label>Full Name</label>
                  <input type="text" name='fullname' value={form.fullname} onChange={handleChange}   />
                </div>
                <div className="input-field">
                  <label>Email Address</label>
                  <input type="email" name='email' value={form.email} onChange={handleChange}  />
                </div>
              </div>
            </div>
          </section>

          <hr className="divider" />

          {/* Workspace Preferences */}
          <section className="settings-section">
            <h3>Workspace Preferences</h3>
            <div className="settings-toggle-item">
              <div>
                <h4>Email Notifications</h4>
                <p>Receive weekly summaries of your team activity.</p>
              </div>
              <label className="switch">
                <input
                  type="checkbox"
                  checked={notifications}
                  onChange={() => setNotifications(!notifications)}
                />
                <span className="slider round"></span>
              </label>
            </div>
          </section>

          <div className="settings-actions">
            <button className="btn-save" onClick={UpdateData} >Save Changes</button>
            <button className="btn-cancel">Cancel</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Setting;
