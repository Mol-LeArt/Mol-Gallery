import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import UploadingNFT from '../comps/UploadingNFT'
import ImageUpload from '../comps/ImageUpload'
import './UploadNFT.css'

const UploadNFT = () => {    
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [img, setImg] = useState(null)
    const [compliance, setCompliance] = useState(false)
    const [gallery, setGallery] = useState('')
    const [metadata, setMetadata] = useState(null)    

    const getFileForUpload = (img) => {
        setImg(img);
    }

    const onSubmit = e => {
        e.preventDefault();
        
        if (compliance) {
            const nft = {
                title: title,
                description: description,
                compliance: compliance,
                gallery: "commons"
            }
            setMetadata(nft)
        } else {
            alert('You must accept!')
        }
    }

    // console.log(metadata, img)

    return (
        <div className="from-in-uploadnft">
            <h1 className="upload-nft-title">Upload NFT</h1>
            <p>Describe the steps to uploading an NFT!</p>

            <form onSubmit={onSubmit}>
                <div>  
                    <label htmlFor="text">Title</label>
                    <br/>
                    <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Enter Title"/>
                </div>

                <div>
                    <label htmlFor="description">Description</label>
                    <br/>
                    <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Enter Description"/>
                </div>

                <ImageUpload getFileForUpload={getFileForUpload}/>

                {metadata && <UploadingNFT metadata={metadata} img={img} setImg={setImg}/>} 

                <div>
                    <input type="Checkbox" checked={compliance} onChange={(e) => setCompliance(e.target.checked)}/>
                    <label >I agree to XYZ.</label>
                </div>
                
                <div >
                    <button >Submit</button>
                </div>
            </form>
        </div>
    )
}

export default UploadNFT
