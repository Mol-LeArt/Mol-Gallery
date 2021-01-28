import React, { useState, useEffect } from 'react'
import useFirestore from '../hooks/useFirestore'
import { projectFirestore } from '../firebase/config'
import { Link } from 'react-router-dom';
import ImageGrid from '../comps/ImageGrid';
import './Gallery.css'

const Gallery = ({ account }) => {
  const source = "gallery"
  const gallery = "personal"

  const [galleryName, setGalleryName] = useState('')
  const [galleryDesc, setGalleryDesc] = useState('')
  const [tokenName, setTokenName] = useState('')
  const [tokenSymbol, setTokenSymbol] = useState('')
  const [socialToken, setSocialToken] = useState('')
  const [royaltiesType, setRoyaltiesType] = useState(null)
  const [royalties, setRoyalties] = useState(0)
  const [compliance, setCompliance] = useState(false)
  // console.log(account)
  
  async function checkAccount() {
    const query = await projectFirestore
      .collection('gallery')
      .where('account', '==', account)
      .get()
    if (query) {
      query.forEach((doc) => {
        console.log(doc.data())
        setGalleryName(doc.data().galleryName)
        setGalleryDesc(doc.data().galleryDesc)
        setTokenName(doc.data().tokenName)
        setTokenSymbol(doc.data().tokenSymbol)
        setSocialToken(doc.data().socialToken)
        setRoyaltiesType(doc.data().royaltiesType)
        setRoyalties(doc.data().royalties)
        setCompliance(doc.data().compliance)
      })
    }
    // console.log(account, query)
  }

  useEffect(() => {
    checkAccount()
  }, [])
  

  return (
    <div>
      <h1 className='gallery-title'>{galleryName}</h1>
      <p className='gallery-desc'>{galleryDesc}</p>
      <p className='gallery-desc'>{tokenName}</p>
      <p className='gallery-desc'>{tokenSymbol}</p>
      <p className='gallery-desc'>{socialToken}</p>
      <p className='gallery-desc'>{royaltiesType}</p>
      <p className='gallery-desc'>{royalties}</p>
      <p className='gallery-desc'>{compliance?"Complied":""}</p>

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

export default Gallery
