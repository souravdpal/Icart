import React from 'react'

// Add or remove technologies to match Icart's real stack.
const stack = ['Next.js', 'React', 'TypeScript', 'Tailwind CSS']

const Builder = () => {
  return (
    <section id="builder" className="glass-card builder-card" aria-labelledby="builder-title">
      <div className="grid gap-4">
        <h2 id="builder-title" className="about-heading">
          Hi, I&apos;m Sourav
        </h2>
        <p className="about-text">
          I&apos;m a student and developer who learns by building real things. Icart is my way
          of practising full stack development: designing the pages, structuring the code and
          fixing what breaks along the way.
        </p>
        <p className="about-text">
          Every part of this store is built by me, so you will see it keep improving.
        </p>
      </div>

      <div className="grid gap-3">
        <p id="highfont">Built with</p>
        <ul className="stack-list">
          {stack.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ul>
      </div>
    </section>
  )
}

export default Builder