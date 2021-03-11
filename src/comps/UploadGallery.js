import React from 'react';
import { projectFirestore, timeStamp } from  '../firebase/config'

const UploadGallery = ({ gallery }) => {
    const collectionRef = projectFirestore.collection('gallery');
    const createdAt = timeStamp();
    const dict = { ...gallery, createdAt: createdAt }
    collectionRef.add(dict)

    return (
        <div></div>
    )
}

export default UploadGallery;  