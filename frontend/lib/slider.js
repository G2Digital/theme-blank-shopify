import EmblaCarousel from 'embla-carousel'
import Autoplay from 'embla-carousel-autoplay'
import Fade from 'embla-carousel-fade'

export function initSliders() {
  document.querySelectorAll('.image-slider').forEach((emblaNode) => {
    const delay = parseInt(emblaNode.dataset.delay, 10) || 5000
    const showNavigation = emblaNode.dataset.showNavigation === 'true'
    const showDots = emblaNode.dataset.showDots === 'true'
    const effect = emblaNode.dataset.effect || 'slide'

    const options = {
      loop: true,
      duration: 40,
      containScroll: false,
      dragFree: false,
      dragThreshold: 50
    }

    const plugins = [Autoplay({ delay })]
    if (effect === 'fade') {
      plugins.push(Fade())
    }

    const emblaApi = EmblaCarousel(emblaNode, options, plugins)

    if (showNavigation) {
      const prevButton = emblaNode.querySelector('.slider__nav--prev')
      const nextButton = emblaNode.querySelector('.slider__nav--next')
      if (prevButton && nextButton) {
        prevButton.addEventListener('click', () => emblaApi.scrollPrev())
        nextButton.addEventListener('click', () => emblaApi.scrollNext())
      }
    }

    if (showDots) {
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
    }

    emblaApi.on('pointerDown', () => {
      const autoplayPlugin = emblaApi.plugins()?.autoplay
      if (autoplayPlugin) {
        autoplayPlugin.stop()
      }
    })

    let autoplayTimer
    emblaApi.on('pointerUp', () => {
      clearTimeout(autoplayTimer)
      const autoplayPlugin = emblaApi.plugins()?.autoplay
      if (autoplayPlugin) {
        autoplayTimer = setTimeout(() => autoplayPlugin.play(), 3000)
      }
    })
  })
}
