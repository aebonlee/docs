import { useEffect } from 'react'

export default function useAOS(): void {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('aos-visible')
          }
        })
      },
      { threshold: 0.1 }
    )

    function observe(): void {
      document.querySelectorAll('[data-aos]').forEach((el) => {
        observer.observe(el)
      })
    }

    observe()

    const mutation = new MutationObserver(observe)
    mutation.observe(document.body, { childList: true, subtree: true })

    return () => {
      observer.disconnect()
      mutation.disconnect()
    }
  }, [])
}
