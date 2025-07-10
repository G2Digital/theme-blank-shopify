export function initShowcaseSliders() {
  document
    .querySelectorAll('.product-showcase-slider')
    .forEach((sliderNode) => {
      const delay = parseInt(sliderNode.dataset.delay, 10) || 5000
      const showNavigation = sliderNode.dataset.showNavigation === 'true'
      const showDots = sliderNode.dataset.showDots === 'true'
      const productsCount = parseInt(sliderNode.dataset.productsCount, 10) || 6

      let currentIndex = 0
      let autoplayTimer
      let isTransitioning = false

      // Get all product containers
      const previousContainer = sliderNode.querySelector('.previous-image')
      const currentContainer = sliderNode.querySelector('.current-image')
      const nextContainer = sliderNode.querySelector('.next-image')

      // Get all product slides for each position
      const previousSlides =
        previousContainer.querySelectorAll('.product-slide')
      const currentSlides = currentContainer.querySelectorAll('.product-slide')
      const nextSlides = nextContainer.querySelectorAll('.product-slide')

      // Calculate indices for previous, current, and next products
      const getIndices = (currentIdx) => {
        const prevIdx = (currentIdx - 1 + productsCount) % productsCount
        const nextIdx = (currentIdx + 1) % productsCount
        return { prevIdx, currentIdx, nextIdx }
      }

      // Preload images for better performance
      const preloadImage = (src) => {
        return new Promise((resolve, reject) => {
          const img = new Image()
          img.onload = () => resolve(img)
          img.onerror = reject
          img.src = src
        })
      }

      // Enhanced image loading with immediate preload
      const handleImageLoading = () => {
        const images = sliderNode.querySelectorAll('img')

        images.forEach((img) => {
          if (img.complete) {
            img.classList.add('loaded')
            img.style.opacity = '1'
          } else {
            img.style.opacity = '0'
            img.addEventListener('load', () => {
              img.classList.add('loaded')
              smoothTransition(img, { opacity: '0' }, { opacity: '1' }, 300)
            })

            // Force load if lazy loading is preventing it
            if (img.loading === 'lazy') {
              img.loading = 'eager'
            }
          }
        })
      }

      // CORRIGIDO: Performance optimization: Preload adjacent images
      const preloadAdjacentImages = () => {
        try {
          const indices = getIndices(currentIndex)
          const { prevIdx, nextIdx } = indices

          // Get all slides arrays
          const allSlides = [previousSlides, currentSlides, nextSlides]

          // Preload images for current, previous and next indices
          const indicesToPreload = [currentIndex, prevIdx, nextIdx]

          indicesToPreload.forEach((index) => {
            allSlides.forEach((slideGroup) => {
              if (slideGroup && slideGroup[index]) {
                const images = slideGroup[index].querySelectorAll('img')
                images.forEach((img) => {
                  if (!img.dataset.preloaded && img.src) {
                    img.dataset.preloaded = 'true'
                    preloadImage(img.src).catch(() => {
                      // Silently handle preload errors
                    })
                  }
                })
              }
            })
          })

          // Preload next few images for smoother experience
          for (let i = 1; i <= 2; i++) {
            const futureIndex = (currentIndex + i) % productsCount
            allSlides.forEach((slideGroup) => {
              if (slideGroup && slideGroup[futureIndex]) {
                const images = slideGroup[futureIndex].querySelectorAll('img')
                images.forEach((img) => {
                  if (!img.dataset.preloaded && img.src) {
                    img.dataset.preloaded = 'true'
                    setTimeout(() => {
                      preloadImage(img.src).catch(() => {
                        // Silently handle preload errors
                      })
                    }, i * 500) // Stagger preloading
                  }
                })
              }
            })
          }
        } catch (error) {
          console.warn('Error in preloadAdjacentImages:', error)
        }
      }

      // Smooth transition helper
      const smoothTransition = (
        element,
        fromState,
        toState,
        duration = 300
      ) => {
        return new Promise((resolve) => {
          // Apply from state
          Object.assign(element.style, fromState)

          // Force reflow
          element.offsetHeight

          // Apply transition
          element.style.transition = `all ${duration}ms cubic-bezier(0.4, 0, 0.2, 1)`

          // Apply to state
          Object.assign(element.style, toState)

          setTimeout(() => {
            element.style.transition = ''
            resolve()
          }, duration)
        })
      }

      // CORRIGIDO: Update the display of products in all three positions with smooth transitions
      const updateProductDisplay = async (animate = true) => {
        if (isTransitioning) return
        isTransitioning = true

        const {
          prevIdx,
          currentIdx: currIdx,
          nextIdx
        } = getIndices(currentIndex)

        console.log('Updating display:', {
          currentIndex,
          prevIdx,
          currIdx,
          nextIdx,
          productsCount
        })

        if (animate) {
          // Fade out all current slides
          const fadeOutPromises = []

          ;[previousSlides, currentSlides, nextSlides].forEach((slides) => {
            slides.forEach((slide) => {
              if (slide.classList.contains('active')) {
                fadeOutPromises.push(
                  smoothTransition(
                    slide,
                    {},
                    {
                      opacity: '0',
                      transform: 'translateY(15px) scale(0.95)'
                    }
                  )
                )
              }
            })
          })

          // Wait for fade out to complete
          await Promise.all(fadeOutPromises)

          // Hide old slides and prepare new ones
          ;[previousSlides, currentSlides, nextSlides].forEach((slides) => {
            slides.forEach((slide) => {
              slide.classList.add('hidden')
              slide.classList.remove('active')
              slide.style.opacity = '0'
              slide.style.transform = 'translateY(15px) scale(0.95)'
            })
          })

          // Show and fade in new slides
          const newSlides = [
            previousSlides[prevIdx],
            currentSlides[currIdx],
            nextSlides[nextIdx]
          ]

          console.log(
            'New slides:',
            newSlides.map((s) => (s ? s.dataset.productIndex : 'null'))
          )

          const fadeInPromises = newSlides.map((slide) => {
            if (slide) {
              slide.classList.remove('hidden')
              slide.classList.add('active')

              // Ensure images are loaded before showing
              const images = slide.querySelectorAll('img')
              images.forEach((img) => {
                if (img.loading === 'lazy') {
                  img.loading = 'eager'
                }
              })

              return smoothTransition(
                slide,
                {
                  opacity: '0',
                  transform: 'translateY(15px) scale(0.95)'
                },
                {
                  opacity: '1',
                  transform: 'translateY(0) scale(1)'
                },
                400
              )
            }
            return Promise.resolve()
          })

          await Promise.all(fadeInPromises)
        } else {
          // Immediate update without animation
          ;[previousSlides, currentSlides, nextSlides].forEach((slides) => {
            slides.forEach((slide) => {
              slide.classList.add('hidden')
              slide.classList.remove('active')
              slide.style.opacity = '0'
              slide.style.transform = 'translateY(0) scale(1)'
            })
          })

          // Show correct slides immediately
          if (previousSlides[prevIdx]) {
            previousSlides[prevIdx].classList.remove('hidden')
            previousSlides[prevIdx].classList.add('active')
            previousSlides[prevIdx].style.opacity = '1'
          }

          if (currentSlides[currIdx]) {
            currentSlides[currIdx].classList.remove('hidden')
            currentSlides[currIdx].classList.add('active')
            currentSlides[currIdx].style.opacity = '1'
          }

          if (nextSlides[nextIdx]) {
            nextSlides[nextIdx].classList.remove('hidden')
            nextSlides[nextIdx].classList.add('active')
            nextSlides[nextIdx].style.opacity = '1'
          }
        }

        isTransitioning = false
      }

      // CORRIGIDO: Product title synchronization with smooth transitions
      const syncProductTitle = async () => {
        const productTitleContainer = document.querySelector(
          '#product-title-container'
        )
        if (!productTitleContainer) return

        const productTitles =
          productTitleContainer.querySelectorAll('.product-title')
        const currentTitle = productTitles[currentIndex]

        console.log(
          'Syncing title for index:',
          currentIndex,
          'Total titles:',
          productTitles.length
        )

        // Fade out current title
        const activeTitle = productTitleContainer.querySelector(
          '.product-title.active'
        )
        if (activeTitle && activeTitle !== currentTitle) {
          await smoothTransition(
            activeTitle,
            {},
            {
              opacity: '0',
              transform: 'translateY(-10px)'
            },
            200
          )

          activeTitle.classList.add('hidden')
          activeTitle.classList.remove('active')
        }

        // Fade in new title
        if (currentTitle) {
          currentTitle.classList.remove('hidden')
          currentTitle.classList.add('active')

          await smoothTransition(
            currentTitle,
            {
              opacity: '0',
              transform: 'translateY(-10px)'
            },
            {
              opacity: '1',
              transform: 'translateY(0)'
            },
            300
          )
        }
      }

      // CORRIGIDO: Product info synchronization with smooth transitions
      const syncProductInfo = async () => {
        const productInfoContainer = document.querySelector(
          '#product-info-container'
        )
        if (!productInfoContainer) return

        const productInfos =
          productInfoContainer.querySelectorAll('.product-info')
        const currentInfo = productInfos[currentIndex]

        console.log(
          'Syncing info for index:',
          currentIndex,
          'Total infos:',
          productInfos.length
        )

        // Fade out current info
        const activeInfo = productInfoContainer.querySelector(
          '.product-info.active'
        )
        if (activeInfo && activeInfo !== currentInfo) {
          await smoothTransition(
            activeInfo,
            {},
            {
              opacity: '0',
              transform: 'translateY(20px)'
            },
            200
          )

          activeInfo.classList.add('hidden')
          activeInfo.classList.remove('active')
        }

        // Fade in new info
        if (currentInfo) {
          currentInfo.classList.remove('hidden')
          currentInfo.classList.add('active')

          await smoothTransition(
            currentInfo,
            {
              opacity: '0',
              transform: 'translateY(20px)'
            },
            {
              opacity: '1',
              transform: 'translateY(0)'
            },
            300
          )
        }
      }

      // Update dots indicator with smooth animation
      const updateDots = () => {
        if (!showDots) return

        const dots = sliderNode.querySelectorAll('.slider__dot')
        dots.forEach((dot, index) => {
          if (index === currentIndex) {
            dot.classList.add('is-selected')
          } else {
            dot.classList.remove('is-selected')
          }
        })
      }

      // CORRIGIDO: Navigate to specific index with proper sequencing
      const goToIndex = async (newIndex) => {
        if (newIndex === currentIndex || isTransitioning) return

        // Ensure index is within bounds - CORRIGIDO
        newIndex = ((newIndex % productsCount) + productsCount) % productsCount

        console.log(
          'Going to index:',
          newIndex,
          'from:',
          currentIndex,
          'total:',
          productsCount
        )

        currentIndex = newIndex

        // Update all components in sequence for smooth experience
        updateDots()

        // Run transitions in parallel for better performance
        await Promise.all([
          updateProductDisplay(true),
          syncProductTitle(),
          syncProductInfo()
        ])

        // Preload adjacent images after transition
        setTimeout(preloadAdjacentImages, 100)

        restartAutoplay()
      }

      // Navigate to previous product
      const goToPrevious = () => {
        const newIndex = (currentIndex - 1 + productsCount) % productsCount
        goToIndex(newIndex)
      }

      // Navigate to next product
      const goToNext = () => {
        const newIndex = (currentIndex + 1) % productsCount
        goToIndex(newIndex)
      }

      // Setup navigation buttons
      if (showNavigation) {
        const prevButton = sliderNode.querySelector('.slider__nav--prev')
        const nextButton = sliderNode.querySelector('.slider__nav--next')

        if (prevButton) {
          prevButton.addEventListener('click', (e) => {
            e.preventDefault()
            goToPrevious()
          })
        }

        if (nextButton) {
          nextButton.addEventListener('click', (e) => {
            e.preventDefault()
            goToNext()
          })
        }
      }

      // Setup dots navigation
      if (showDots) {
        const dots = sliderNode.querySelectorAll('.slider__dot')
        dots.forEach((dot, index) => {
          dot.addEventListener('click', (e) => {
            e.preventDefault()
            goToIndex(index)
          })
        })
      }

      // Setup click navigation on adjacent products
      const setupAdjacentClicks = () => {
        // Não faz nada: remove navegação por clique nas imagens laterais
        // Mantém navegação apenas pelas setas
      }

      // Improved autoplay management
      const startAutoplay = () => {
        if (delay > 0 && !autoplayTimer) {
          autoplayTimer = setInterval(() => {
            if (!isTransitioning) {
              goToNext()
            }
          }, delay)
        }
      }

      const stopAutoplay = () => {
        if (autoplayTimer) {
          clearInterval(autoplayTimer)
          autoplayTimer = null
        }
      }

      const restartAutoplay = () => {
        stopAutoplay()
        // Delay restart to allow user interaction to complete
        setTimeout(() => {
          if (!sliderNode.matches(':hover')) {
            startAutoplay()
          }
        }, 1000)
      }

      // Keyboard navigation for the main slider
      sliderNode.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
          e.preventDefault()
          goToPrevious()
        } else if (e.key === 'ArrowRight') {
          e.preventDefault()
          goToNext()
        }
      })

      // Enhanced touch/swipe support for mobile
      let touchStartX = 0
      let touchEndX = 0
      let touchStartY = 0
      let touchEndY = 0
      let isDragging = false
      let touchStartTime = 0
      // Mouse drag support for desktop
      let mouseDown = false
      let mouseStartX = 0
      let mouseStartY = 0
      let mouseStartTime = 0

      sliderNode.addEventListener(
        'touchstart',
        (e) => {
          touchStartX = e.changedTouches[0].screenX
          touchStartY = e.changedTouches[0].screenY
          touchStartTime = Date.now()
          isDragging = false
          stopAutoplay()
        },
        { passive: true }
      )

      sliderNode.addEventListener(
        'touchmove',
        (e) => {
          if (!isDragging) {
            const diffX = Math.abs(e.changedTouches[0].screenX - touchStartX)
            const diffY = Math.abs(e.changedTouches[0].screenY - touchStartY)

            if (diffX > diffY && diffX > 15) {
              isDragging = true
            }
          }
        },
        { passive: true }
      )

      sliderNode.addEventListener(
        'touchend',
        (e) => {
          const touchEndTime = Date.now()
          const touchDuration = touchEndTime - touchStartTime

          if (isDragging && touchDuration < 500) {
            // Quick swipe
            touchEndX = e.changedTouches[0].screenX
            touchEndY = e.changedTouches[0].screenY

            const swipeThreshold = 50
            const diffX = touchStartX - touchEndX
            const diffY = Math.abs(touchStartY - touchEndY)

            if (Math.abs(diffX) > swipeThreshold && Math.abs(diffX) > diffY) {
              if (diffX > 0) {
                goToNext()
              } else {
                goToPrevious()
              }
            }
          }

          isDragging = false
          restartAutoplay()
        },
        { passive: true }
      )

      // Mouse drag events for desktop
      sliderNode.addEventListener('mousedown', (e) => {
        // Só ativa para botão esquerdo e não em mobile
        if (e.button !== 0 || window.matchMedia('(pointer: coarse)').matches)
          return
        mouseDown = true
        mouseStartX = e.screenX
        mouseStartY = e.screenY
        mouseStartTime = Date.now()
        isDragging = false
        stopAutoplay()
      })

      sliderNode.addEventListener('mousemove', (e) => {
        if (!mouseDown) return
        const diffX = Math.abs(e.screenX - mouseStartX)
        const diffY = Math.abs(e.screenY - mouseStartY)
        if (!isDragging && diffX > diffY && diffX > 15) {
          isDragging = true
        }
      })

      sliderNode.addEventListener('mouseup', (e) => {
        if (!mouseDown) return
        mouseDown = false
        const mouseEndTime = Date.now()
        const mouseDuration = mouseEndTime - mouseStartTime
        if (isDragging && mouseDuration < 500) {
          const diffX = mouseStartX - e.screenX
          const diffY = Math.abs(mouseStartY - e.screenY)
          const swipeThreshold = 50
          if (Math.abs(diffX) > swipeThreshold && Math.abs(diffX) > diffY) {
            if (diffX > 0) {
              goToNext()
            } else {
              goToPrevious()
            }
          }
        }
        isDragging = false
        restartAutoplay()
      })

      // Cancela drag se mouse sair do slider
      sliderNode.addEventListener('mouseleave', (e) => {
        mouseDown = false
        isDragging = false
      })

      // Mouse interactions for autoplay control
      sliderNode.addEventListener('mouseenter', stopAutoplay)
      sliderNode.addEventListener('mouseleave', () => {
        setTimeout(startAutoplay, 500)
      })

      // Intersection observer for performance and autoplay control
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              handleImageLoading()
              setTimeout(() => {
                preloadAdjacentImages()
                startAutoplay()
              }, 1000)
            } else {
              stopAutoplay()
            }
          })
        },
        { threshold: 0.3 }
      )

      observer.observe(sliderNode)

      // Resize handler for responsive behavior
      const handleResize = () => {
        // Re-setup after resize
        setTimeout(() => {
          setupAdjacentClicks()
          updateProductDisplay(false)
          handleImageLoading()
        }, 100)
      }

      window.addEventListener('resize', handleResize)

      // Enhanced accessibility
      sliderNode.setAttribute('role', 'region')
      sliderNode.setAttribute('aria-label', 'Galeria de produtos')
      sliderNode.setAttribute('aria-live', 'polite')

      // Mouse wheel support for desktop
      sliderNode.addEventListener(
        'wheel',
        (e) => {
          if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
            e.preventDefault()
            if (e.deltaX > 0) {
              goToNext()
            } else {
              goToPrevious()
            }
          }
        },
        { passive: false }
      )

      // CORRIGIDO: Initialize the slider with proper setup
      const init = async () => {
        console.log('Initializing slider with', productsCount, 'products')

        // Ensure we have valid products count
        if (productsCount <= 0) {
          console.error('No products found for slider')
          return
        }

        // Reset currentIndex to 0 for proper initialization
        currentIndex = 0

        // Set initial state without animation
        await updateProductDisplay(false)
        await syncProductTitle()
        await syncProductInfo()
        updateDots()
        setupAdjacentClicks()
        handleImageLoading()

        // Preload images after initial setup
        setTimeout(() => {
          preloadAdjacentImages()
          // Start autoplay after everything is loaded
          setTimeout(startAutoplay, 2000)
        }, 500)
      }

      // Cleanup function
      sliderNode.cleanup = () => {
        observer.disconnect()
        stopAutoplay()
        window.removeEventListener('resize', handleResize)
      }

      // Store references for external access
      sliderNode.goToIndex = goToIndex
      sliderNode.goToPrevious = goToPrevious
      sliderNode.goToNext = goToNext
      sliderNode.getCurrentIndex = () => currentIndex
      sliderNode.isTransitioning = () => isTransitioning

      // Initialize
      init()
    })
}

// Initialize on various Shopify events
document.addEventListener('DOMContentLoaded', initShowcaseSliders)
document.addEventListener('shopify:section:load', initShowcaseSliders)
document.addEventListener('shopify:section:reorder', initShowcaseSliders)

// Cleanup when section is removed
document.addEventListener('shopify:section:unload', (e) => {
  const slider = e.target.querySelector('.product-showcase-slider')
  if (slider && slider.cleanup) {
    slider.cleanup()
  }
})

// Export for external use if needed
export { initShowcaseSliders as default }
