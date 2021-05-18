import React, { useState, useEffect, useContext } from 'react'
import { useLocation } from 'react-router-dom'
import Mint from '../comps/Mint'
import ImageUpload from '../comps/ImageUpload'
import { GlobalContext } from '../GlobalContext'

const MintNFT = () => {
  // ----- useState
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [sale, setSale] = useState('')
  const [ethPrice, setEthPrice] = useState('')
  const [split, setSplit] = useState('')
  const [firstCollaborator, setFirstCollaborator] = useState('')
  const [firstCollaboratorWeight, setFirstCollaboratorWeight] = useState('')
  const [secondCollaborator, setSecondCollaborator] = useState('')
  const [secondCollaboratorWeight, setSecondCollaboratorWeight] = useState('')
  const [remix, setRemix] = useState(false)
  const [remixCreator, setRemixCreator] = useState('')
  const [remixCreatorWeight, setRemixCreatorWeight] = useState('')
  const [img, setImg] = useState('')
  const [compliance, setCompliance] = useState(false)
  const [nft, setNft] = useState(null)
  
  // ----- useContext
  const { account } = useContext(GlobalContext)

  // ----- React router config
  const location = useLocation()
 
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
        img: img,
        sale: Number(sale),
        ethPrice: ethPrice,
        split: Number(split),
        firstCollaborator: remixCreator ? remixCreator : firstCollaborator,
        firstCollaboratorWeight: remixCreatorWeight
          ? Number(remixCreatorWeight)
          : Number(firstCollaboratorWeight),
        secondCollaborator: secondCollaborator,
        secondCollaboratorWeight: Number(secondCollaboratorWeight),
        compliance: compliance,
        remix: remix,
      }
      console.log(nft)
      setNft(nft)
    } else {
      alert('You must accept!')
    }
  }

  useEffect(() => {
    if (location.state.creator) {
      setRemixCreator(location.state.creator)

      if (split === '') {
        setRemixCreatorWeight('N/A')
      } else {
        setRemixCreatorWeight((0.1 / split) * 100 * 100)
      }
    }
  }, [split])

  return (
    <div class='mx-auto px-4 my-10 max-w-sm space-y-10 font-mono'>
      <div class='text-5xl font-bold text-center'>Mint NFT</div>

      <form class='space-y-4' onSubmit={onSubmit}>
        {remixCreator && (
          <div class='text-indigo-500'>
            Remix mints automatically distribute 10% to the original creator.
          </div>
        )}
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
          <div>Put on sale?</div>
          <input
            class='border border-gray-400 py-2 px-4 w-full rounded focus:outline-none focus:border-gray-900 max-w-sm'
            type='text'
            value={sale}
            onChange={(e) => setSale(e.target.value)}
            placeholder='Yes = 1, no = 0'
          />
        </div>

        <div>
          <div>Price in Ξ</div>
          <input
            class='border border-gray-400 py-2 px-4 w-full rounded focus:outline-none focus:border-gray-900 max-w-sm'
            type='text'
            value={ethPrice}
            onChange={(e) => setEthPrice(e.target.value)}
            placeholder='Enter amount in Ξ'
          />
        </div>

        <div>
          <div>Split</div>
          <input
            class='border border-gray-400 py-2 px-4 w-full rounded focus:outline-none focus:border-gray-900 max-w-sm'
            type='text'
            value={split}
            onChange={(e) => setSplit(e.target.value)}
            placeholder='Enter % for collaborators'
          />
        </div>

        <div>
          <div>First Collaborator</div>
          {remixCreator && (
            <div class='text-indigo-500 text-sm my-2'>
              Original creator is automatically filled in as first collaborator
            </div>
          )}
          <input
            class='border border-gray-400 py-2 px-4 w-full rounded focus:outline-none focus:border-gray-900 max-w-sm'
            type='text'
            value={remixCreator ? remixCreator : firstCollaborator}
            onChange={(e) => setFirstCollaborator(e.target.value)}
            placeholder='Enter address of first collaborator'
          />
        </div>

        <div>
          <div>First Collaborator %</div>
          {remixCreator && (
            <div class='text-indigo-500 text-sm my-2'>
              Original creator always receives 10% regardless of split %
            </div>
          )}
          <input
            class='border border-gray-400 py-2 px-4 w-full rounded focus:outline-none focus:border-gray-900 max-w-sm'
            type='text'
            value={
              remixCreatorWeight ? remixCreatorWeight : firstCollaboratorWeight
            }
            onChange={(e) => setFirstCollaboratorWeight(e.target.value)}
            placeholder='Enter % for first collaborator'
          />
        </div>

        <div>
          <label htmlFor='split'>Second Collaborator</label>
          <br />
          <input
            class='border border-gray-400 py-2 px-4 w-full rounded focus:outline-none focus:border-gray-900 max-w-sm'
            type='text'
            value={secondCollaborator}
            onChange={(e) => setSecondCollaborator(e.target.value)}
            placeholder='Enter address of second collaborator'
          />
        </div>

        <div>
          <label htmlFor='split'>Second Collaborator %</label>
          <br />
          <input
            class='border border-gray-400 py-2 px-4 w-full rounded focus:outline-none focus:border-gray-900 max-w-sm'
            type='text'
            value={secondCollaboratorWeight}
            onChange={(e) => setSecondCollaboratorWeight(e.target.value)}
            placeholder='Enter % for second collaborator'
          />
        </div>

        <div>
          <ImageUpload getFileForUpload={getFileForUpload} />
        </div>

        <div>
          {nft && <Mint nft={nft} />}
        </div>

        <div class='flex justify-center items-center space-x-2'>
          <input
            type='Checkbox'
            checked={remix}
            onChange={(e) => setRemix(e.target.checked)}
          />
          <span>Allow for remix?</span>
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
