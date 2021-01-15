import React,{useState,useEffect} from 'react'
import FilesTree from '../../FilesTree/FilesTree'



 
function Files() {
    const [folders, seTfolders] = useState("");
    const [files, seTfiles] = useState("");

    useEffect(() => {

        fetch('/api/Files/Folder')
        .then(response => response.json())
        .then(data => {
            // console.log(data)
            //  console.log("data ",data)
            seTfolders(data);
        });
        
        fetch('/api/Files/files')
        .then(response => response.json())
        .then(data => {
            // console.log(data)
            //  console.log("data ",data)
            seTfiles(data);
        });
    
    
    },[]);
    return (
        <div>
            {
                folders && files &&
                <FilesTree Newfolders={folders} Newfiles={files} />
            }
        </div>
    )
}

export default Files
