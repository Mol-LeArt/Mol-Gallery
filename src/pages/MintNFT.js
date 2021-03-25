import React, { useState, useContext } from 'react'
import Mint from '../comps/Mint'
import ImageUpload from '../comps/ImageUpload'
import { GlobalContext } from '../GlobalContext'

const MintNFT = () => {
  // ----- useState
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [sale, setSale] = useState('')
  const [ethPrice, setEthPrice] = useState('')
  const [coinPrice, setCoinPrice] = useState('')
  const [img, setImg] = useState(null)
  const [compliance, setCompliance] = useState(false)
  const [metadata, setMetadata] = useState(null)

  // ----- useContext
  const { account } = useContext(GlobalContext)

  const getFileForUpload = (img) => {
    setImg(img)
  }

  const onSubmit = (e) => {
    e.preventDefault()

    if (compliance) {
      const nft = {
        account: account,
        title: title,
        description: description,
        compliance: compliance,
      }
      setMetadata(nft)
    } else {
      alert('You must accept!')
    }
  }

  return (
    <div class='mx-auto px-4 my-10 max-w-sm space-y-10 font-mono'>
      <div class='text-5xl font-bold text-center'>Mint NFT</div>

      <form class='space-y-4' onSubmit={onSubmit}>
        <div>
          <div>Title</div>
          <input
            class='border border-gray-400 py-2 px-4 w-full rounded focus:outline-none focus:border-gray-900'
            type='text'
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder='Enter Title'
          />
        </div>

        <div>
          <div>Description</div>
          <input
            class='border border-gray-400 py-2 px-4 w-full rounded focus:outline-none focus:border-gray-900 max-w-sm'
            type='text'
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder='Enter Description'
          />
        </div>

        <div>
          <label htmlFor='sale'>Put on sale?</label>
          <br />
          <input
            class='border border-gray-400 py-2 px-4 w-full rounded focus:outline-none focus:border-gray-900 max-w-sm'
            type='text'
            value={sale}
            onChange={(e) => setSale(e.target.value)}
            placeholder='Yes = 1, no = 0'
          />
        </div>

        <div>
          <label htmlFor='price'>Price in Ξ</label>
          <br />
          <input
            class='border border-gray-400 py-2 px-4 w-full rounded focus:outline-none focus:border-gray-900 max-w-sm'
            type='text'
            value={ethPrice}
            onChange={(e) => setEthPrice(e.target.value)}
            placeholder='Enter amount in Ξ'
          />
        </div>

        <div>
          <label htmlFor='coins'>No. of Coins</label>
          <br />
          <input
            class='border border-gray-400 py-2 px-4 w-full rounded focus:outline-none focus:border-gray-900 max-w-sm'
            type='text'
            value={coinPrice}
            onChange={(e) => setCoinPrice(e.target.value)}
            placeholder='Enter amount in coins'
          />
        </div>

        <div>
          <ImageUpload getFileForUpload={getFileForUpload} />
        </div>

        <div>
          {metadata && (
            <Mint
              metadata={metadata}
              sale={sale}
              ethPrice={ethPrice}
              coinPrice={coinPrice}
              img={img}
            />
          )}
        </div>

        <div class='flex justify-center items-center space-x-2'>
          <input
            type='Checkbox'
            checked={compliance}
            onChange={(e) => setCompliance(e.target.checked)}
          />
          <span>I agree to XYZ.</span>
        </div>

        <div class='flex justify-center'>
          <button class='py-2 px-4 text-white bg-gray-800 hover:bg-gray-500 w-max rounded-md'>
            Mint
          </button>
        </div>
      </form>
    </div>
  )
}

export default MintNFT
