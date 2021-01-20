import React from 'react'

import './Art.css'

const Art = () => {
    return (
        <div className="art">
            <img src="https://www.justonecookbook.com/wp-content/uploads/2019/12/Oden-2187-I-1-500x500.jpg" alt=""/>

            <div>
                <div>Title</div>
                <div>Description</div>
                <div>Royalties</div>
                <button>Buy</button>
            </div>
        </div>
    )
}

export default Art
