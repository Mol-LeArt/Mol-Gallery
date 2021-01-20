import React, { useState } from 'react';
import './Portfolio.css'
import Upload from './upload/UploadAction';
import ImageGrid from '../ImageGrid';
import ImageModal from '../utils/modal/ImageModal';
import ProgressBar from '../utils/progressBar/ProgressBar';

const Portfolio = () => {
  const [selectedImg, setSelectedImg] = useState(null);
  const [uploadFile, setUploadFile] = useState(null);

  return (
    <div className="portfolio">
      <h1 className="portfolio-title">Audsssy's Gallery</h1>
      <p className="portfolio-desc">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
      <Upload setUploadFile={setUploadFile}/>   

      { uploadFile && <ProgressBar file={uploadFile} setFile={setUploadFile}/> }    
      <br/>
      <br/>
      <br/>

      <br/>
      <br/>
      <br/>

      {/* Add image to image grid */}
      <ImageGrid setSelectedImg={setSelectedImg}/>
      
      {/* Select image to enlarge  */}
      { selectedImg && <ImageModal selectedImg={selectedImg} setSelectedImg={setSelectedImg}/> }
    </div>
  );
}

export default Portfolio;