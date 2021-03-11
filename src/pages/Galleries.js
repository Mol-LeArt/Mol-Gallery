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
    <div class='mx-auto px-4 my-16 max-w-5xl space-y-6 font-mono flex-col justify-center'>
      <h1 class='text-7xl font-bold text-center'>Galleries</h1>
      <div class='max-w-xl mx-auto text-center'>
        Each member gets a personal contract for minting ERC721
        NFTs
        <br />
        Memebers can (1) airdrop social currencies, (2) mint royalties token, and (3) pick a royalties scheme.
      </div>
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
