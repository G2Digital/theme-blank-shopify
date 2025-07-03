import 'vite/modulepreload-polyfill'
import { initDisclosureWidgets } from '@/lib/a11y'
import { revive, islands } from '@/lib/revive.js'
import EmblaCarousel from 'embla-carousel'
import Autoplay from 'embla-carousel-autoplay'

document.addEventListener('DOMContentLoaded', () => {
  const summaries = document.querySelectorAll('[id^="Details-"] summary')

  revive(islands)
  initDisclosureWidgets(summaries)

  document.querySelectorAll('.image-slider').forEach((emblaNode) => {
    const delay = parseInt(emblaNode.dataset.delay, 10) || 5000
    const showNavigation = emblaNode.dataset.showNavigation === 'true'

    const options = {
      loop: true
    }

    const plugins = [Autoplay({ delay })]

    const emblaApi = EmblaCarousel(emblaNode, options, plugins)

    if (showNavigation) {
      const prevButton = emblaNode.querySelector('.slider__voltar')
      const nextButton = emblaNode.querySelector('.slider__avancar')

      prevButton.addEventListener('click', () => emblaApi.scrollPrev())
      nextButton.addEventListener('click', () => emblaApi.scrollNext())
    }

    const dots = emblaNode.querySelectorAll('.slider__dot')
    const setSelectedDot = () => {
      const selected = emblaApi.selectedScrollSnap()
      dots.forEach((dot, index) => {
        dot.classList.toggle('is-selected', index === selected)
      })
    }

    emblaApi.on('select', setSelectedDot)
    emblaApi.on('init', setSelectedDot)

    dots.forEach((dot, index) => {
      dot.addEventListener('click', () => emblaApi.scrollTo(index))
    })
  })
})
