import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Switch, Route, useHistory } from 'react-router-dom';
import { ethers } from 'ethers'
import { GlobalContext } from './GlobalContext'
import { projectFirestore } from './firebase/config'
import Community from './pages/Community'
import SelectCommunity from './pages/SelectCommunity'
import Footer from './comps/Footer'
require('dotenv').config()

function App() {
  const [account, setAccount] = useState(null)
  const [vaultArry, setVaultArry] = useState([])

  const history = useHistory()
  // ----- Smart Contract Interaction Config
  const provider = new ethers.providers.Web3Provider(window.ethereum, 'any')
  
  // Detect NETWORK change in Metamask and reload ~ provided by ethers.js
  provider.on('network', (newNetwork, oldNetwork) => {
    if (oldNetwork) {
      history.push('/')
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

  const getAllVaults = async () => {
    const vaultArray = []
    const query = await projectFirestore.collection('vault').get()
    query.forEach((doc) => {
      const vault = {
        contract: doc.data().contract,
        name: doc.data().name,
        chain: doc.data().chain,
        timeStamp: doc.data().createdAt,
      }
      vaultArray.push(vault)
      vaultArray.sort((a, b) => b.timeStamp - a.timeStamp)
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
          <Footer />
        </GlobalContext.Provider>
      </div>
    </Router>
  )
}

export default App;
