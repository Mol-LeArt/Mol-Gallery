import React, { useState } from 'react'
// import ProgressBar from './ProgressBar'
import './UploadAction.css'
import FormModal from '../../FormModal';


const Upload = ({ setUploadFile }) => {
    const [uploadStatus, toggleUploadStatus] = useState(false);
    const [uploadImgStatus, toggleUploadImgStatus] = useState(false);

    const handleClick = (e) => {
        toggleUploadStatus(true);

        // hard coding this to true for now, will need to 
        // pass in dynamic data to reflect whether to include 
        // image upload component 
        toggleUploadImgStatus(true);
    }

    return (
        <div>
            <div className="form-modal">
                <button className="form-modal-button" type="button" onClick={handleClick}>+</button>
                    { uploadStatus && <FormModal toggleUploadStatus={toggleUploadStatus} uploadImgStatus={uploadImgStatus} setUploadFile={setUploadFile}/> }
            </div>
        </div>
    )
}

export default Upload;
