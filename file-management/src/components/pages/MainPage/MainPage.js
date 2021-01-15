import React, { useEffect, useState } from 'react'
// import Uploader from './Uploader/Uploader'
function MainPage() {
    const [Data, SetData] = useState({})
    const Data1 = {
        id: 'root',
        name: 'Parent',
        children: [
            {
                id: '1',
                name: 'Child - 1',
            },
            {
                id: '2',
                name: 'Child - 2',
            },
            {
                id: '3',
                name: 'Child - 3',
            }
        ],
    }
    useEffect(() => {
        console.log("1")

        fetch('/*')
            .then((response) => response.json())
            .then((data) => {
                console.log("data ", data);
                SetData(data)
            });

    }, []);

    return (

        <div>
{/* <Uploader/> */}
            {/* <form  onSubmit={(e) => addFile(e)}>
                <label for="name">Image Title</label>
                <input type="text" id="name" placeholder="Name"
                      name="name" required />

                <div>
                    <label for="pesc">Image Description</label>
                    <textarea id="desc" name="desc"  rows="2"
                        placeholder="Description" required>
                    </textarea>
                </div>
                <div>
                <label for="image">Upload Image</label>
                <input type="file" id="image"
                       name="image"  required/>
            </div>
            <div>
                <button type="submit">Submit</button>
            </div>
            </form> */}
        </div>
    )


    function addFile(e) {
        e.preventDefault();
        // console.log("name", e.target.name.value)
        // console.log("pesc", e.target.desc.value)
        console.log("file", e.target.image.value.filename)

        let name = e.target.name.value;
        let pesc =e.target.desc.value;
        let file=e.target.image;
        fetch('/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(
                {
                    name: name,
                    pesc: pesc,
                    file:file,
                 })
        })


    }
}

export default MainPage
