export const addNewdata = async(userId,form)=>{

      const newdata ={ 
        nickname: form.fullname,
        email: form.email
      };

      const res = await fetch(`http://localhost:5000/members/${userId}`,
       {method:"PATCH",
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify(newdata),} 

      )
        const data = res.json();
      if (!res.ok) {
        alert("Failed to update profile");
        return;
      }

    
      return data;

  }