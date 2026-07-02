import { onBeforeUnmount, onMounted, ref } from 'vue'
import type { ComponentPublicInstance, Ref } from 'vue'

export const useScrollReveal = () => {
  const elements: Ref<HTMLElement[]> = ref([])
  const isReducedMotion = ref(false)
  let observer: IntersectionObserver | undefined

  const register = (element: Element | ComponentPublicInstance | null) => {
    if (!element || !('classList' in element)) {
      return
    }

    const htmlElement = element as HTMLElement
    htmlElement.classList.add('reveal')
    elements.value.push(htmlElement)

    if (isReducedMotion.value) {
      htmlElement.classList.add('is-visible')
      return
    }

    observer?.observe(htmlElement)
  }

  onMounted(() => {
    isReducedMotion.value = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (isReducedMotion.value) {
      elements.value.forEach((element) => element.classList.add('is-visible'))
      return
    }

    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            observer?.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.18 },
    )

    elements.value.forEach((element) => observer?.observe(element))
  })

  onBeforeUnmount(() => {
    observer?.disconnect()
  })

  return {
    register,
  }
}
