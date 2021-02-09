import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
// import ImageGrid from '../comps/ImageGrid'
import { ethers } from 'ethers'
import ABI from '../comps/MOLGAMMA_ABI'
import './GalleryPreview.css'

const GalleryPreview = ({ contract }) => {
  const [name, setName] = useState(null)
  const [symbol, setSymbol] = useState(null)
  const [images, setImages] = useState(null)

  // ----- Smart Contract Interaction Config
  const provider = new ethers.providers.Web3Provider(window.ethereum, 'any')
  const signer = provider.getSigner()
  const _contract = new ethers.Contract(contract, ABI, signer)

  const getContract = async () => {
    const imageArray = []

    _contract
      .name()
      .then((n) => {
        _contract
          .symbol()
          .then((s) => {
            _contract
              .getAllTokenURI()
              .then((uri) => {
                // console.log('n + s + uri = ', n, s, uri)
                setName(n)
                setSymbol(s)

                for (var i = 2; i >= 0; i--) {
                  fetch(uri[i])
                    .then((res) => res.json())
                    .then((data) => {
                      console.log(data)
                      let image = { id: data.title + contract.slice(-4), image: data.image}
                      imageArray.push(image)
                      setImages([...imageArray])
                      
                    }).catch(e => console.log(e))
                }
              })
              .catch((e) => {
                console.log(e)
              })
          })
          .catch((e) => {
            console.log(e)
          })
      })
      .catch((e) => {
        console.log(e)
      })
  }

  const getRoyalties = async () => {
    _contract.getRoyalties(1).then((r) => {
      console.log("royalties token for ", r)
      console.log('royalties % for ', r)
    })
  }

  useEffect(() => {
    getContract()
    // getRoyalties()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div>
      <p>Gallery Name - {name}</p>
      <p>Gallery Symbol - {symbol}</p>
      <Link to='/gallery'>
        <div className='img-grid'>
          {images &&
            images.map((image) => (
              <div className='img-wrap' key={image.id}>
                <img src={image.image} alt='preview-image' />
              </div>
            ))}
        </div>
      </Link>
    </div>
  )
}

export default GalleryPreview
