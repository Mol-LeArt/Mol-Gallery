import React from 'react'
import useFirestore from '../hooks/useFirestore';
import './NFT.css'

const NFT = ({ match }) => {
    const { docs } = useFirestore('nft');
    console.log(match)
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
