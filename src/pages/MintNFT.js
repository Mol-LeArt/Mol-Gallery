import React, { useState } from 'react'
import { useHistory, useLocation } from "react-router-dom";
import Mint from '../comps/Mint'
import ImageUpload from '../comps/ImageUpload'
import './MintNFT.css'

const MintNFT = ({ account }) => {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [img, setImg] = useState(null)
  const [compliance, setCompliance] = useState(false)
  const [metadata, setMetadata] = useState(null)

  // ***** React Router ***** //
  const history = useHistory()
  const location = useLocation()
  const gallery = location.state.gallery

  const getFileForUpload = (img) => {
    setImg(img)
  }

  const onSubmit = (e) => {
    e.preventDefault()

    if (compliance) {
      const nft = {
        account: account,
        name: title,
        description: description,
        compliance: compliance,
        gallery: gallery,
      }
      setMetadata(nft)
    } else {
      alert('You must accept!')
    }
  }

  const handleClick = (e) => {
    history.push('/')
  }

  // ----- Console Tests 
  // console.log(metadata, img)
  // console.log('account from App.js - ' + account)
  // console.log('collection from Commons.js - ' + gallery)
  // console.log("UploadNFT gallery variable " + gallery)

  return (
    <div className='from-in-uploadnft'>
      <h1 className='upload-nft-title'>Mint NFT</h1>
      <p>Describe the steps to uploading an NFT!</p>

      <form onSubmit={onSubmit}>
        <div>
          <label htmlFor='text'>Title</label>
          <br />
          <input
            type='text'
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder='Enter Title'
          />
        </div>

        <div>
          <label htmlFor='description'>Description</label>
          <br />
          <input
            type='text'
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder='Enter Description'
          />
        </div>

        <ImageUpload getFileForUpload={getFileForUpload} />

        {metadata && (
          <Mint metadata={metadata} img={img} account={account}/>
        )}

        <div>
          <input
            type='Checkbox'
            checked={compliance}
            onChange={(e) => setCompliance(e.target.checked)}
          />
          <label>I agree to XYZ.</label>
        </div>

        <div>
          <button>Mint</button>
        </div>
      </form>
      <div>
        <button onClick={handleClick}>Back to Commons</button>
      </div>
    </div>
  )
}

export default MintNFT
