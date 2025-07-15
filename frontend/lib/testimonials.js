import EmblaCarousel from 'embla-carousel'
import Autoplay from 'embla-carousel-autoplay'

const addPrevNextBtnsClickHandlers = (emblaApi, prevBtn, nextBtn) => {
  const scrollPrev = () => emblaApi.scrollPrev()
  const scrollNext = () => emblaApi.scrollNext()

  prevBtn.addEventListener('click', scrollPrev, false)
  nextBtn.addEventListener('click', scrollNext, false)

  return () => {
    prevBtn.removeEventListener('click', scrollPrev, false)
    nextBtn.removeEventListener('click', scrollNext, false)
  }
}

const addDotBtnsAndClickHandlers = (emblaApi, dotsNode) => {
  let dotNodes = []

  const addDotBtnsWithClickHandlers = () => {
    dotsNode.innerHTML = emblaApi
      .scrollSnapList()
      .map(() => '<button class="testimonials__dot" type="button"></button>')
      .join('')

    const scrollTo = (index) => emblaApi.scrollTo(index)

    dotNodes = Array.from(dotsNode.querySelectorAll('.testimonials__dot'))
    dotNodes.forEach((dotNode, index) => {
      dotNode.addEventListener('click', () => scrollTo(index), false)
    })
  }

  const toggleDotBtnsActive = () => {
    const previous = emblaApi.previousScrollSnap()
    const selected = emblaApi.selectedScrollSnap()

    if (dotNodes[previous]) {
      dotNodes[previous].classList.remove('testimonials__dot--selected')
    }
    if (dotNodes[selected]) {
      dotNodes[selected].classList.add('testimonials__dot--selected')
    }
  }

  emblaApi
    .on('init', addDotBtnsWithClickHandlers)
    .on('reInit', addDotBtnsWithClickHandlers)
    .on('init', toggleDotBtnsActive)
    .on('reInit', toggleDotBtnsActive)
    .on('select', toggleDotBtnsActive)

  return () => {
    dotsNode.innerHTML = ''
  }
}

export function initTestimonials() {
  document.querySelectorAll('.testimonials').forEach((emblaNode) => {
    const delay = (parseInt(emblaNode.dataset.delay, 10) || 50) * 1000
    const showNavigation = emblaNode.dataset.navigation === 'true'
    const showDots = emblaNode.dataset.dots === 'true'
    const startIndex = parseInt(emblaNode.dataset.startIndex, 10) || 0

    // Configurações otimizadas para mostrar exatamente 2 slides completos
    const OPTIONS = {
      loop: true,
      startIndex: startIndex,
      align: 'start',
      containScroll: 'trimSnaps',
      slidesToScroll: 1
    }

    const viewportNode = emblaNode.querySelector('.testimonials__viewport')
    const prevBtn = emblaNode.querySelector('.testimonials__button--prev')
    const nextBtn = emblaNode.querySelector('.testimonials__button--next')
    const dotsNode = emblaNode.querySelector('.testimonials__dots')

    const emblaApi = EmblaCarousel(viewportNode, OPTIONS, [Autoplay({ delay })])

    let removePrevNextBtnsClickHandlers
    let removeDotBtnsAndClickHandlers

    if (showNavigation && prevBtn && nextBtn) {
      removePrevNextBtnsClickHandlers = addPrevNextBtnsClickHandlers(
        emblaApi,
        prevBtn,
        nextBtn
      )
    }

    if (showDots && dotsNode) {
      removeDotBtnsAndClickHandlers = addDotBtnsAndClickHandlers(
        emblaApi,
        dotsNode
      )
    }

    // Garantir que inicia no primeiro slide
    emblaApi.on('init', () => {
      emblaApi.scrollTo(startIndex, true)
    })

    emblaApi.on('destroy', () => {
      if (removePrevNextBtnsClickHandlers) removePrevNextBtnsClickHandlers()
      if (removeDotBtnsAndClickHandlers) removeDotBtnsAndClickHandlers()
    })
  })
}
