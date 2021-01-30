import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'
import { projectFirestore } from '../firebase/config'
import './ImageGrid.css'

const ImageGrid = ({ gallery }) => {
  const [account, setAccount] = useState(null)
  const [docs, setDocs] = useState(null)

  async function getAccount() {
    window.ethereum
      .request({ method: 'eth_requestAccounts' })
      .then((result) => {
        // console.log(result[0])
        setAccount(result[0])
      })
  }

  async function checkGallery(account) {
    const docArray = []
    const query = await projectFirestore
      .collection('nft')
      .where('gallery', '==', gallery)
      .get()

    if (gallery === 'commons') {
      query.forEach((doc) => {
        let data = { ...doc.data(), id: doc.id }
        docArray.push(data)
        setDocs(docArray)
      })
    } else {
      query.forEach((doc) => {
        if (doc.data().account === account) {
          let data = { ...doc.data(), id: doc.id }
          docArray.push(data)
          setDocs(docArray)
        }
      })
    }
  }

  useEffect(() => {
    getAccount()
    checkGallery(account)
  }, [account])

  // console.log(docs)
  return (
    <div className='img-grid'>
      {!docs && <label>Wow, such empty!</label>}
      {docs &&
        docs.map((doc) => (
          <div className='img-wrap' key={doc.id}>
            <Link to={`/nft/${doc.id}`}>
              <img
                src={doc.url}
                onMouseOver={(e) =>
                  (e.currentTarget.src =
                    'https://www.justonecookbook.com/wp-content/uploads/2019/12/Oden-2187-I-1-500x500.jpg')
                }
                onMouseOut={(e) => (e.currentTarget.src = doc.url)}
                alt='uploaded pic'
              />
            </Link>
          </div>
        ))}
    </div>
  )
}

export default ImageGrid;
