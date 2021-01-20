import React, { useEffect } from 'react';
import useStorage from '../hooks/useStorage';
import './UploadingNFT.css'

const UploadingNFT = ({ metadata, img, setImg }) => {
    const { url } = useStorage(metadata, img);
    // const { url, progress } = useStorage(metadata, img);
    // console.log("progress - " + progress, "url - " + url);

    useEffect(()=> {
        if (url) {
            setImg(null);
        }
    }, [url, img, setImg]);

    return (
        <div></div>
        // <div className="progress-bar" style={{ width: progress + '%'}}></div>
    )
}

export default UploadingNFT;