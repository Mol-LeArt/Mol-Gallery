import React from 'react'
import { Link } from 'react-router-dom';
import ImageGrid from '../comps/ImageGrid';
import './Gallery.css'

const Gallery = ({ match }) => {
    const collection = 'gallery'
    console.log(match)
    return (
        <div>
            <h1 className='gallery-title'>XXX's Gallery</h1>
            <p className="gallery-desc">Description for your gallery goes here!</p>
            <Link to='/uploadNFT'>
                <button>Navigate to UploadNFT.js</button>
            </Link>

            <ImageGrid collection={collection}/>
        </div>
    )
}

export default Gallery
