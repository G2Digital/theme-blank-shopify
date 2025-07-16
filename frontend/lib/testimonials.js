import EmblaCarousel from 'embla-carousel'
import Autoplay from 'embla-carousel-autoplay'

const addPrevNextBtnsClickHandlers = (
  emblaApi,
  prevBtn,
  nextBtn,
  autoplayPlugin
) => {
  const scrollPrev = () => {
    autoplayPlugin.stop()
    emblaApi.scrollPrev()
    setTimeout(() => {
      autoplayPlugin.reset()
      autoplayPlugin.play()
    }, 100)
  }

  const scrollNext = () => {
    autoplayPlugin.stop()
    emblaApi.scrollNext()

    setTimeout(() => {
      autoplayPlugin.reset()
      autoplayPlugin.play()
    }, 100)
  }

  prevBtn.addEventListener('click', scrollPrev, false)
  nextBtn.addEventListener('click', scrollNext, false)

  return () => {
    prevBtn.removeEventListener('click', scrollPrev, false)
    nextBtn.removeEventListener('click', scrollNext, false)
  }
}

const addSlideActiveClasses = (emblaApi) => {
  const slides = emblaApi.slideNodes()

  const updateActiveClasses = () => {
    const selectedIndex = emblaApi.selectedScrollSnap()
    slides.forEach((slide, index) => {
      slide.classList.remove('embla__slide--active')
      if (index === selectedIndex) {
        slide.classList.add('embla__slide--active')
      }
    })
  }

  emblaApi
    .on('init', updateActiveClasses)
    .on('reInit', updateActiveClasses)
    .on('select', updateActiveClasses)

  return () => {
    slides.forEach((slide) => slide.classList.remove('embla__slide--active'))
  }
}

const convertDelayToMs = (schemaValue) => {
  const seconds = schemaValue / 10
  return seconds * 1000
}

const addDragHandlers = (emblaApi, autoplayPlugin) => {
  let isDragging = false

  const onPointerDown = () => {
    isDragging = true
    autoplayPlugin.stop()
  }

  const onPointerUp = () => {
    if (isDragging) {
      isDragging = false
      setTimeout(() => {
        autoplayPlugin.reset()
        autoplayPlugin.play()
      }, 100)
    }
  }

  const onSelect = () => {
    if (isDragging) {
      autoplayPlugin.stop()
    }
  }

  emblaApi.on('pointerDown', onPointerDown)
  emblaApi.on('pointerUp', onPointerUp)
  emblaApi.on('select', onSelect)

  return () => {
    emblaApi.off('pointerDown', onPointerDown)
    emblaApi.off('pointerUp', onPointerUp)
    emblaApi.off('select', onSelect)
  }
}

export function initTestimonials() {
  document.querySelectorAll('.testimonials').forEach((emblaNode) => {
    const schemaDelay = parseInt(emblaNode.dataset.delay, 10) || 50
    const delay = convertDelayToMs(schemaDelay)
    const showNavigation = emblaNode.dataset.navigation === 'true'
    const startIndex = parseInt(emblaNode.dataset.startIndex, 10) || 0

    const OPTIONS = {
      loop: true,
      startIndex: startIndex,
      align: 'start',
      containScroll: 'trimSnaps',
      slidesToScroll: 1
    }

    const viewportNode = emblaNode.querySelector('.testimonials__viewport')
    const prevBtn = document.querySelector('.testimonials__button--prev')
    const nextBtn = document.querySelector('.testimonials__button--next')

    const autoplayPlugin = Autoplay({
      delay,
      stopOnInteraction: false,
      stopOnMouseEnter: true,
      playOnInit: true
    })

    const emblaApi = EmblaCarousel(viewportNode, OPTIONS, [autoplayPlugin])

    let removePrevNextBtnsClickHandlers
    let removeSlideActiveClasses
    let removeDragHandlers

    removeSlideActiveClasses = addSlideActiveClasses(emblaApi)
    removeDragHandlers = addDragHandlers(emblaApi, autoplayPlugin)

    if (showNavigation && prevBtn && nextBtn) {
      removePrevNextBtnsClickHandlers = addPrevNextBtnsClickHandlers(
        emblaApi,
        prevBtn,
        nextBtn,
        autoplayPlugin
      )
    }

    emblaApi.on('init', () => {
      emblaApi.scrollTo(startIndex, true)
    })

    emblaNode.addEventListener('mouseenter', () => {
      autoplayPlugin.stop()
    })

    emblaNode.addEventListener('mouseleave', () => {
      autoplayPlugin.play()
    })

    emblaApi.on('destroy', () => {
      if (removePrevNextBtnsClickHandlers) removePrevNextBtnsClickHandlers()
      if (removeSlideActiveClasses) removeSlideActiveClasses()
      if (removeDragHandlers) removeDragHandlers()
    })
  })
}
