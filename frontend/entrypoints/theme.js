import 'vite/modulepreload-polyfill'
import { initDisclosureWidgets } from '@/lib/a11y'
import { revive, islands } from '@/lib/revive.js'
import { initSliders } from '@/lib/slider.js'
import { initShowcaseSliders } from '@/lib/showcase.js'
import { initTestimonials } from '@/lib/testimonials.js'

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
  initShowcaseSliders()
  initTestimonials()

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
