import React from 'react';
import { projectFirestore, timeStamp } from  '../firebase/config'
import './UploadingNFT.css'

const UploadingGallery = ({ gallery }) => {
    // Get token name and symbol from contract

    // Get gallery name and description from firebase
    const collectionRef = projectFirestore.collection('gallery');
    const createdAt = timeStamp();
    const dict = { ...gallery, createdAt: createdAt }
    collectionRef.add(dict)

    return (
        <div></div>
    )
}

export default UploadingGallery;  