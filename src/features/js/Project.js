export const deleteProjectAPI= async (project_id)=>{

    const confirmDelete = window.confirm("Are you sure you want to delete");
    if(!confirmDelete)return;

    try {
           await fetch(`https://worksphere-h7y0.onrender.com/projects/${project_id}`,{method:'DELETE',}); 
        return true;

    } catch (error) {
          console.error("Delete failed:", error);
    }


}