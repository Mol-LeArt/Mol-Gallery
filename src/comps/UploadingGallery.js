import React from 'react';
import { projectFirestore, timeStamp } from  '../firebase/config'
import './UploadingNFT.css'

const UploadingGallery = ({ gallery }) => {
    
    const collectionRef = projectFirestore.collection('gallery');
    const createdAt = timeStamp();
    const dict = { ...gallery, createdAt: createdAt }
    collectionRef.add(dict)

    return (
        <div></div>
        // <div className="progress-bar" style={{ width: progress + '%'}}></div>
    )
}

export default UploadingGallery;  