import React,{useState} from 'react'
import styled from 'styled-components'
import { Upload, Icon, message } from 'antd';
import axios from 'axios';
const { Dragger } = Upload;
 
const Container = styled.div`
    width: 100%;
    height: 100%;
`

const Uploader = () => {

    // const props = {
    //     name: 'photo',
    //     multiple: false,
    //     action: 'http://localhost:8000/photo',
    //     onChange(info) {
    //         const { status } = info.file;
    //         if (status !== 'uploading') {
    //             console.log(info.file, info.fileList);
    //         }

    //         if (status === 'done') {
    //             message.success(`${info.file.name} file uploaded successfully.`);
    //         } else if (status === 'error') {
    //             message.error(`${info.file.name} file upload failed.`);
    //         }
    //     },
    // };

    // return (
    //     <Container>
    //         <Dragger {...props}>
    //             <div style={{width: '100%'}}>
    //                 <p className="ant-upload-drag-icon">
    //                     {/* <Icon type="inbox" /> */}
    //                 </p>
    //                 <p className="ant-upload-text">Click or drag file to this area to upload</p>
    //             </div>
    //         </Dragger>
    //     </Container>
    // )

    const [state, SetState] = useState({
      file: null
    });
   
    function onFormSubmit  (e) {
        e.preventDefault();
        const formData = new FormData();
        formData.append('myfile',this.state.file);
        const config = {
            headers: {
                'content-type': 'multipart/form-data'
            }
        };
        axios.post("/upload", formData, config)
            .then((response) => {
                alert("The file is successfully uploaded");
            }).catch((error) => {
                alert(error);
        });
    }
    function onChange (e){
      SetState({file:e.target.files});
  }
   
    return (
        <form onSubmit={onFormSubmit}>
            <h1>File Upload</h1>
            <input type="file" className="custom-file-input" name="myImage" onChange= {onChange} />
            <button className="upload-button" type="submit">Upload to DB</button>
        </form>
    )
 
}

export default Uploader;

