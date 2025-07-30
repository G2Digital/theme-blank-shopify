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

    // Função para atualizar a classe ativa no slide central
    const updateActiveSlide = () => {
      // Remove a classe is-active de todos os slides
      const allSlides = viewport.querySelectorAll('.mainProduct__slide')
      allSlides.forEach((slide) => {
        slide.classList.remove('is-active')
      })

      // Adiciona a classe is-active ao slide ativo
      const selectedIndex = embla.selectedScrollSnap()
      const activeSlide = allSlides[selectedIndex]

      if (activeSlide) {
        activeSlide.classList.add('is-active')
        console.log(`Slide ${selectedIndex} marcado como ativo`)
      }
    }

    // Desabilita transições durante o scroll
    const disableTransitions = () => {
      const allSlides = viewport.querySelectorAll('.mainProduct__slide')
      allSlides.forEach((slide) => {
        slide.style.transition = 'none'
        const img = slide.querySelector('img')
        if (img) img.style.transition = 'none'
      })
    }

    // Habilita transições após o scroll
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

    // Desabilita transições durante o scroll e reabilita após
    embla.on('scroll', disableTransitions)
    embla.on('settle', enableTransitions)
  })
}
