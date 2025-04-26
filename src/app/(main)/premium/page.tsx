import Link from 'next/link'
import React from 'react'

const Page = () => {
  return (
    <div className="flex flex-col h-full w-full justify-center items-center gap-3"><h1 className="font-bold text-2xl">Page not dont yet. Go to <Link className="text-blue-600" href={'/'}>home</Link></h1></div>
  )
}

export default Page