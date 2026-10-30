import React from 'react'

// Edit these to match what Icart really does (or plans to do).
const features = [
  {
    title: 'Easy to browse',
    text: 'Find a product quickly with a clear layout, simple categories and a fast cart.',
  },
  {
    title: 'Built to grow',
    text: 'The code is organised so new features can be added without rewriting what already works.',
  },
  {
    title: 'Smarter over time',
    text: 'Future versions will use AI to suggest products and make shopping more personal.',
  },
]

const Features = () => {
  return (
    <section aria-labelledby="features-title" className="grid gap-5">
      <h2 id="features-title" className="about-heading">
        What Icart is about
      </h2>

      <div className="features-grid">
        {features.map((f) => (
          <article key={f.title} className="glass-card feature-card">
            <h3>{f.title}</h3>
            <p>{f.text}</p>
          </article>
        ))}
      </div>
    </section>
  )
}

export default Features