import React from 'react'

const Arcade = () => {
  
  
  return (
    <div class='mx-auto px-4 my-16 max-w-2xl space-y-6 font-mono flex-col justify-center'>
      <h1 class='text-7xl font-bold text-center'>Arcade</h1>
      <div>
        <div class='mt-14 mb-5 text-4xl font-bold text-semibold text-center'>
          Redeem Ξ
        </div>
        <div class='pb-5 text-center text-gray-400'>
          Trade Commons coins for Ξ
        </div>
        <div class='flex space-x-4'>
          <input
            class='flex-2 border border-gray-400 py-2 px-4 w-full rounded focus:outline-none focus:border-gray-900 max-w-sm tracking-wider'
            type='text'
            // value={artistToAdd}
            // onChange={(e) => setArtistToAdd(e.target.value)}
            placeholder='Amount'
          />
          <button class='flex-1 py-2 px-4 text-white bg-gray-800 hover:bg-gray-500 w-max rounded-md tracking-wider'>
            Redeem
          </button>
        </div>
      </div>

      <div>
        <div class='mt-14 mb-5 text-4xl font-bold text-semibold text-center'>
          Basic
        </div>
        <div class='pb-5 text-center text-gray-400'>
          Smart contract and current Ξ balance
        </div>
        <div>
          <input
            class='flex-1 border border-gray-400 py-2 px-4 w-full rounded focus:outline-none focus:border-gray-900 max-w-sm tracking-wider'
            type='text'
            // value={artistToAdd}
            // onChange={(e) => setArtistToAdd(e.target.value)}
            placeholder='Enter artist address'
          />
          <button class='flex-1 py-2 px-4 text-white bg-red-800 hover:bg-red-500 w-max rounded-md tracking-wider'>
            addToWhitelist
          </button>
        </div>
        <div>
          <input
            class='flex-1 border border-gray-400 py-2 px-4 w-full rounded focus:outline-none focus:border-gray-900 max-w-sm tracking-wider'
            type='text'
            // value={artistToRemove}
            // onChange={(e) => setArtistToRemove(e.target.value)}
            placeholder='Enter artist address'
          />
          <button class='flex-1 py-2 px-4 text-white bg-red-800 hover:bg-red-500 w-max rounded-md tracking-wider'>
            removeFromWhitelist
          </button>
        </div>
      </div>
    </div>
  )
}

export default Arcade
