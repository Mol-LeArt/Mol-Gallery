import React, { useState, useEffect } from 'react'
// import useFirestore from '../hooks/useFirestore'
import { projectFirestore } from '../firebase/config'
import { Link } from 'react-router-dom';
import ImageGrid from '../comps/ImageGrid';
import './Gallery.css'

const Gallery = ({ account }) => {
  // const source = "gallery"
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  

  return (
    <div>
      <h1 className='gallery-title'>{galleryName}</h1>
      <p className='gallery-desc'>{galleryDesc}</p>
      <br/>
      <p className='gallery-desc'>Token Name: {tokenName}</p>
      <p className='gallery-desc'>Token Symbol: {tokenSymbol}</p>
      <p className='gallery-desc'>Social Token: {socialToken}</p>
      <p className='gallery-desc'>Type of Royalty: {royaltiesType}</p>
      <p className='gallery-desc'>Royalties %: {royalties}</p>
      <p className='gallery-desc'>License: {compliance?"Complied":""}</p>

      <Link
        to={{
          pathname: '/mintNft',
          state: { gallery: gallery },
        }}
      >
        <button>Upload Image</button>
      </Link>
      <ImageGrid gallery={gallery}/>
    </div>
  )
}

export default Gallery
