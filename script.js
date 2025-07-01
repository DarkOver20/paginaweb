// Mobile Menu Toggle
const menuToggle = document.getElementById("menu-toggle")
const navLinks = document.querySelector(".nav-links")

menuToggle.addEventListener("click", () => {
  navLinks.classList.toggle("active")
})

// Close menu when clicking on a link
document.querySelectorAll(".nav-links a").forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("active")
  })
})

// Header scroll effect with hide/show functionality
document.addEventListener("DOMContentLoaded", () => {
  const header = document.getElementById("header")
  let lastScroll = 0
  const scrollThreshold = 100

  window.addEventListener("scroll", () => {
    const currentScroll = window.pageYOffset

    if (currentScroll <= 0) {
      header.classList.remove("hidden")
      header.classList.add("scrolled")
      return
    }

    if (currentScroll > lastScroll && currentScroll > scrollThreshold) {
      header.classList.add("hidden")
    } else if (currentScroll < lastScroll) {
      header.classList.remove("hidden")

      if (currentScroll > 50) {
        header.classList.add("scrolled")
      } else {
        header.classList.remove("scrolled")
      }
    }

    lastScroll = currentScroll
  })
})

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault()

    const targetId = this.getAttribute("href")
    const targetElement = document.querySelector(targetId)

    if (targetElement) {
      window.scrollTo({
        top: targetElement.offsetTop - 80,
        behavior: "smooth",
      })
    }
  })
})

// Cart functionality
const cart = []
const cartIcon = document.getElementById("cart-icon")
const cartModal = document.getElementById("cart-modal")
const closeCart = document.querySelector(".close-cart")
const cartCount = document.getElementById("cart-count")
const cartItemsContainer = document.getElementById("cart-items")
const subtotalElement = document.getElementById("subtotal")
const shippingElement = document.getElementById("shipping")
const discountElement = document.getElementById("discount")
const totalElement = document.getElementById("total")
const checkoutBtn = document.getElementById("checkout-btn")
const addToCartButtons = document.querySelectorAll(".add-to-cart, .add-to-cart-btn")

// Open/close cart
cartIcon.addEventListener("click", () => {
  cartModal.style.display = "block"
  document.body.style.overflow = "hidden"
})

closeCart.addEventListener("click", () => {
  cartModal.style.display = "none"
  document.body.style.overflow = "auto"
})

// Close when clicking outside modal
window.addEventListener("click", (e) => {
  if (e.target === cartModal) {
    cartModal.style.display = "none"
    document.body.style.overflow = "auto"
  }
})

// Function to update cart display
function updateCartDisplay() {
  cartItemsContainer.innerHTML = ""

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = `
            <div class="empty-cart">
                <i class="fas fa-shopping-cart"></i>
                <p>Tu carrito está vacío</p>
                <a href="#products" class="btn" onclick="cartModal.style.display='none'">Explorar Productos</a>
            </div>
        `
    subtotalElement.textContent = "$ 0.00"
    shippingElement.textContent = "$ 0.00"
    discountElement.textContent = "$ 0.00"
    totalElement.textContent = "$ 0.00"
    cartCount.textContent = "0"
    return
  }

  let subtotal = 0

  cart.forEach((item, index) => {
    const itemTotal = item.price * item.quantity
    subtotal += itemTotal

    const itemElement = document.createElement("div")
    itemElement.className = "cart-item"
    itemElement.innerHTML = `
            <div class="cart-item-info">
                <img src="${item.img}" alt="${item.name}" class="cart-item-img">
                <div class="cart-item-details">
                    <h4>${item.name}</h4>
                    <p>${item.quantity} x $${item.price.toFixed(2)}</p>
                </div>
            </div>
            <div class="cart-item-quantity">
                <button class="quantity-btn minus" data-index="${index}">-</button>
                <span>${item.quantity}</span>
                <button class="quantity-btn plus" data-index="${index}">+</button>
                <span class="cart-item-price">$${itemTotal.toFixed(2)}</span>
                <button class="remove-item" data-index="${index}">Eliminar</button>
            </div>
        `

    cartItemsContainer.appendChild(itemElement)
  })

  // Calculate totals
  const shipping = subtotal > 50 ? 0 : 5.99
  const discount = 0
  const total = subtotal + shipping - discount

  subtotalElement.textContent = `$ ${subtotal.toFixed(2)}`
  shippingElement.textContent = `$ ${shipping.toFixed(2)}`
  discountElement.textContent = `$ ${discount.toFixed(2)}`
  totalElement.textContent = `$ ${total.toFixed(2)}`
  cartCount.textContent = cart.reduce((total, item) => total + item.quantity, 0)

  // Add event listeners to new buttons
  document.querySelectorAll(".quantity-btn.minus").forEach((btn) => {
    btn.addEventListener("click", decreaseQuantity)
  })

  document.querySelectorAll(".quantity-btn.plus").forEach((btn) => {
    btn.addEventListener("click", increaseQuantity)
  })

  document.querySelectorAll(".remove-item").forEach((btn) => {
    btn.addEventListener("click", removeItem)
  })
}

// Function to add product to cart
function addToCart(event) {
  const button = event.target.closest(".add-to-cart, .add-to-cart-btn")
  if (!button) return

  const id = button.getAttribute("data-id")
  const name = button.getAttribute("data-name")
  const price = Number.parseFloat(button.getAttribute("data-price"))
  const img = button.getAttribute("data-img")

  const existingItem = cart.find((item) => item.id === id)

  if (existingItem) {
    existingItem.quantity += 1
  } else {
    cart.push({
      id,
      name,
      price,
      quantity: 1,
      img,
    })
  }

  updateCartDisplay()

  // Confirmation animation
  const originalText = button.innerHTML
  button.innerHTML = '<i class="fas fa-check"></i> Añadido'
  button.style.backgroundColor = "#4CAF50"

  setTimeout(() => {
    button.innerHTML = originalText
    button.style.backgroundColor = ""
  }, 2000)

  // Show cart automatically
  cartModal.style.display = "block"
  document.body.style.overflow = "hidden"
}

// Function to decrease quantity
function decreaseQuantity(event) {
  const index = event.target.getAttribute("data-index")
  if (cart[index].quantity > 1) {
    cart[index].quantity -= 1
    updateCartDisplay()
  }
}

// Function to increase quantity
function increaseQuantity(event) {
  const index = event.target.getAttribute("data-index")
  cart[index].quantity += 1
  updateCartDisplay()
}

// Function to remove item
function removeItem(event) {
  const index = event.target.getAttribute("data-index")
  cart.splice(index, 1)
  updateCartDisplay()
}

// Function to checkout
function checkout() {
  if (cart.length === 0) {
    alert("Tu carrito está vacío")
    return
  }

  let orderSummary = "¡Hola! Estoy interesado en los siguientes productos:\n\n"

  cart.forEach((item) => {
    orderSummary += `- ${item.name} (Cantidad: ${item.quantity}, Precio unitario: $${item.price.toFixed(2)})\n`
  })

  const subtotal = cart.reduce((total, item) => total + item.price * item.quantity, 0)
  const shipping = subtotal > 50 ? 0 : 5.99
  const total = subtotal + shipping

  orderSummary += `\nSubtotal: $${subtotal.toFixed(2)}`
  orderSummary += `\nEnvío: $${shipping.toFixed(2)}`
  orderSummary += `\nTotal: $${total.toFixed(2)}`
  orderSummary += `\n\nPor favor, indícame cómo proceder con el pago. ¡Gracias!`

  const encodedMessage = encodeURIComponent(orderSummary)
  const whatsappNumber = "1234567890"

  window.open(`https://wa.me/${whatsappNumber}?text=${encodedMessage}`, "_blank")

  cartModal.style.display = "none"
  document.body.style.overflow = "auto"
}

// ===== NUEVA FUNCIONALIDAD DE FILTROS INTELIGENTES =====

// Variables para filtros
const categoryPills = document.querySelectorAll(".category-pill")
const searchInputCompact = document.getElementById("search-input-compact")
const sortSelectCompact = document.getElementById("sort-select-compact")
const productCards = document.querySelectorAll(".product-card")
const resultsCount = document.getElementById("results-count")
const activeFiltersCompact = document.getElementById("active-filters-compact")
const activeFiltersList = document.getElementById("active-filters-list")

// Modal de filtros avanzados
const advancedFiltersBtn = document.getElementById("advanced-filters-btn")
const advancedFiltersModal = document.getElementById("advanced-filters-modal")
const closeAdvancedFilters = document.getElementById("close-advanced-filters")
const advancedSearchInput = document.getElementById("advanced-search-input")
const priceMin = document.getElementById("price-min")
const priceMax = document.getElementById("price-max")
const priceRange = document.getElementById("price-range")
const brandFilters = document.querySelectorAll(".brand-filter")
const availabilityFilters = document.querySelectorAll(".availability-filter")
const clearFiltersBtn = document.getElementById("clear-filters")
const applyFiltersBtn = document.getElementById("apply-filters")

// Estado de filtros
let currentFilters = {
  category: "all",
  search: "",
  sort: "featured",
  priceMin: 0,
  priceMax: 50,
  brands: [],
  availability: [],
}

// Función para actualizar el contador de resultados
function updateResultsCount() {
  const visibleProducts = document.querySelectorAll('.product-card:not([style*="display: none"])')
  const count = visibleProducts.length
  resultsCount.textContent = `${count} producto${count !== 1 ? "s" : ""} encontrado${count !== 1 ? "s" : ""}`

  // Actualizar contadores en pills de categoría
  categoryPills.forEach((pill) => {
    const filter = pill.getAttribute("data-filter")
    let filterCount = 0

    if (filter === "all") {
      filterCount = productCards.length
    } else {
      productCards.forEach((card) => {
        const category = card.getAttribute("data-category")
        if (category === filter) filterCount++
      })
    }

    const countElement = pill.querySelector(".pill-count")
    if (countElement) {
      countElement.textContent = filterCount
    }
  })
}

// Función para mostrar/ocultar filtros activos
function updateActiveFilters() {
  const hasActiveFilters =
    currentFilters.category !== "all" ||
    currentFilters.search !== "" ||
    currentFilters.brands.length > 0 ||
    currentFilters.availability.length > 0 ||
    currentFilters.priceMin > 0 ||
    currentFilters.priceMax < 50

  if (hasActiveFilters) {
    activeFiltersCompact.classList.add("show")
    activeFiltersList.innerHTML = ""

    // Agregar filtro de categoría
    if (currentFilters.category !== "all") {
      const categoryBtn = document.querySelector(`[data-filter="${currentFilters.category}"]`)
      const categoryName = categoryBtn ? categoryBtn.querySelector("span").textContent : currentFilters.category

      const filterTag = document.createElement("div")
      filterTag.className = "active-filter-tag"
      filterTag.innerHTML = `
                ${categoryName}
                <button class="remove-filter" data-type="category">
                    <i class="fas fa-times"></i>
                </button>
            `
      activeFiltersList.appendChild(filterTag)
    }

    // Agregar filtro de búsqueda
    if (currentFilters.search !== "") {
      const filterTag = document.createElement("div")
      filterTag.className = "active-filter-tag"
      filterTag.innerHTML = `
                "${currentFilters.search}"
                <button class="remove-filter" data-type="search">
                    <i class="fas fa-times"></i>
                </button>
            `
      activeFiltersList.appendChild(filterTag)
    }

    // Agregar filtros de marca
    currentFilters.brands.forEach((brand) => {
      const filterTag = document.createElement("div")
      filterTag.className = "active-filter-tag"
      filterTag.innerHTML = `
                ${brand}
                <button class="remove-filter" data-type="brand" data-value="${brand}">
                    <i class="fas fa-times"></i>
                </button>
            `
      activeFiltersList.appendChild(filterTag)
    })

    // Agregar event listeners a los botones de eliminar
    document.querySelectorAll(".remove-filter").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const type = e.target.closest(".remove-filter").getAttribute("data-type")
        const value = e.target.closest(".remove-filter").getAttribute("data-value")

        if (type === "category") {
          currentFilters.category = "all"
          categoryPills.forEach((btn) => btn.classList.remove("active"))
          document.querySelector('[data-filter="all"]').classList.add("active")
        } else if (type === "search") {
          currentFilters.search = ""
          searchInputCompact.value = ""
          advancedSearchInput.value = ""
        } else if (type === "brand") {
          currentFilters.brands = currentFilters.brands.filter((b) => b !== value)
          const checkbox = document.querySelector(`[value="${value}"]`)
          if (checkbox) checkbox.checked = false
        }
        applyFilters()
      })
    })
  } else {
    activeFiltersCompact.classList.remove("show")
  }
}

// Función principal para aplicar filtros
function applyFilters() {
  productCards.forEach((card) => {
    const category = card.getAttribute("data-category") || "all"
    const name = card.getAttribute("data-name").toLowerCase()
    const price = Number.parseFloat(card.getAttribute("data-price"))

    // Filtro por categoría
    const categoryMatch = currentFilters.category === "all" || category === currentFilters.category

    // Filtro por búsqueda
    const searchMatch = currentFilters.search === "" || name.includes(currentFilters.search.toLowerCase())

    // Filtro por precio
    const priceMatch = price >= currentFilters.priceMin && price <= currentFilters.priceMax

    // Mostrar/ocultar producto
    if (categoryMatch && searchMatch && priceMatch) {
      card.style.display = "block"
    } else {
      card.style.display = "none"
    }
  })

  // Aplicar ordenamiento
  applySorting()

  // Actualizar UI
  updateResultsCount()
  updateActiveFilters()
}

// Función para aplicar ordenamiento
function applySorting() {
  const productGrid = document.querySelector(".product-grid")
  const visibleProducts = Array.from(productCards).filter((card) => card.style.display !== "none")

  visibleProducts.sort((a, b) => {
    switch (currentFilters.sort) {
      case "price-low":
        const priceA = Number.parseFloat(a.getAttribute("data-price"))
        const priceB = Number.parseFloat(b.getAttribute("data-price"))
        return priceA - priceB

      case "price-high":
        const priceA2 = Number.parseFloat(a.getAttribute("data-price"))
        const priceB2 = Number.parseFloat(b.getAttribute("data-price"))
        return priceB2 - priceA2

      case "name":
        const nameA = a.getAttribute("data-name")
        const nameB = b.getAttribute("data-name")
        return nameA.localeCompare(nameB)

      case "newest":
        // Simular ordenamiento por fecha (productos con badge "Nuevo" primero)
        const isNewA = a.querySelector(".product-badge")?.textContent === "Nuevo" ? 1 : 0
        const isNewB = b.querySelector(".product-badge")?.textContent === "Nuevo" ? 1 : 0
        return isNewB - isNewA

      default: // featured
        return 0
    }
  })

  // Reordenar elementos en el DOM
  visibleProducts.forEach((product) => {
    productGrid.appendChild(product)
  })
}

// Event listeners para filtros rápidos

// Filtros por categoría
categoryPills.forEach((pill) => {
  pill.addEventListener("click", () => {
    const filter = pill.getAttribute("data-filter")
    currentFilters.category = filter

    // Actualizar pill activo
    categoryPills.forEach((p) => p.classList.remove("active"))
    pill.classList.add("active")

    applyFilters()
  })
})

// Búsqueda compacta
searchInputCompact.addEventListener("input", (e) => {
  currentFilters.search = e.target.value
  advancedSearchInput.value = e.target.value

  // Aplicar filtros con debounce
  clearTimeout(searchInputCompact.debounceTimer)
  searchInputCompact.debounceTimer = setTimeout(() => {
    applyFilters()
  }, 300)
})

// Ordenamiento
sortSelectCompact.addEventListener("change", (e) => {
  currentFilters.sort = e.target.value
  applyFilters()
})

// Modal de filtros avanzados
advancedFiltersBtn.addEventListener("click", () => {
  advancedFiltersModal.style.display = "block"
  document.body.style.overflow = "hidden"
})

closeAdvancedFilters.addEventListener("click", () => {
  advancedFiltersModal.style.display = "none"
  document.body.style.overflow = "auto"
})

// Cerrar modal al hacer clic en el overlay
document.querySelector(".modal-overlay").addEventListener("click", () => {
  advancedFiltersModal.style.display = "none"
  document.body.style.overflow = "auto"
})

// Búsqueda avanzada
advancedSearchInput.addEventListener("input", (e) => {
  currentFilters.search = e.target.value
  searchInputCompact.value = e.target.value
})

// Filtros de precio
priceMin.addEventListener("input", (e) => {
  currentFilters.priceMin = Number.parseFloat(e.target.value) || 0
  priceRange.value = currentFilters.priceMin
})

priceMax.addEventListener("input", (e) => {
  currentFilters.priceMax = Number.parseFloat(e.target.value) || 50
})

priceRange.addEventListener("input", (e) => {
  currentFilters.priceMin = Number.parseFloat(e.target.value)
  priceMin.value = currentFilters.priceMin
})

// Filtros de marca
brandFilters.forEach((filter) => {
  filter.addEventListener("change", (e) => {
    const brand = e.target.value
    if (e.target.checked) {
      if (!currentFilters.brands.includes(brand)) {
        currentFilters.brands.push(brand)
      }
    } else {
      currentFilters.brands = currentFilters.brands.filter((b) => b !== brand)
    }
  })
})

// Limpiar filtros
clearFiltersBtn.addEventListener("click", () => {
  currentFilters = {
    category: "all",
    search: "",
    sort: "featured",
    priceMin: 0,
    priceMax: 50,
    brands: [],
    availability: [],
  }

  // Resetear UI
  categoryPills.forEach((btn) => btn.classList.remove("active"))
  document.querySelector('[data-filter="all"]').classList.add("active")
  searchInputCompact.value = ""
  advancedSearchInput.value = ""
  sortSelectCompact.value = "featured"
  priceMin.value = ""
  priceMax.value = ""
  priceRange.value = "0"
  brandFilters.forEach((f) => (f.checked = false))
  availabilityFilters.forEach((f) => (f.checked = false))

  applyFilters()
})

// Aplicar filtros avanzados
applyFiltersBtn.addEventListener("click", () => {
  applyFilters()
  advancedFiltersModal.style.display = "none"
  document.body.style.overflow = "auto"
})

// Tone selector functionality
function setupToneSelectors() {
  document.querySelectorAll(".tone-option").forEach((option) => {
    option.addEventListener("click", function () {
      const productCard = this.closest(".product-card")
      const mainImage = productCard.querySelector(".main-product-img")
      const newImageSrc = this.getAttribute("data-img")
      const toneName = this.getAttribute("data-tone")

      // Actualizar la imagen principal
      mainImage.src = newImageSrc

      // Actualizar el botón activo
      productCard.querySelectorAll(".tone-option").forEach((opt) => {
        opt.classList.remove("active")
      })
      this.classList.add("active")

      // Actualizar el data-tone en el botón de añadir al carrito
      const addToCartBtn = productCard.querySelector(".add-to-cart")
      if (addToCartBtn) {
        addToCartBtn.setAttribute("data-tone", toneName)
        addToCartBtn.setAttribute("data-img", newImageSrc)
      }
    })
  })
}

// Event listeners
addToCartButtons.forEach((button) => {
  button.addEventListener("click", addToCart)
})

checkoutBtn.addEventListener("click", checkout)

// Initialize
document.addEventListener("DOMContentLoaded", () => {
  setupToneSelectors()
  updateCartDisplay()
  updateResultsCount()

  // Animation on scroll
  function animateOnScroll() {
    const elements = document.querySelectorAll(".product-card, .section-title")

    elements.forEach((element) => {
      const elementPosition = element.getBoundingClientRect().top
      const screenPosition = window.innerHeight / 1.3

      if (elementPosition < screenPosition) {
        element.style.opacity = "1"
        element.style.transform = "translateY(0)"
      }
    })
  }

  // Set initial state for animated elements
  document.querySelectorAll(".product-card, .section-title").forEach((el) => {
    el.style.opacity = "0"
    el.style.transform = "translateY(30px)"
    el.style.transition = "opacity 0.6s ease, transform 0.6s ease"
  })

  window.addEventListener("scroll", animateOnScroll)
  window.addEventListener("load", animateOnScroll)
})
