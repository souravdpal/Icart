import React from 'react'
import Link from 'next/link'

const Bottom = () => {
  return (
    <>
      <section className="glass-card bottom-card" aria-labelledby="bottom-title">
        <h2 id="bottom-title" className="about-heading">
          Icart is still growing
        </h2>
        <p className="about-text">
          New features are added as I learn. Follow the code on GitHub or see my other work in
          my portfolio.
        </p>

        <div className="top-actions" style={{ justifyContent: 'center' }}>
          <a
            href="https://github.com/souravdpal"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-solid"
          >
            View GitHub
          </a>
          <a
            href="https://souravdp.vercel.app"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-ghost"
          >
            See my portfolio
          </a>
        </div>
      </section>

      <footer className="about-footer">
        <p>
          &copy; 2026 Icart. Built by Sourav. <Link href="/">Back to the store</Link>
        </p>
      </footer>
    </>
  )
}

export default Bottom