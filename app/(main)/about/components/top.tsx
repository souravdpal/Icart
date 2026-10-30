import React from 'react'
import Link from 'next/link'

const Top = () => {
  return (
    <section id="master-top" className="glass-card" aria-labelledby="about-title">
      <h1 id="about-title" className="about-title">
        Welcome to Icart
      </h1>

      <p className="about-text">
        Icart is a shopping project built around one idea: online shopping should be simple
        today and smarter tomorrow. It starts as a clean store and grows with advanced
        features as I learn and build.
      </p>

      <p id="highfont">Made by Sourav</p>

      <div className="top-actions">
        {/* Change "/" to your shop or products route */}
        <Link href="/" className="btn btn-solid">
          Start shopping
        </Link>
        <Link href="#builder" className="btn btn-ghost">
          Meet the builder
        </Link>
      </div>
    </section>
  )
}

export default Top