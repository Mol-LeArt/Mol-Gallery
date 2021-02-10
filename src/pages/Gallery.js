import React, { useState, useEffect } from 'react'
import { projectFirestore } from '../firebase/config'
import { Link, useLocation } from 'react-router-dom'
import ImageGrid from '../comps/ImageGrid'
import { ethers } from 'ethers'
import ABI from '../comps/MOLGAMMA_ABI'

import './Gallery.css'

const Gallery = ({ account }) => {
  const [uris, setUris] = useState({})
  const gallery = 'personal'

  // React Router Config
  const location = useLocation()
  const contract = location.state.contract

  // ----- Smart Contract Interaction Config
  const provider = new ethers.providers.Web3Provider(window.ethereum, 'any')
  const signer = provider.getSigner()
  const _contract = new ethers.Contract(contract, ABI, signer)

  const getUri = async () => {
      _contract.getAllTokenURI().then((uri) => {
        setUris(uri)
      }).catch(e => console.log(e))
  }

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
        setTokenName(doc.data().tokenName) // from preview
        setTokenSymbol(doc.data().tokenSymbol) // from preview
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
    getUri()
    // console.log(contract)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div>
      <h1 className='gallery-title'>{galleryName}</h1>
      <p className='gallery-desc'>{galleryDesc}</p>
      <br />
      <p className='gallery-desc'>Social Token: {socialToken}</p>
      <p className='gallery-desc'>Type of Royalty: {royaltiesType}</p>
      <p className='gallery-desc'>Royalties %: {royalties}</p>
      <p className='gallery-desc'>License: {compliance ? 'Complied' : ''}</p>
      <Link
        to={{
          pathname: '/mintNft',
          state: { gallery: gallery },
        }}
      >
        <button>Upload Image</button>
      </Link>
      <ImageGrid contract={contract} uris={uris}/>
    </div>
  )
}

export default Gallery
