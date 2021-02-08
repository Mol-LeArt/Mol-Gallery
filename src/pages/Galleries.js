import React, { useEffect } from 'react'
// import { Link } from 'react-router-dom'
import { projectFirestore } from '../firebase/config'
// import ImageGrid from '../comps/ImageGrid'
import { ethers } from 'ethers'
import ABI from '../comps/MOLGAMMA_ABI'

import './Galleries.css'

const Galleries = () => {
//   const [contracts, setContracts] = useState([])
//   const [name, setName] = useState('')
// const [symbol, setSymbol] = useState('')
// const [uri, setUri] = useState([])

  // ----- Smart Contract Interaction Config
  const provider = new ethers.providers.Web3Provider(window.ethereum, 'any')
  const signer = provider.getSigner()

  const importGalleries = async () => {
    const contractArray = []
    const galleries = []
    const query = await projectFirestore.collection('gallery').get()

    query.forEach((doc) => {
      let data = doc.data().contract
      const contract = new ethers.Contract(doc.data().contract, ABI, signer)

      contract.name().then(n => {
          console.log(n)

          contract
            .symbol()
            .then((s) => {
              console.log(s)

                    contract
                      .getAllTokenURI()
                      .then((uri) => {
                        // download file and get image value
                        // const fileDownloadUrl = URL.createObjectURL(uri)
                        console.log(uri)
                        console.log("n + s + uri = ", n, s, uri)
                        const gallery = {
                            name: n,
                            symbol: s, 
                            images: uri
                        }
                        console.log(gallery)
                        galleries.push(gallery)
                        console.log(galleries)
                      })
                      .catch((e) => {
                        console.log(e)
                      })
            })
            .catch((e) => {
              console.log(e)
            })
      }).catch(e => {
          console.log(e)
      })

      
      

      
      
      contractArray.push(data)
      console.log(contractArray)
    //   setContracts(contractArray)
    })
  }

  //   const importNft = async (account) => {
  //     const imgArray = []
  //     const query = await projectFirestore
  //       .collection('nft')
  //       .where('account', '==', account)
  //       .get()

  //     query.forEach((doc) => {
  //         let data = { ...doc.data(), id: doc.id }
  //       imgArray.push(data)
  //       console.log(data)
  //         setImages(imgArray)
  //     })
  //   }


  useEffect(() => {
    importGalleries()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div>
      <h1 className='galleries-title'>Galleries</h1>
      <p className='galleries-desc'>Here are the galleries on Mol! </p>

      {/* <div>
        {contracts.map((contract) => (
          <div>{contract}</div>
        ))}
      </div> */}
    </div>
  )
}

export default Galleries
