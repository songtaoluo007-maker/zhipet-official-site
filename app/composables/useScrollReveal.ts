import { onBeforeUnmount, onMounted, ref } from 'vue'
import type { ComponentPublicInstance, Ref } from 'vue'

export const useScrollReveal = () => {
  const elements: Ref<HTMLElement[]> = ref([])
  const isReducedMotion = ref(false)
  let revealFallbackTimer: ReturnType<typeof window.setTimeout> | undefined
  let observer: IntersectionObserver | undefined

  const resolveElement = (element: Element | ComponentPublicInstance | null) => {
    if (!element) {
      return undefined
    }

    if ('classList' in element) {
      return element as HTMLElement
    }

    const componentElement = element.$el
    return componentElement instanceof HTMLElement ? componentElement : undefined
  }

  const register = (element: Element | ComponentPublicInstance | null) => {
    const htmlElement = resolveElement(element)

    if (!htmlElement || elements.value.includes(htmlElement)) {
      return
    }

    htmlElement.classList.add('reveal')
    htmlElement.style.setProperty('--reveal-delay', `${Math.min(elements.value.length * 60, 180)}ms`)
    elements.value.push(htmlElement)

    if (isReducedMotion.value || typeof IntersectionObserver === 'undefined') {
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

    revealFallbackTimer = window.setTimeout(() => {
      elements.value.forEach((element) => element.classList.add('is-visible'))
    }, 1400)
  })

  onBeforeUnmount(() => {
    observer?.disconnect()
    if (revealFallbackTimer) {
      window.clearTimeout(revealFallbackTimer)
    }
  })

  return {
    register,
  }
}
