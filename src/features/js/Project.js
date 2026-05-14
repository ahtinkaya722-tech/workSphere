export const deleteProjectAPI= async (project_id)=>{

    const confirmDelete = window.confirm("Are you sure you want to delete");
    if(!confirmDelete)return;

    try {
           await fetch(`http://localhost:3000/projects/${project_id}`,{method:'DELETE',}); 
        return true;

    } catch (error) {
          console.error("Delete failed:", error);
    }


}