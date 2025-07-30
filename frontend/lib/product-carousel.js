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
      prevBtn.addEventListener('click', (e) => {
        e.preventDefault()
        e.stopPropagation()
        embla.scrollPrev()
      })
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', (e) => {
        e.preventDefault()
        e.stopPropagation()
        embla.scrollNext()
      })
    }

    const toggleButtons = () => {
      if (prevBtn) prevBtn.disabled = false
      if (nextBtn) nextBtn.disabled = false
    }

    const updateActiveSlide = () => {
      const allSlides = viewport.querySelectorAll('.mainProduct__slide')
      allSlides.forEach((slide) => slide.classList.remove('is-active'))

      const selectedIndex = embla.selectedScrollSnap()
      const activeSlide = allSlides[selectedIndex]
      if (activeSlide) activeSlide.classList.add('is-active')
    }

    const disableTransitions = () => {
      const allSlides = viewport.querySelectorAll('.mainProduct__slide')
      allSlides.forEach((slide) => {
        slide.style.transition = 'none'
        const img = slide.querySelector('img')
        if (img) img.style.transition = 'none'
      })
    }

    const enableTransitions = () => {
      const allSlides = viewport.querySelectorAll('.mainProduct__slide')
      allSlides.forEach((slide) => {
        slide.style.transition = ''
        const img = slide.querySelector('img')
        if (img) img.style.transition = ''
      })
    }

    embla.on('select', () => {
      toggleButtons()
      updateActiveSlide()
    })

    embla.on('init', () => {
      toggleButtons()
      updateActiveSlide()
    })

    embla.on('scroll', disableTransitions)
    embla.on('settle', enableTransitions)
  })
}
