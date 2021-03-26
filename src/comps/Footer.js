import React from 'react'
import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <div class='bottom-0'>
      <Link to='/'>
        <div class='fixed bottom-4 right-4'>Switch community!</div>
      </Link>
    </div>
  )
}

export default Footer
