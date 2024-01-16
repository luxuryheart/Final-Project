import React from 'react'

const Navbar = ({title}) => {
  return (
    <div className="bg-colorBlueDark flex items-center justify-center h-20 w-screen sticky top-0 z-50">
      <div className="text-bgColor font-serif text-2xl">{title}</div>
    </div>
  )
}

export default Navbar