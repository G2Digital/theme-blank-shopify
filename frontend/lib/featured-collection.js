import EmblaCarousel from 'embla-carousel'

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

const addTogglePrevNextBtnsActive = (emblaApi, prevBtn, nextBtn) => {
  const togglePrevNextBtns = () => {
    if (emblaApi.canScrollPrev()) {
      prevBtn.removeAttribute('disabled')
    } else {
      prevBtn.setAttribute('disabled', 'disabled')
    }

    if (emblaApi.canScrollNext()) {
      nextBtn.removeAttribute('disabled')
    } else {
      nextBtn.setAttribute('disabled', 'disabled')
    }
  }

  emblaApi
    .on('init', togglePrevNextBtns)
    .on('reInit', togglePrevNextBtns)
    .on('select', togglePrevNextBtns)

  return togglePrevNextBtns
}

export function initFeaturedCollection() {
  document
    .querySelectorAll('.featured-collection-carousel')
    .forEach((emblaNode) => {
      const viewportNode = emblaNode.querySelector(
        '.featured-collection__viewport'
      )
      const prevBtn = emblaNode.querySelector(
        '.featured-collection__button--prev'
      )
      const nextBtn = emblaNode.querySelector(
        '.featured-collection__button--next'
      )

      const productsCount = parseInt(emblaNode.dataset.productsCount) || 4

      if (!viewportNode || !prevBtn || !nextBtn) {
        return
      }

      let emblaApi = null
      let removePrevNextBtnsClickHandlers = null
      let handleKeyDown = null

      // Verificar se precisa de navegação (baseado em largura fixa de 320px)
      const needsNavigation = () => {
        const containerWidth = viewportNode.clientWidth
        const slideWidth = 320 + 16 // w-80 (320px) + padding left (16px)
        const visibleSlides = Math.floor(containerWidth / slideWidth)
        return productsCount > visibleSlides
      }

      // Função para mostrar/esconder navegação
      const toggleNavigation = (show) => {
        prevBtn.style.display = show ? 'flex' : 'none'
        nextBtn.style.display = show ? 'flex' : 'none'
      }

      // Inicializar ou reinicializar carousel
      const initCarousel = () => {
        // Limpar carousel anterior se existir
        if (emblaApi) {
          emblaApi.destroy()
        }

        if (removePrevNextBtnsClickHandlers) {
          removePrevNextBtnsClickHandlers()
        }

        if (needsNavigation()) {
          // Configuração correta para scroll de 1 slide baseada na documentação
          const OPTIONS = {
            slidesToScroll: 1, // Scroll 1 slide por vez
            skipSnaps: false, // CRÍTICO: previne pular slides com swipes rápidos
            containScroll: 'trimSnaps', // Gerencia boundaries sem agrupar slides
            align: 'start', // Posicionamento consistente
            dragFree: false, // Garante snap-to-slide behavior
            loop: false, // Evita problemas de agrupamento do loop
            dragThreshold: 15 // Sensibilidade de arraste
          }

          emblaApi = EmblaCarousel(viewportNode, OPTIONS)

          // Initialize handlers
          removePrevNextBtnsClickHandlers = addPrevNextBtnsClickHandlers(
            emblaApi,
            prevBtn,
            nextBtn
          )

          addTogglePrevNextBtnsActive(emblaApi, prevBtn, nextBtn)

          // Add keyboard navigation
          handleKeyDown = (event) => {
            if (event.key === 'ArrowLeft') {
              event.preventDefault()
              emblaApi.scrollPrev()
            } else if (event.key === 'ArrowRight') {
              event.preventDefault()
              emblaApi.scrollNext()
            }
          }

          emblaNode.addEventListener('keydown', handleKeyDown)
          toggleNavigation(true)
        } else {
          toggleNavigation(false)
          emblaApi = null
        }
      }

      // Handle resize with debounce
      let resizeTimeout
      const handleResize = () => {
        clearTimeout(resizeTimeout)
        resizeTimeout = setTimeout(initCarousel, 250)
      }

      window.addEventListener('resize', handleResize)

      // Initialize carousel
      initCarousel()

      // Add accessibility
      viewportNode.setAttribute('role', 'region')
      viewportNode.setAttribute('aria-label', 'Featured products carousel')

      // Global cleanup for this carousel instance
      emblaNode._cleanup = () => {
        if (emblaApi) {
          emblaApi.destroy()
        }
        if (removePrevNextBtnsClickHandlers) {
          removePrevNextBtnsClickHandlers()
        }
        if (handleKeyDown) {
          emblaNode.removeEventListener('keydown', handleKeyDown)
        }
        window.removeEventListener('resize', handleResize)
      }
    })
}
