import React from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@chakra-ui/react'

const NoUserMenu = ():any => {
  return (
   <div>
        <Link to={"/allCombines"}>All Combines</Link>
        <div className='flex'>
        <Link to={"/login"}><Button colorScheme='linkedin'>Login</Button></Link>
        <Link to={"/register"}><Button colorScheme='orange'>Register</Button></Link>
      
       </div>
    
    </div>
  )
}

export default NoUserMenu