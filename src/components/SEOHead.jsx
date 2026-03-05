import React from 'react'

export default function SEOHead({ title, description }) {
  const fullTitle = title ? `${title} - Docs Library` : 'Docs Library'

  React.useEffect(() => {
    document.title = fullTitle
    const metaDesc = document.querySelector('meta[name="description"]')
    if (metaDesc && description) {
      metaDesc.setAttribute('content', description)
    }
  }, [fullTitle, description])

  return null
}
