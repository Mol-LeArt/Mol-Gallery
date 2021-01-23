import React from 'react';
import { Link } from 'react-router-dom';
import ImageGrid from '../comps/ImageGrid';
import './Commons.css'

const Commons = () => {
    const collection = 'nft'
    return (
        <div>
            <h1 className="commons-title">Commons</h1>
            <p className="commons-desc">Description for Commons goes here!</p>

            <Link to='/uploadNFT'>
                <button>Navigate to UploadNFT.js</button>
            </Link>
            <ImageGrid collection={collection}/>
        </div>
    )
}

export default Commons;
