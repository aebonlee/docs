import { useEffect, type ReactElement } from 'react'

interface SEOHeadProps {
  title?: string;
  description?: string;
}

export default function SEOHead({ title, description }: SEOHeadProps): ReactElement | null {
  const fullTitle = title ? `${title} - Docs Library` : 'Docs Library'

  useEffect(() => {
    document.title = fullTitle
    const metaDesc = document.querySelector('meta[name="description"]')
    if (metaDesc && description) {
      metaDesc.setAttribute('content', description)
    }
  }, [fullTitle, description])

  return null
}
