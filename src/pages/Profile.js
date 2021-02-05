import React from 'react'
import ImageGrid from '../comps/ImageGrid'
import './Commons.css'

const Profile = () => {
  // const source = "nft"
  const gallery = 'commons'
  return (
    <div>
      <h1 className='commons-title'>Profile</h1>
      <p className='commons-desc'>
        This is your personal page! Below are your royalties NFTs that you may gift or sell!
      </p>

      <ImageGrid gallery={gallery} />
    </div>
  )
}

export default Profile
