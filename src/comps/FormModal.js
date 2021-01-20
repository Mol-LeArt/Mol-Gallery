import React from 'react'
import Form from './Form'

import './Modal.css'

const FormModal = ({ toggleUploadStatus, uploadImgStatus, setUploadFile}) => {
    const handleClick =(e) => {
        // classList is used to identify className
        if (e.target.classList.contains("backdrop")) {
            toggleUploadStatus(false);
        }
    }

    return (
        <div className="backdrop" onClick={handleClick}>
            <Form toggleUploadStatus={toggleUploadStatus} uploadImgStatus={uploadImgStatus} setUploadFile={setUploadFile}/>
        </div>
    )
}

export default FormModal;
