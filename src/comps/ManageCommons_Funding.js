import React, { useState, useEffect } from 'react'
import { ethers } from 'ethers'
import ABI from './MOLCOMMONS_ABI'

const ManageCommons_Funding = ({ signer, commons }) => {
  const [onChainfundingGoal, setOnChainfundingGoal] = useState('')
  const [fundingPerc, setFundingPerc] = useState('')
  const [fundingCollectors, setFundingCollectors] = useState([])
  const [fundingCollectorsPerc, setFundingCollectorsPerc] = useState([])

  const getFundingGoal = async () => {
    try {
      const _contract = new ethers.Contract(commons, ABI, signer)
      _contract.fundingGoal().then((data) => {
        const b = ethers.utils.formatEther(data)
        setOnChainfundingGoal(b)
      })
    } catch (e) {
      console.log(e)
    }
  }

  const getFundingPerc = async () => {
    try {
      const _contract = new ethers.Contract(commons, ABI, signer)
      _contract.fundingGoalPerc().then((data) => {
        const b = ethers.utils.formatUnits(data, 'wei')
        // console.log(data, b, 100 - parseInt(b, 10))
        setFundingPerc(100 - parseInt(b, 10))
      })
    } catch (e) {
      console.log(e)
    }
  }

  const getFundingCollectors = async () => {
    try {
      const _contract = new ethers.Contract(commons, ABI, signer)
      _contract.getFundingCollectors().then((data) => {
        setFundingCollectors(data)
        getFundingCollectorsPerc(data)
      })
    } catch (e) {
      console.log(e)
    }
  }

  const getFundingCollectorsPerc = async (collectors) => {
    const percArray = []
    try {
      const _contract = new ethers.Contract(commons, ABI, signer)
      if (collectors) {
        for (var i = 0; i < collectors.length; i++) {
          _contract.fundingCollectorPerc(collectors[i]).then((data) => {
            const b = ethers.utils.formatUnits(data, 'wei')
            console.log(b)
            percArray.push(b)
            setFundingCollectorsPerc([...percArray])
          })
        }
      }
    } catch (e) {
      console.log(e)
    }
  }

  useEffect(() => {
    getFundingGoal()
    getFundingPerc()
    getFundingCollectors()
    getFundingCollectorsPerc()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  
  return (
    <div class='space-y-2'>
      <div class='mt-14 mb-5 text-4xl font-bold text-semibold text-center'>
        Funding Goal
      </div>
      <div class='pb-5 text-center text-gray-400'>
        Present progress in chart 
      </div>
      <div>Funding goal: {onChainfundingGoal} Ξ</div>
      <div>Percentage funded: {fundingPerc} %</div>
      <div>
        Funding Collectors:
        <div>
          {fundingCollectors.map((collector, index) => (
            <p key={index}>{collector}</p>
          ))}
        </div>
      </div>
      <div>
        % per Funding Collectors:
        <div>
          {fundingCollectorsPerc.map((collector, index) => (
            <p key={index}>{collector}</p>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ManageCommons_Funding
