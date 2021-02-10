import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'
import './ImageGrid.css'

const ImageGrid = ({ gallery, uris }) => {
  const [nfts, setNfts] = useState(null)

  const getNft = async () => {
    const nftArray = []
    
    for (var i = 0; i < uris.length; i++) {
      fetch(uris[i])
        .then((res) => res.json())
        .then((data) => {
          console.log(data.title)
          const nft = {
            id: makeid(5),
            title: data.title,
            description: data.description,
            image: data.image,
            sale: data.sale,
            price: data.price
          }
          nftArray.push(nft)
          setNfts([...nftArray])
        })
    }
  }

  function makeid(length) {
   var result           = '';
   var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
   var charactersLength = characters.length;
   for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
   }
   return result;
}

  useEffect(() => {
    getNft()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uris])

  return (
    <div className='img-grid'>
      {!nfts && <label>Wow, such empty!</label>}
      {nfts &&
        nfts.map((nfts) => (
          <div className='img-wrap' key={nfts.id}>
            <Link
              to={{
                pathname: `/nft/${nfts.id}`,
                state: {
                  title: nfts.title,
                  description: nfts.description,
                  image: nfts.image,
                  sale: nfts.sale,
                  price: nfts.price,
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
