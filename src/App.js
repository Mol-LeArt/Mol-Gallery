import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
// import NavBar from './comps/NavBar';
// import Commons from './pages/Commons';
// import About from './pages/About';
// import Arcade from './pages/Arcade'
// import OpenGallery from './pages/OpenGallery';
// import MintNFT from './pages/MintNFT'
// import NFT from './pages/NFT';
// import Profile from './pages/Profile'
// import Gallery from './pages/Gallery'
// import Galleries from './pages/Galleries'
import Community from './pages/Community'
import SelectCommunity from './pages/SelectCommunity'
import { GlobalContext } from './GlobalContext'
import { projectFirestore } from './firebase/config'
require('dotenv').config()


function App() {
  const [account, setAccount] = useState(null)
  const [hasGallery, setHasGallery] = useState(false)
  const [vaultArry, setVaultArry] = useState([])

  const getAccount = async () => {
    window.ethereum
      .request({ method: 'eth_requestAccounts' })
      .then((result) => {
        console.log("Account connected - " + result[0])
        setAccount(result[0])
        getGallery(result[0])
    })
  }

  const getGallery = async (account) => {
    const query = await projectFirestore
      .collection('gallery')
      .where('account', '==', account)
      .get()

    if (!query.empty) {
      setHasGallery(true)
    }
  }

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
      <div className='App'>
        <GlobalContext.Provider value={{ account, hasGallery }}>
          <Switch>
            <Route
              path='/'
              exact
              component={() => <SelectCommunity vaultArry={vaultArry} />}
            />
            <Route
              path='/:contract'
              exact
              component={() => <Community />}
            />
          </Switch>
        </GlobalContext.Provider>
      </div>
    </Router>
  )
}

export default App;
