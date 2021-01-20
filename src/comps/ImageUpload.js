import React, { useState } from 'react'

import './ImageUpload.css'

const ImageUpload = ({ getFileForUpload }) => {
    // Image preview
    const [img, setImg] = useState(null);
    const [error, setError] = useState(null);
    const types = ['image/png', 'image/jpeg'];

    const changeHandler = (e) => {
        let selected = e.target.files[0];
        
        // check if a file is selected and is an accepted type
        if (selected && types.includes(selected.type)) {
            getFileForUpload(selected);
            setError(null);

            // Preview Image if file type is accepted
            const reader = new FileReader();
            reader.onload = () =>{
                reader.readyState === 2 && setImg(reader.result);
                
            }
            reader.readAsDataURL(selected);
        } else {
            getFileForUpload(null);
            setError('Please select an image file (png or jpeg)');
        }
    }

    return (
        <div>
            <div className="upload">
                <label>
                    <input type="file" onChange={changeHandler}/>
                    <span>+</span>
                </label>
                
                <div className="output">
                    { error && <div className="error">{ error }</div> }
                    { img && <img src={img} alt="preview img" />}
                </div>
            </div>
        </div>
    )
}

export default ImageUpload;
