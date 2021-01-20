import React from 'react';
import { Link } from 'react-router-dom'
import useFirestore from '../hooks/useFirestore';
import './ImageGrid.css'

const ImageGrid = ({ setSelectedImg}) => {
    const { docs } = useFirestore('nft');
    // console.log(docs)
    
    return (
        <Link to='/art'>
            <div className="img-grid">
                { docs && docs.map(doc => (
                    <div className="img-wrap" key={doc.id} 
                        // onClick={() => navigate to art.js}
                    >
                    
                        <img 
                            src={doc.url} 
                            onMouseOver={e => e.currentTarget.src="https://www.justonecookbook.com/wp-content/uploads/2019/12/Oden-2187-I-1-500x500.jpg"} 
                            onMouseOut={e => e.currentTarget.src=doc.url}
                            alt="uploaded pic"/>
                    </div>
                ))}
            </div>
        </Link>
    )
}

export default ImageGrid;
