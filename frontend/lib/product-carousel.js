import EmblaCarousel from 'embla-carousel'

export function initProductCarousel() {
  const mainProductNodes = document.querySelectorAll('[data-main-product]')

  mainProductNodes.forEach((mainProductNode) => {
    const viewport = mainProductNode.querySelector('.mainProduct__viewport')
    const prevBtn = mainProductNode.querySelector('.mainProduct__button--prev')
    const nextBtn = mainProductNode.querySelector('.mainProduct__button--next')

    if (!viewport) return

    const embla = EmblaCarousel(viewport, {
      loop: true,
      align: 'center',
      slidesToScroll: 1,
      skipSnaps: false,
      dragFree: false,
      containScroll: 'trimSnaps'
    })

    if (prevBtn) {
      prevBtn.addEventListener('click', () => embla.scrollPrev())
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => embla.scrollNext())
    }

    const toggleButtons = () => {
      if (prevBtn) {
        prevBtn.disabled = !embla.canScrollPrev()
      }
      if (nextBtn) {
        nextBtn.disabled = !embla.canScrollNext()
      }
    }

    embla.on('select', toggleButtons)
    embla.on('init', toggleButtons)
  })
}
