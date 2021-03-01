import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'
import './ImageGrid.css'

const ImageGrid = ({ origin, contract, uris, gamma }) => {
  const [nfts, setNfts] = useState(null)

  const getNft = async () => {
    const nftArray = []
    
    for (var i = 0; i < uris.length; i++) {
      fetch(uris[i])
        .then((res) => res.json())
        .then((data) => {
          const nft = {
            title: data.title,
            description: data.description,
            image: data.image,
          }
          nftArray.push(nft)
          setNfts([...nftArray])
        })
    }
  }

  useEffect(() => {
    getNft()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uris])

  return (
    <div className='img-grid'>
      {!nfts && <label>Wow, such empty!</label>}
      {nfts &&
        nfts.map((nfts, index) => (
          <div className='img-wrap' key={index+1}>
            <Link
              to={{
                pathname: `/nft/${contract}:${index+1}`,
                state: {
                  origin: origin,
                  tokenId: index+1,
                  contract: contract,
                  gamma: gamma, 
                  title: nfts.title,
                  description: nfts.description,
                  image: nfts.image,
                },
              }}
            >
              <img src={nfts.image} alt='' />
            </Link>
          </div>
        ))}
    </div>
  )
}

export default ImageGrid;
