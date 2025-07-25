import 'vite/modulepreload-polyfill'
import { initDisclosureWidgets } from '@/lib/a11y'
import { revive, islands } from '@/lib/revive.js'
function initSmoothScrollButton() {
  const scrollButton = document.querySelector('[data-scroll-to-next-section]')

  if (!scrollButton) {
    return
  }

  const smoothScrollTo = (targetY, duration = 1000) => {
    const startY = window.pageYOffset
    const distance = targetY - startY
    let startTime = null

    // Easing function: easeInOutQuad
    // t: current time, b: beginning value, c: change in value, d: duration
    const ease = (t, b, c, d) => {
      t /= d / 2
      if (t < 1) return (c / 2) * t * t + b
      t--
      return (-c / 2) * (t * (t - 2) - 1) + b
    }

    const animation = (currentTime) => {
      if (startTime === null) startTime = currentTime
      const timeElapsed = currentTime - startTime
      window.scrollTo(0, ease(timeElapsed, startY, distance, duration))
      if (timeElapsed < duration) {
        requestAnimationFrame(animation)
      }
    }

    requestAnimationFrame(animation)
  }

  scrollButton.addEventListener('click', function (event) {
    event.preventDefault()
    const currentSection = this.closest('.shopify-section')
    const nextSection = currentSection
      ? currentSection.nextElementSibling
      : null
    if (nextSection) {
      const header = document.getElementById('shopify-section-header')
      const headerHeight = header ? header.offsetHeight : 0
      const targetPosition = nextSection.offsetTop - headerHeight
      smoothScrollTo(targetPosition, 1000) // A duração é em milissegundos (1000ms = 1 segundo)
    }
  })
}
document.addEventListener('DOMContentLoaded', () => {
  const summaries = document.querySelectorAll('[id^="Details-"] summary')

  const sizeScreen = window.innerWidth - document.body.clientWidth
  if (sizeScreen > 0) {
    document
      .querySelector('html')
      .setAttribute('style', `--padding-right: ${sizeScreen}px`)
  }

  revive(islands)
  initDisclosureWidgets(summaries)
  initSmoothScrollButton()

  const toggleSidebarClass = () => {
    const cartDrawer = document.querySelector('cart-drawer')
    const headerDrawer = document.querySelector('header-drawer')
    const htmlElement = document.querySelector('html')

    const isCartDrawerOpen = cartDrawer?.classList.contains('active')
    const isHeaderDrawerOpen = headerDrawer
      ?.querySelector('details')
      ?.hasAttribute('open')

    if (isCartDrawerOpen || isHeaderDrawerOpen) {
      htmlElement.classList.add('sidebar_opened')
    } else {
      htmlElement.classList.remove('sidebar_opened')
    }
  }

  const cartDrawer = document.querySelector('cart-drawer')
  if (cartDrawer) {
    const observer = new MutationObserver(toggleSidebarClass)
    observer.observe(cartDrawer, {
      attributes: true,
      attributeFilter: ['class']
    })
  }

  const setupHeaderDrawerObserver = () => {
    const headerDrawer = document.querySelector('header-drawer')
    if (headerDrawer) {
      const detailsElement = headerDrawer.querySelector('details')
      if (detailsElement) {
        const observer = new MutationObserver(toggleSidebarClass)
        observer.observe(detailsElement, {
          attributes: true,
          attributeFilter: ['open']
        })
      } else {
        setTimeout(setupHeaderDrawerObserver, 100)
      }
    }
  }

  setupHeaderDrawerObserver()
})
