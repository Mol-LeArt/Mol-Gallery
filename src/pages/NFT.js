import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom';
import useFirestore from '../hooks/useFirestore';

import './NFT.css'

const NFT = ({ match }) => {
    const [item, setItem] = useState({});
    const { docs } = useFirestore('nft');

    // useEffect(() => {
    //     query(match.params.id)
    //     console.log(item)
    // }, []);

    // const query = async (id) => {
        // nfts.filter(nft => nft.id === id).map(filteredNFT => console.log(filteredNFT.title))
    
        // const found = nfts.some(el => el.id === id)
        // if (found) {
        //     nfts.filter(nft => nft.id === id).map(filteredNFT => console.log(filteredNFT.title))
        // } else {
        //     alert("wrong")
        // }
        
    // }
    
    return (
        <div className="nft">
            <img src={docs.filter(nft => nft.id === match.params.id).map(filteredNFT => filteredNFT.url)} alt=""/>

            <div>
                <div>Title: {docs.filter(nft => nft.id === match.params.id).map(filteredNFT => filteredNFT.title)}</div>
                <div>Description: {docs.filter(nft => nft.id === match.params.id).map(filteredNFT => filteredNFT.description)}</div>
                <div>Royalties: Need to get this from collection("gallery")</div>
                <button>Buy</button>
            </div>
        </div>
    )
}

export default NFT
