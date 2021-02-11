import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'
import './ImageGrid.css'

const ImageGrid = ({ contract, uris }) => {
  const [nfts, setNfts] = useState(null)

  const getNft = async () => {
    const nftArray = []
    
    for (var i = 0; i < uris.length; i++) {
      console.log(i)
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

  // function makeid(length) {
  //   var result           = '';
  //   var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  //   var charactersLength = characters.length;
  //   for ( var i = 0; i < length; i++ ) {
  //       result += characters.charAt(Math.floor(Math.random() * charactersLength));
  //   }
  //   return result;
  // }

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
                pathname: `/nft/${index+1}`,
                state: {
                  tokenId: index+1,
                  contract: contract,
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
