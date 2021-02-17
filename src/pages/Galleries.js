import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { projectFirestore } from '../firebase/config'
// import ImageGrid from '../comps/ImageGrid'
import GalleryPreview from '../comps/GalleryPreview'

import './Galleries.css'

const Galleries = () => {
  const [contracts, setContracts] = useState([])

  // ----- Get Contract from Firestore
  const importGalleries = async () => {
    const contracts = []
    const query = await projectFirestore.collection('gallery').get()

    query.forEach((doc) => {
      let data = doc.data().contract
      contracts.push(data)
    })

    setContracts(contracts)
  }

  useEffect(() => {
    importGalleries()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div>
      <h1 className='galleries-title'>Mol Galleries</h1>
      <p className='galleries-desc'>
        Each member of the Mol LeArt DAO gets her own gallery for minting ERC721
        NFTs
         <br />
        Through the gallery smart contract, memebers can (1) airdrop social currencies, (2) mint royalties token,
        and (3) pick a royalties scheme.
      </p>
      <br />
      <div>
        {contracts &&
          contracts.map((contract) => (
            <div key={contract}>
              <Link
                to={{
                  pathname: `/gallery/${contract}`,
                  state: { contract: contract },
                }}
                style={{ textDecoration: 'none' }}
              >
                <GalleryPreview contract={contract} />
              </Link>
            </div>
          ))}
      </div>
    </div>
  )
}

export default Galleries
