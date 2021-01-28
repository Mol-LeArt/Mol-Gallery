import React, { useState } from 'react'
import { projectFirestore } from '../firebase/config';
import UploadingGallery from '../comps/UploadingGallery';
import { Link } from "react-router-dom";
import './OpenGallery.css'

const OpenGallery = ({ account }) => {
    const [galleryName, setGalleryName] = useState('')
    const [galleryDesc, setGalleryDesc] = useState('')
    const [tokenName, setTokenName] = useState('')
    const [tokenSymbol, setTokenSymbol] = useState('')
    const [socialToken, setSocialToken] = useState('')
    const [royaltiesType, setRoyaltiesType] = useState(null)
    const [royalties, setRoyalties] = useState(0)
    const [compliance, setCompliance] = useState(false)
    const [gallery, setGallery] = useState(null)
    const [error, setError] = useState(null)

    // const { docs } = useFirestore('gallery')  
    async function checkAccount() {
        const query = await projectFirestore
            .collection('gallery')
            .where('account', '==', account).get()
        if (query) {
            setError('Only one gallery per wallet, for now')
            query.forEach((doc) => {
                console.log(account)
                console.log(doc.data())
            })
        }
        // console.log(account, query)
    }
    
    checkAccount()

    const onSubmit = e => {
        e.preventDefault();

        if (compliance) {
            const gallery = {
                account: account,
                galleryName: galleryName,
                galleryDesc: galleryDesc,
                tokenName: tokenName,
                tokenSymbol: tokenSymbol,
                socialToken: socialToken,
                royaltiesType: royaltiesType,
                royalties: royalties,
                compliance: compliance,
            }
            setGallery(gallery)
        } else {
            alert('You must accept!')
        }
    }

    const onChangeValue = e => {
        if (e.target.value === "flat") {
            setRoyaltiesType("flat")
        } else {
            setRoyaltiesType("decay")
        }
    }

    return (
      <div className='open-gallery'>
        <h1 className='open-gallery-title'>Open a Gallery</h1>
        <p>Describe the steps to opening an NFT!</p>

        <form onSubmit={onSubmit}>
          <div>
            <label>Name of Gallery</label>
            <br />
            <input
              type='text'
              value={galleryName}
              onChange={(e) => setGalleryName(e.target.value)}
              placeholder='Enter Gallery Name'
            />
          </div>

          <div>
            <label>Description</label>
            <br />
            <input
              type='text'
              value={galleryDesc}
              onChange={(e) => setGalleryDesc(e.target.value)}
              placeholder='Enter Gallery Description'
            />
          </div>

          <div>
            <label>ERC721 Token Name</label>
            <br />
            <input
              type='text'
              value={tokenName}
              onChange={(e) => setTokenName(e.target.value)}
              placeholder='Enter Token Name'
            />
          </div>

          <div>
            <label>ERC721 Token Symbol</label>
            <br />
            <input
              type='text'
              value={tokenSymbol}
              onChange={(e) => setTokenSymbol(e.target.value)}
              placeholder='Enter Token Symbol'
            />
          </div>

          <div>
            <label>Social Token</label>
            <br />
            <input
              type='text'
              value={socialToken}
              onChange={(e) => setSocialToken(e.target.value)}
              placeholder='Enter Any Social Token'
            />
          </div>

          <div>
            <p>Describe flat royalties vs decaying roayaltie</p>
            <div onChange={onChangeValue} className='royalties'>
              <input type='radio' name='royalties' value='flat' /> Flat
              Royalties
              <input type='radio' name='royalties' value='decay' /> Decaying
              Royalties
            </div>
          </div>

          <div>
            <label>Royalties</label>
            <br />
            <input
              type='text'
              value={royalties}
              onChange={(e) => setRoyalties(e.target.value)}
              placeholder='Enter Royalties %'
            />
          </div>

          <div>
            <input
              type='Checkbox'
              checked={compliance}
              onChange={(e) => setCompliance(e.target.checked)}
            />
            <label>I agree to XYZ.</label>
          </div>

          {gallery && <UploadingGallery gallery={gallery} />}

          <div>
            <button>Submit</button>
          </div>
        </form>
        <div>
          <Link to='/gallery' >
            <button>Visit Your Gallery</button>
          </Link>
        </div>

        {error && <Link to='/gallery' />}
      </div>
    )
}

export default OpenGallery
