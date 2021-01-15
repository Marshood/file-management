import React, { useState, useEffect, useRef } from 'react';
import './FilesTree.css';
import Tree from '@naisutech/react-tree';
import PopUp from '../Popupmodel/PopUp'
import Modal from 'react-awesome-modal';
 import axios from 'axios';
import { Form, Row, Col, Button } from 'react-bootstrap';
import Dropzone from 'react-dropzone';
import pdfIcon from './file-pdf-regular.svg';
import Showfilescontent from '../Showfilescontent/Showfilescontent';
function FilesTree(props) {
    // const { Newfolders, Newfiles } = props;
    const [Newfolders, seTNewfolders] = useState(props.Newfolders);
    const [Newfiles, seTNewfiles] = useState(props.Newfiles);
    const [selectedFodler, seTselectedFodler] = useState(true);
    const [FolderData, seTFolderData] = useState({ value: null, label: null })
    const [treeNodes, seTtreeNodes] = useState([]);
    const [isLoading, seTisLoading] = useState(true);
    const [visibleFolder, seTvisibleFolder] = useState(false);
    const [visibleFile, seTvisibleFile] = useState(false);
    const [Folders, seTFolders] = useState([{ value: 'Defult', label: 'Defult' }])
    const [FolderID, seTFolderID] = useState('')
    const [MainRoot, seTMainRoot] = useState(false)
    const [TempFolder, seTtempFolder] = useState('')
    //copy filesor
    const [file, setFile] = useState(null); // state for storing actual image
    const [previewSrc, setPreviewSrc] = useState(''); // state for storing previewImage
    const [state, setState] = useState({
        label: '',
        parentId: '',
        title: '',
        description: ''
    });
    const [errorMsg, setErrorMsg] = useState('');
    const [isPreviewAvailable, setIsPreviewAvailable] = useState(false); // state to show preview only for images
    const dropRef = useRef(); // React ref for managing the hover state of droppable area
    const [ShowFilesdata, seTShowFilesdata] = useState([])
    const ShowDataFileArray = [];
    const [FileToshow, seTfileToshow] = useState(false)
    const [selectedFileTosho, seTselectedFileTosho] = useState('')

    const handleInputChange = (event) => {
        setState({
            ...state,
            [event.target.name]: event.target.value
        });
    };

    const onDrop = (files) => {
        const [uploadedFile] = files;
        setFile(uploadedFile);

        const fileReader = new FileReader();
        fileReader.onload = () => {
            setPreviewSrc(fileReader.result);
        };
        fileReader.readAsDataURL(uploadedFile);
        setIsPreviewAvailable(uploadedFile.name.match(/\.(jpeg|jpg|png)$/));
        dropRef.current.style.border = '2px dashed #e9ebeb';
    };

    const updateBorder = (dragState) => {
        if (dragState === 'over') {
            dropRef.current.style.border = '2px solid #000';
        } else if (dragState === 'leave') {
            dropRef.current.style.border = '2px dashed #e9ebeb';
        }
    };
    const RandomID = function () {
        // Math.random should be unique because of its seeding algorithm.
        // Convert it to base 36 (numbers + letters), and grab the first 9 characters
        // after the decimal.
        return '_' + Math.random().toString(36).substr(2, 9);
    };
    const handleOnSubmit = async (event) => {
        event.preventDefault();

        try {
            const { title, description, label, parentId } = state;
            if (title.trim() !== '' && description.trim() !== '') {
                if (file) {

                    const formData = new FormData();
                    formData.append('file', file);
                    formData.append('id', RandomID());
                    formData.append('label', label);
                    formData.append('parentId', parentId);
                    formData.append('title', title);
                    formData.append('description', description);
                    console.log("parentid-custom-header ", parentId);
                    const testFile = {
                        'file': file,
                        'label': label

                    };


                    setErrorMsg('');
                    await axios.post(`/api/Files/addingFile`, formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                            'parentId-Custom-Header': parentId,
                            'title-Custom-Header': title,
                            'label-Custom-Header': label,
                            'description-Custom-Header': description,
                            'id-Custom-Header': RandomID(),

                        }
                    }).then(data => {
                        console.log("response data", data)
                        if (data.data.success == false) {
                            console.log("hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh")

                            fetch('/api/Files/files')
                                .then(response => response.json())
                                .then(data => {
                                    seTNewfiles(data);
                                    const temp = Newfolders;
                                    seTNewfolders([]);
                                    seTNewfolders(temp);
                                });
                            return;
                        }
                        else {
                            console.log("elseeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee")

                            seTNewfiles(data.data)

                            fetch('/api/Files/Folder')
                                .then(response => response.json())
                                .then(data => {
                                    // console.log(data)
                                    console.log("seTNewfolders data ", data)
                                    seTNewfolders(data);
                                });
                        }
                    });
                    props.history.push('/list');
                } else {
                    setErrorMsg('Please select a file to add.');
                }
            } else {
                setErrorMsg('Please enter all the field values.');
            }

        } catch (error) {
            error.response && setErrorMsg(error.response.data);
        }
    };
    //end copy file 
    // open and close pop model for Folders 
    function openModalFolder() {

        seTvisibleFolder(true);
    }
    function closeModalFolder() {
        seTvisibleFolder(false);
    }
    // open and close pop model for files 
    function openModalFile() {

        seTvisibleFile(true);
    }
    function closeModalFile() {
        seTvisibleFile(false);
    }

    //fetch to add new folder
    async function AddingFolder(e) {
        e.preventDefault();
        let NewFolderName = e.target.Fname.value;

        try {
            await axios.post(`/addingFolder`, { NewFolderName, FolderID })
                .then(res => {
                    console.log(res.data.doc);
                    const TempFile = {
                        label: res.data.doc.metadata.label,
                        id: res.data.doc.metadata.id,
                        parentId: FolderID,
                        items: null,
                        file: false
                    }
                    seTtreeNodes(treeNodes => [...treeNodes, TempFile])
                })

        }
        catch (err) { console.log(err) }

    }
    //combox to save to root or not
    function handleChangeChk() {
        if (!MainRoot) {
            seTMainRoot(true)
            seTtempFolder(FolderID);
            seTFolderID(null)
        } else {
            seTMainRoot(false)
            seTFolderID(TempFolder)
        }

    }

    function marshoodTest(id, RID,label,contentType,description) {
        console.log("id", id)
        let data = "";
        axios
            .get(`/api/Files/getFile${id}`, {
                responseType: 'arraybuffer'
            })
            .then(response => {
                const buff = Buffer.from(response.data, 'binary').toString('base64')
                localStorage["fileBase64"] = buff;
                const Temparray = {
                    "Mongoid": id,
                    "id": RID,
                    "data": buff,
                    "label":label,
                    "contentType":contentType,
                    "description" : description
                }
                ShowDataFileArray.push(Temparray)
                seTShowFilesdata(ShowFilesdata => [...ShowFilesdata, Temparray])
                // console.log("ShowFilesdataaaaaaaaaaaaa ", ShowDataFileArray)

                // return 1;
            })

    }
    // import the files and folders from db to show 
    function setItems(parentId) {
        const TempItems = []; //Newfiles
        if (Newfiles.length > 0) {
            Newfiles.map(FileRead => {
                if (FileRead.metadata.parentId == parentId) {
                    TempItems.push({
                        label: FileRead.metadata.label,
                        parentId: FileRead.metadata.parentId,
                        id: FileRead.metadata.id,
                        file: true,
                        type: FileRead.contentType,
                        data: marshoodTest(FileRead._id, FileRead.metadata.id,FileRead.metadata.label,FileRead.contentType,FileRead.metadata.description)
                    });
                    // console.log("marshood ", FileRead._id)
                    return TempItems;
                }
            })
        }
        // Newfolders.map(fileRead => {
        //     if (fileRead.metadata.parentId == parentId && fileRead.metadata.file === true) {
        //         TempItems.push({
        //             label: fileRead.metadata.label,
        //             parentId: fileRead.metadata.parentId,
        //             id: fileRead.metadata.id,
        //             file: true
        //         });
        //         return TempItems;
        //     }

        // })

        return TempItems;

    }
    // to set new data on the tree
    async function reloadData() {
        seTtreeNodes([]);
        if (Newfolders.length == 0 || Newfolders.err == "No files exist") {
            seTselectedFodler(false);
            seTFolderID(null)
        } else {
            Newfolders.map(async (fileRead) => {
                console.log("map map ")
                if (fileRead.metadata.parentId === null && fileRead.metadata.items === false && fileRead.metadata.file === false) { //Folder without files (items)
                    const TempFile = {
                        label: fileRead.metadata.label,
                        id: fileRead.metadata.id,
                        parentId: fileRead.metadata.parentId,
                        items: null,
                        file: false
                    }
                    seTtreeNodes(treeNodes => [...treeNodes, TempFile])
                }
                else if (fileRead.metadata.parentId != null && fileRead.metadata.items === false && fileRead.metadata.file === false) // Folder inside folder without files (items)
                {
                    const TempFile = {
                        label: fileRead.metadata.label,
                        id: fileRead.metadata.id,
                        parentId: fileRead.metadata.parentId,
                        items: null,
                        file: false
                    }
                    seTtreeNodes(treeNodes => [...treeNodes, TempFile])
                }
                else if (fileRead.metadata.parentId === null && fileRead.metadata.items === true && fileRead.metadata.file === false) // Folder  with files (items)
                {
                    const TempFile = {
                        label: fileRead.metadata.label,
                        id: fileRead.metadata.id,
                        parentId: fileRead.metadata.parentId,
                        items: setItems(fileRead.metadata.id),
                        file: false

                    }
                    seTtreeNodes(treeNodes => [...treeNodes, TempFile])
                }
                else if (fileRead.metadata.parentId != null && fileRead.metadata.items === true && fileRead.metadata.file === false) // Folder inside folder without files (items)
                {
                    const TempFile = {
                        label: fileRead.metadata.label,
                        id: fileRead.metadata.id,
                        parentId: fileRead.metadata.parentId,
                        items: setItems(fileRead.metadata.id),
                        file: false
                    }
                    seTtreeNodes(treeNodes => [...treeNodes, TempFile])
                }

            });


        }
        return;
    }
    // useEffect
    useEffect(async () => {
        console.log(" useEffect useEffect useEffect useEffect useEffect")
        async function UpdateData() {
            const response = await reloadData();
            console.log("finish ")
            console.log("finish map", ShowDataFileArray.length, ShowDataFileArray)


            // ...
        }
        UpdateData();

    }, [Newfolders]);
    // selected file or folder 
    const onSelect = selectedNode => {
        //selectedNode.parentId != null && selectedNode.items == null&&
        console.log(selectedNode)
        if (selectedNode.file === false) {
            seTselectedFodler(false);
            console.log("selected folder ,", selectedNode.label)
            seTFolderID(selectedNode.id)
            seTFolderData({ value: selectedNode.id, label: selectedNode.label })
            // seTvisibleFile(false)
        }
        else {
            seTselectedFodler(true);
            console.log("selected file ,", selectedNode.label, selectedNode.id)
            seTfileToshow(true);
            const FileDataBuffer=ShowFilesdata.find(el => el.id == selectedNode.id);
            seTselectedFileTosho({id:selectedNode.id,data:FileDataBuffer});
             console.log("123",ShowFilesdata.find(el => el.id == "_tjrvvgfck"));
             console.log("ShowFilesdataaaaaaaaaaaaa ", ShowFilesdata)

        }
    }

    return (
        <div>
            {
                treeNodes &&
                <div style={{ display: 'flex', flexWrap: 'nowrap', flexGrow: 1 }}>
                    <div style={{ width: '50%', display: 'flex', flexDirection: 'column' }}>
                        <div>
                            <button disabled={selectedFodler} onClick={() => openModalFolder()}> Add Folder</button>
                            <button disabled={selectedFodler} onClick={() => openModalFile()}>Add file</button>
                            <button disabled={true}>Delete</button>
                            <button disabled={true}>Move</button>
                        </div>
                        <Tree nodes={treeNodes} isLoading={isLoading} onSelect={onSelect} showEmptyItems size="full " theme={'light'}

                        // iconSet={{
                        //     file: <img src={"asd" }  width="100%" height="100%"/>,
                        //     folder:<img src={pdfIcon}  width="100%" height="100%"/>,
                        //     node
                        //      // the  file item indicator (default 'paperclip')
                        //   }}

                        />
                    </div>

                    {/* <h1> Show Folders with files </h1> */}
                    <br></br>
                    {
                        FileToshow &&
                        <div>
                             <Showfilescontent ShowDataFileArray={selectedFileTosho} />
                        </div>

                    }
                    <Modal visible={visibleFolder} width="400" height="300" effect="fadeInLeft" onClickAway={() => closeModalFolder()}>
                        <div>
                            <h1>Adding Folder</h1>
                            <form onSubmit={(e) => AddingFolder(e)}>
                                {/* <div style={{ width: "50%" }}>
                                Root  :-
                                <Select
                                    styles={customStyles}
                                    maxMenuHeight={300}
                                    options={options}
                                    width={30}
                                />
                            </div> */}
                                <div>
                                    Add to main root
                            <input type="checkbox" defaultChecked={false} onChange={handleChangeChk} />
                                </div>
                            Adding folder to  :- {FolderData.label}
                                <br></br>
                                <div>
                                    <label for="Fname"><b>Folder name:</b></label>
                                    <br></br>
                                    <input type="text" id="NewFolder" placeholder="Enter Folder Name" name="Fname" required />
                                </div>
                                <br></br>
                                <input type="submit" value="Add" />
                                <a href="javascript:void(0);" onClick={() => closeModalFolder()}>Close</a>
                            </form>
                        </div>
                    </Modal>
                    <Modal visible={visibleFile} width="400" height="300" effect="fadeInLeft" onClickAway={() => closeModalFile()}>
                        <div>
                            <h1>Adding F</h1>
                            <React.Fragment>
                                <Form className="search-form" onSubmit={handleOnSubmit}>
                                    {errorMsg && <p className="errorMsg">{errorMsg}</p>}
                                    <Row>
                                        <Col>
                                            <Form.Group controlId="title">
                                                <Form.Control
                                                    type="text"
                                                    name="title"
                                                    value={state.title || ''}
                                                    placeholder="Enter title"
                                                    onChange={handleInputChange}
                                                />
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col>
                                            <Form.Group controlId="description">
                                                <Form.Control
                                                    type="text"
                                                    name="description"
                                                    value={state.description || ''}
                                                    placeholder="Enter description"
                                                    onChange={handleInputChange}
                                                />
                                            </Form.Group>
                                        </Col>
                                    </Row>

                                    <Row>
                                        <Col>
                                            <Form.Group controlId="parentId">
                                                <Form.Control
                                                    type="text"
                                                    name="parentId"
                                                    value={state.parentId || ''}
                                                    placeholder="Enter parentId"
                                                    onChange={handleInputChange}
                                                />
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col>
                                            <Form.Group controlId="label">
                                                <Form.Control
                                                    type="text"
                                                    name="label"
                                                    value={state.label || ''}
                                                    placeholder="Enter label"
                                                    onChange={handleInputChange}
                                                />
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                    <div className="upload-section">
                                        <Dropzone
                                            onDrop={onDrop}
                                            onDragEnter={() => updateBorder('over')}
                                            onDragLeave={() => updateBorder('leave')}
                                        >
                                            {({ getRootProps, getInputProps }) => (
                                                <div {...getRootProps({ className: 'drop-zone' })} ref={dropRef}>
                                                    <input {...getInputProps()} />
                                                    <p>Drag and drop a file OR click here to select a file</p>
                                                    {file && (
                                                        <div>
                                                            <strong>Selected file:</strong> {file.name}
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </Dropzone>

                                    </div>
                                    <Button variant="primary" type="submit">
                                        Submit</Button>
                                </Form>

                            </React.Fragment>

                        </div>
                    </Modal>
                </div>

            }


        </div >
    )
}

export default FilesTree;