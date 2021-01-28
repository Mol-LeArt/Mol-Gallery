import React from 'react';
import { Link } from 'react-router-dom'
import useFirestore from '../hooks/useFirestore';
import './ImageGrid.css'

const ImageGrid = ({ source }) => {
  const { docs } = useFirestore(source)

  return (
    <div className='img-grid'>
      {docs &&
        docs.map((doc) => (
          <div className='img-wrap' key={doc.id}>
            <Link to={`/nft/${doc.id}`}>
              <img
                src={doc.url}
                onMouseOver={(e) =>
                  (e.currentTarget.src =
                    'https://www.justonecookbook.com/wp-content/uploads/2019/12/Oden-2187-I-1-500x500.jpg')
                }
                onMouseOut={(e) => (e.currentTarget.src = doc.url)}
                alt='uploaded pic'
              />
            </Link>
          </div>
        ))}
    </div>
  )
}

export default ImageGrid;
