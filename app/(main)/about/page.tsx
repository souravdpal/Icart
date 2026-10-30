import React from 'react'
import Top from './components/top'
import Features from './components/features'
import Builder from './components/builder'
import Bottom from './components/bottom'
import './about.css'

const Page = () => {
  return (
    <main id="about-body">
      <div className="about-wrap">
        <Top />
        <Features />
        <Builder />
        <Bottom />
      </div>
    </main>
  )
}

export default Page