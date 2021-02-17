import React from 'react'
import { projectFirestore, timeStamp } from '../firebase/config'


const UploadVault = ({ contract, owners }) => {
  const collectionRef = projectFirestore.collection('vault')
  const createdAt = timeStamp()
  const dict = { contract: contract, owners: owners, createdAt: createdAt }
  collectionRef.add(dict)
  
  return (
    <div>
      
    </div>
  )
}

export default UploadVault
