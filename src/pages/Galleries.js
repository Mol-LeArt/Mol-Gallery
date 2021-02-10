import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { projectFirestore } from '../firebase/config'
// import ImageGrid from '../comps/ImageGrid'
import GalleryPreview from '../comps/GalleryPreview'

import './Galleries.css'

const Galleries = () => {
  const [contracts, setContracts] = useState([])

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
      <h1 className='galleries-title'>Galleries</h1>
      <p className='galleries-desc'>Here are the galleries on Mol! </p>
      {contracts &&
        contracts.map((contract) => (
          <div key={contract}>
            <Link
              to={{
                pathname: `/gallery/${contract}`,
                state: { contract: contract },
              }}
            >
              <GalleryPreview contract={contract} />
            </Link>
          </div>
        ))}
    </div>
  )
}

export default Galleries
