import React from 'react';
import { Link } from 'react-router-dom';
import ImageGrid from '../comps/ImageGrid';
import './Commons.css'

const Commons = () => {
    const source = "nft"
    const gallery = "commons"
    return (
      <div>
        <h1 className='commons-title'>Commons</h1>
        <p className='commons-desc'>Description for Commons goes here!</p>

        <Link
          to={{
            pathname: '/uploadNFT',
            state: { gallery: gallery },
          }}
        >
          <button>Upload Image</button>
        </Link>
        <ImageGrid source={source} />
      </div>
    )
}

export default Commons;
