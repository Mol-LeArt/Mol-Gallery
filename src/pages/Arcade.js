import React from 'react'

const Arcade = () => {
  
  
  return (
    <div>
      <div>
        <h2>Which is your favorite NFT?</h2>
        <div>
          <input
            type='text'
            // value={artistToAdd}
            // onChange={(e) => setArtistToAdd(e.target.value)}
            placeholder='Enter artist address'
          />
          <button>addToWhitelist</button>
        </div>
        <div>
          <input
            type='text'
            // value={artistToRemove}
            // onChange={(e) => setArtistToRemove(e.target.value)}
            placeholder='Enter artist address'
          />
          <button>removeFromWhitelist</button>
        </div>
      </div>
    </div>
  )
}

export default Arcade
