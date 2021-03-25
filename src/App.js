import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import { ethers } from 'ethers'
import Community from './pages/Community'
import SelectCommunity from './pages/SelectCommunity'
import { GlobalContext } from './GlobalContext'
import { projectFirestore } from './firebase/config'
require('dotenv').config()

function App() {
  const [account, setAccount] = useState(null)
  // const [hasGallery, setHasGallery] = useState(false)
  const [vaultArry, setVaultArry] = useState([])

  // ----- Smart Contract Interaction Config
  const provider = new ethers.providers.Web3Provider(window.ethereum, 'any')
  provider.on('network', (newNetwork, oldNetwork) => {
    if (oldNetwork) {
      window.location.reload()
    }
  })

  const getAccount = async () => {
    window.ethereum
      .request({ method: 'eth_requestAccounts' })
      .then((result) => {
        console.log('Account connected - ' + result[0])
        setAccount(result[0])
        // getGallery(result[0])
      })
  }

  // const getGallery = async (account) => {
  //   const query = await projectFirestore
  //     .collection('gallery')
  //     .where('account', '==', account)
  //     .get()

  //   if (!query.empty) {
  //     setHasGallery(true)
  //   }
  // }

  const getAllVaults = async () => {
    const vaultArray = []
    const query = await projectFirestore.collection('vault').get()
    query.forEach((doc) => {
      const vault = {
        contract: doc.data().contract,
        name: doc.data().name,
        chain: doc.data().chain,
      }
      vaultArray.push(vault)
      setVaultArry([...vaultArray])
    })
  }

  useEffect(() => {
    getAccount()
    getAllVaults()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Router>
      <div className='App' class='font-mono'>
        <GlobalContext.Provider value={{ account }}>
          <Switch>
            <Route
              path='/'
              exact
              component={() => <SelectCommunity vaultArry={vaultArry} />}
            />
            <Route path='/:commons' exact component={() => <Community />} />
          </Switch>
          <Link to='/'>
            <div class='text-center max-w-sm mx-auto my-5'>
              Switch community!
            </div>
          </Link>
        </GlobalContext.Provider>
      </div>
    </Router>
  )
}

export default App;
