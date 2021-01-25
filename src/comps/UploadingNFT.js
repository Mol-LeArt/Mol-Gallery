import React, { useEffect } from 'react';
import useStorage from '../hooks/useStorage';
import './UploadingNFT.css'

const UploadingNFT = ({ metadata, img, setImg }) => {
  const { url, progress } = useStorage(metadata, img)
  // const { url, progress } = useStorage(metadata, img);
  console.log('progress - ' + progress, 'url - ' + url)

  useEffect(() => {
    if (url) {
      setImg(null)
    }
  }, [img, setImg]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div>
      <div className='progress-bar' style={{ width: progress + '%' }}></div>
    </div>
  )
}

export default UploadingNFT;