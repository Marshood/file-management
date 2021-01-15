import React, { useState, useEffect } from 'react'


function Showfilescontent(props) {
    const ShowDataFileArray = props.ShowDataFileArray;
    const [isHidden, seTisHidden] = useState(false)

    // pdf  + button to download file
    // no pdf show two button pdf and content type download 
    // convert the file and show on ifram like pdf file
    // 
    // adding input to add notes and deatiles with two button delete and edit  and save to new db collection 
    // fix all bugs and deploay 
    function handleClick() {
        seTisHidden(!isHidden)
    }
    useEffect(() =>
    {



    },[])
    return (

        <div>
            {
                (ShowDataFileArray.data == undefined) &&
                <div>
                    <h1>
                        try again ...
                    </h1>
                </div>
            }
            {
                (ShowDataFileArray.data != undefined) &&
                <div style={{ textAlign: 'center', justifyContent: 'center', alignItems: 'center' }}>
                    <h1>{ShowDataFileArray.data.label}</h1>
                    <p>
                    description:- {ShowDataFileArray.data.description}
                    </p>
                    <div>

                        <button onClick={handleClick}> Show hide</button>
                    </div>
                    <div>
                        {
                            !isHidden &&
                            <iframe name="marshood" src={`data:application/pdf;base64,${ShowDataFileArray.data.data}` + '#toolbar=0'} type="application/pdf" //data:application/pdf;base64;
                                width="500" height="500" title="hidden-2">
                                noframes</iframe>
                        }

                    </div>

                </div>
            }
        </div>
    )
}

export default Showfilescontent
