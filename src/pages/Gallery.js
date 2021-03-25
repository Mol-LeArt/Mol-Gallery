import React, { useState, useEffect, useContext } from 'react'
import { projectFirestore } from '../firebase/config'
import { Link, useLocation } from 'react-router-dom'
import ImageGrid from '../comps/ImageGrid'
import { ethers } from 'ethers'
import ABI from '../comps/MOLGAMMA_ABI'
import { GlobalContext, CommunityContext } from '../GlobalContext'
import './Gallery.css'

const Gallery = () => {
  const [uris, setUris] = useState({})
  const [isOwner, toggleIsOwner] = useState(false)
  const gallery = 'personal'

  const { account } = useContext(GlobalContext)

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

  const getOwner = async () => {
    _contract.creator().then((creator) => {
        const c = creator.toLowerCase()
        if (c === account) {
          toggleIsOwner(true)
        } else {
          toggleIsOwner(false)
        }
      }).catch((e) => console.log(e))
  }

  const [galleryName, setGalleryName] = useState('')
  const [galleryDesc, setGalleryDesc] = useState('')
  const [socialToken, setSocialToken] = useState('')
  const [royaltiesType, setRoyaltiesType] = useState(null)
  const [royalties, setRoyalties] = useState(0)
  const [compliance, setCompliance] = useState(false)

  async function getGallery() {
    const query = await projectFirestore
      .collection('gallery')
      .where('contract', '==', contract)
      .get()
    if (query) {
      query.forEach((doc) => {
        setGalleryName(doc.data().galleryName)
        setGalleryDesc(doc.data().galleryDesc)
        setSocialToken(doc.data().socialToken)
        setRoyaltiesType(doc.data().royaltiesType)
        setRoyalties(doc.data().royalties)
        setCompliance(doc.data().compliance)
      })
    }
  }

  useEffect(() => {
    getGallery()
    getUri()
    getOwner()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div class='mx-auto px-4 my-5 max-w-5xl space-y-2 font-mono flex-col justify-center'>
      <h1 className='gallery-title'>{galleryName}</h1>
      <p className='gallery-desc'>{galleryDesc}</p>
      <br />
      <p className='gallery-desc'>Social Token: {socialToken}</p>
      <p className='gallery-desc'>Type of Royalty: {royaltiesType}</p>
      <p className='gallery-desc'>Royalties %: {royalties}</p>
      <p className='gallery-desc'>License: {compliance ? 'Complied' : ''}</p>
      <Link
        to={{
          pathname: '/mint',
          state: { gallery: gallery, contract: contract },
        }}
      >
        {isOwner && <button>Upload Image</button>}
      </Link>
      <ImageGrid origin={gallery} contract={contract} uris={uris} />
    </div>
  )
}

export default Gallery
