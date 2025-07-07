import 'vite/modulepreload-polyfill'
import { initDisclosureWidgets } from '@/lib/a11y'
import { revive, islands } from '@/lib/revive.js'
import { initSliders } from '@/lib/slider.js'

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
  initSliders()

  // Function to check drawer states and toggle sidebar_opened class
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

  // Observe cart-drawer state changes
  const cartDrawer = document.querySelector('cart-drawer')
  if (cartDrawer) {
    const observer = new MutationObserver(toggleSidebarClass)
    observer.observe(cartDrawer, {
      attributes: true,
      attributeFilter: ['class']
    })
  }

  // Observe header-drawer state changes with retry mechanism
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
        // Retry after a short delay if details element is not found
        setTimeout(setupHeaderDrawerObserver, 100)
      }
    }
  }

  setupHeaderDrawerObserver()
})
