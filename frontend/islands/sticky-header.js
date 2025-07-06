class StickyHeader extends window.HTMLElement {
  connectedCallback() {
    this.header = document.getElementById('shopify-section-header')
    this.headerElement = this.header.querySelector('header')
    this.headerBounds = {}
    this.currentScrollTop = 0
    this.preventReveal = false
    this.isFixed = this.headerElement.classList.contains('fixed')

    this.onScrollHandler = this.onScroll.bind(this)
    this.hideHeaderOnScrollUp = () => {
      this.preventReveal = true
    }

    window.addEventListener('scroll', this.onScrollHandler, false)

    this.createObserver()
  }

  createObserver() {
    const observer = new window.IntersectionObserver((entries, observer) => {
      this.headerBounds = entries[0].intersectionRect
      observer.disconnect()
    })

    observer.observe(this.header)
  }

  onScroll() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop

    if (this.predictiveSearch && this.predictiveSearch.isOpen) return

    // Se o header é fixo, usamos uma lógica diferente
    if (this.isFixed) {
      this.handleFixedHeader(scrollTop)
    } else {
      this.handleStickyHeader(scrollTop)
    }

    this.currentScrollTop = scrollTop
  }

  handleFixedHeader(scrollTop) {
    // Para header fixo, ocultamos após 100px de scroll para baixo
    if (scrollTop > this.currentScrollTop && scrollTop > 100) {
      if (this.preventHide) return
      window.requestAnimationFrame(this.hideFixed.bind(this))
    } else if (scrollTop < this.currentScrollTop && scrollTop > 100) {
      if (!this.preventReveal) {
        window.requestAnimationFrame(this.revealFixed.bind(this))
      } else {
        window.clearTimeout(this.isScrolling)
        this.isScrolling = setTimeout(() => {
          this.preventReveal = false
        }, 66)
        window.requestAnimationFrame(this.hideFixed.bind(this))
      }
    } else if (scrollTop <= 100) {
      window.requestAnimationFrame(this.resetFixed.bind(this))
    }
  }

  handleStickyHeader(scrollTop) {
    // Lógica original para header sticky
    if (
      scrollTop > this.currentScrollTop &&
      scrollTop > this.headerBounds.bottom
    ) {
      if (this.preventHide) return
      window.requestAnimationFrame(this.hide.bind(this))
    } else if (
      scrollTop < this.currentScrollTop &&
      scrollTop > this.headerBounds.bottom
    ) {
      if (!this.preventReveal) {
        window.requestAnimationFrame(this.reveal.bind(this))
      } else {
        window.clearTimeout(this.isScrolling)
        this.isScrolling = setTimeout(() => {
          this.preventReveal = false
        }, 66)
        window.requestAnimationFrame(this.hide.bind(this))
      }
    } else if (scrollTop <= this.headerBounds.top) {
      window.requestAnimationFrame(this.reset.bind(this))
    }
  }

  // Métodos para header fixo
  hideFixed() {
    this.headerElement.classList.add(
      '-translate-y-full',
      'transition-transform'
    )
  }

  revealFixed() {
    this.headerElement.classList.add('transition-transform')
    this.headerElement.classList.remove('-translate-y-full')
  }

  resetFixed() {
    this.headerElement.classList.remove(
      '-translate-y-full',
      'transition-transform'
    )
  }

  // Métodos originais para header sticky
  hide() {
    this.header.classList.add('-translate-y-full', 'sticky', 'top-0')
  }

  reveal() {
    this.header.classList.add('sticky', 'top-0', 'transition-transform')
    this.header.classList.remove('-translate-y-full')
  }

  reset() {
    this.header.classList.remove(
      '-translate-y-full',
      'sticky',
      'top-0',
      'transition-transform'
    )
  }
}

window.customElements.define('sticky-header', StickyHeader)
