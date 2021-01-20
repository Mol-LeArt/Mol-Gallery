import React, { useState } from 'react'
import { Link } from 'react-router-dom';
import UploadingGallery from '../comps/UploadingGallery';

import './OpenGallery.css'
import UploadNFT from './UploadNFT';

const OpenGallery = () => {
    const [galleryName, setGalleryName] = useState('')
    const [galleryDesc, setGalleryDesc] = useState('')
    const [tokenName, setTokenName] = useState('')
    const [tokenSymbol, setTokenSymbol] = useState('')
    const [royaltiesType, setRoyaltiesType] = useState(null)
    const [royalties, setRoyalties] = useState(0)
    const [compliance, setCompliance] = useState(false)
    const [gallery, setGallery] = useState(null)

    const onSubmit = e => {
        e.preventDefault();

        if (compliance) {
            const gallery = {
                galleryName: galleryName,
                galleryDesc: galleryDesc,
                tokenName: tokenName,
                tokenSymbol: tokenSymbol,
                royaltiesType: royaltiesType,
                royalties: royalties,
            }
            setGallery(gallery)
            console.log(gallery)
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
        <div className="open-gallery">
            <h1 className="open-gallery-title">Open a Gallery</h1>
            <p>Describe the steps to opening an NFT!</p>

            <form onSubmit={onSubmit}>
                <div>  
                    <label>Name of Gallery</label>
                    <br/>
                    <input type="text" value={galleryName} onChange={(e) => setGalleryName(e.target.value)} placeholder="Enter Gallery Name"/>
                </div>

                <div>
                    <label>Description</label>
                    <br/>
                    <input type="text" value={galleryDesc} onChange={(e) => setGalleryDesc(e.target.value)} placeholder="Enter Gallery Description"/>
                </div>

                <div>
                    <label>ERC721 Token Name</label>
                    <br/>
                    <input type="text" value={tokenName} onChange={(e) => setTokenName(e.target.value)} placeholder="Enter Token Name"/>
                </div>

                <div>
                    <label>ERC721 Token Symbol</label>
                    <br/>
                    <input type="text" value={tokenSymbol} onChange={(e) => setTokenSymbol(e.target.value)} placeholder="Enter Token Symbol"/>
                </div>

                <div>
                    <p>Describe flat royalties vs decaying roayaltie</p>
                    <div onChange={onChangeValue} className="royalties">
                        <input type="radio" name="royalties" value="flat"/> Flat Royalties
                        <input type="radio" name="royalties" value="decay"/> Decaying Royalties
                    </div>
                </div>            

                <div>
                    <label >Royalties</label>
                    <br/>
                    <input type="text" value={royalties} onChange={(e) => setRoyalties(e.target.value)} placeholder="Enter Royalties %"/>
                </div>

                <div>
                    <input type="Checkbox" checked={compliance} onChange={(e) => setCompliance(e.target.checked)}/>
                    <label >I agree to XYZ.</label>
                </div>
                
                {gallery && <UploadingGallery gallery={gallery}/>} 
                
                <div >
                    <button >Submit</button>
                </div>
            </form>
        </div>
    )
}

export default OpenGallery
