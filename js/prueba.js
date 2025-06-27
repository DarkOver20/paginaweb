  // Mobile Menu Toggle
    const menuToggle = document.getElementById('menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    menuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });
    
    // Close menu when clicking on a link
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
        });
    });
    
    // Header scroll effect
    window.addEventListener('scroll', () => {
        const header = document.getElementById('header');
        header.classList.toggle('scrolled', window.scrollY > 50);
    });
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Cart functionality
    let cart = [];
    const cartIcon = document.getElementById('cart-icon');
    const cartModal = document.getElementById('cart-modal');
    const closeCart = document.querySelector('.close-cart');
    const cartCount = document.getElementById('cart-count');
    const cartItemsContainer = document.getElementById('cart-items');
    const subtotalElement = document.getElementById('subtotal');
    const shippingElement = document.getElementById('shipping');
    const discountElement = document.getElementById('discount');
    const totalElement = document.getElementById('total');
    const checkoutBtn = document.getElementById('checkout-btn');
    const addToCartButtons = document.querySelectorAll('.add-to-cart, .add-to-cart-btn');
    
    // Open/close cart
    cartIcon.addEventListener('click', () => {
        cartModal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    });
    
    closeCart.addEventListener('click', () => {
        cartModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    });
    
    // Close when clicking outside modal
    window.addEventListener('click', (e) => {
        if (e.target === cartModal) {
            cartModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });
    
    // Function to update cart display
    function updateCartDisplay() {
        cartItemsContainer.innerHTML = '';
        
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = `
                <div class="empty-cart">
                    <i class="fas fa-shopping-cart"></i>
                    <p>Tu carrito está vacío</p>
                    <a href="#products" class="btn" onclick="cartModal.style.display='none'">Explorar Productos</a>
                </div>
            `;
            subtotalElement.textContent = '$ 0.00';
            shippingElement.textContent = '$ 0.00';
            discountElement.textContent = '$ 0.00';
            totalElement.textContent = '$ 0.00';
            cartCount.textContent = '0';
            return;
        }
        
        let subtotal = 0;
        
        cart.forEach((item, index) => {
            const itemTotal = item.price * item.quantity;
            subtotal += itemTotal;
            
            const itemElement = document.createElement('div');
            itemElement.className = 'cart-item';
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
            `;
            
            cartItemsContainer.appendChild(itemElement);
        });
        
        // Calculate totals
        const shipping = subtotal > 50 ? 0 : 5.99;
        const discount = 0; // You can implement discount logic here
        const total = subtotal + shipping - discount;
        
        subtotalElement.textContent = `$ ${subtotal.toFixed(2)}`;
        shippingElement.textContent = `$ ${shipping.toFixed(2)}`;
        discountElement.textContent = `$ ${discount.toFixed(2)}`;
        totalElement.textContent = `$ ${total.toFixed(2)}`;
        cartCount.textContent = cart.reduce((total, item) => total + item.quantity, 0);
        
        // Add event listeners to new buttons
        document.querySelectorAll('.quantity-btn.minus').forEach(btn => {
            btn.addEventListener('click', decreaseQuantity);
        });
        
        document.querySelectorAll('.quantity-btn.plus').forEach(btn => {
            btn.addEventListener('click', increaseQuantity);
        });
        
        document.querySelectorAll('.remove-item').forEach(btn => {
            btn.addEventListener('click', removeItem);
        });
    }
    
    // Function to add product to cart
    function addToCart(event) {
        const button = event.target.closest('.add-to-cart, .add-to-cart-btn');
        if (!button) return;
        
        const id = button.getAttribute('data-id');
        const name = button.getAttribute('data-name');
        const price = parseFloat(button.getAttribute('data-price'));
        const img = button.getAttribute('data-img');
        
        // Check if product already in cart
        const existingItem = cart.find(item => item.id === id);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({
                id,
                name,
                price,
                quantity: 1,
                img
            });
        }
        
        updateCartDisplay();
        
        // Confirmation animation
        const originalText = button.innerHTML;
        button.innerHTML = '<i class="fas fa-check"></i> Añadido';
        button.style.backgroundColor = '#4CAF50';
        
        setTimeout(() => {
            button.innerHTML = originalText;
            button.style.backgroundColor = '';
        }, 2000);
        
        // Show cart automatically
        cartModal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }
    
    // Function to decrease quantity
    function decreaseQuantity(event) {
        const index = event.target.getAttribute('data-index');
        if (cart[index].quantity > 1) {
            cart[index].quantity -= 1;
            updateCartDisplay();
        }
    }
    
    // Function to increase quantity
    function increaseQuantity(event) {
        const index = event.target.getAttribute('data-index');
        cart[index].quantity += 1;
        updateCartDisplay();
    }
    
    // Function to remove item
    function removeItem(event) {
        const index = event.target.getAttribute('data-index');
        cart.splice(index, 1);
        updateCartDisplay();
    }
    
    // Function to checkout
    function checkout() {
        if (cart.length === 0) {
            alert('Tu carrito está vacío');
            return;
        }
        
        // Create order summary
        let orderSummary = "¡Hola! Estoy interesado en los siguientes productos:\n\n";
        
        cart.forEach(item => {
            orderSummary += `- ${item.name} (Cantidad: ${item.quantity}, Precio unitario: $${item.price.toFixed(2)})\n`;
        });
        
        const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
        const shipping = subtotal > 50 ? 0 : 5.99;
        const total = subtotal + shipping;
        
        orderSummary += `\nSubtotal: $${subtotal.toFixed(2)}`;
        orderSummary += `\nEnv\u00edo: $${shipping.toFixed(2)}`;
        orderSummary += `\nTotal: $${total.toFixed(2)}`;
        orderSummary += `\n\nPor favor, ind\u00edcame c\u00f3mo proceder con el pago. ¡Gracias!`;
        
        // Encode message for WhatsApp
        const encodedMessage = encodeURIComponent(orderSummary);
        const whatsappNumber = "1234567890"; // Replace with your WhatsApp number
        
        // Open WhatsApp with message
        window.open(`https://wa.me/${whatsappNumber}?text=${encodedMessage}`, '_blank');
        
        // Close modal
        cartModal.style.display = 'none';
        document.body.style.overflow = 'auto';
        
        // Optional: Clear cart after checkout
        // cart = [];
        // updateCartDisplay();
    }
    
    // Product filtering and search functionality
    const filterButtons = document.querySelectorAll('.filter-btn');
    const searchInput = document.querySelector('.search-input');
    const productCards = document.querySelectorAll('.product-card');
    
    // Filter products by category
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const filter = button.getAttribute('data-filter');
            
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // Filter products
            productCards.forEach(card => {
                const category = card.getAttribute('data-category') || 'all';
                
                if (filter === 'all' || category === filter) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
    
    // Search products
    searchInput.addEventListener('input', () => {
        const searchTerm = searchInput.value.toLowerCase();
        
        productCards.forEach(card => {
            const name = card.querySelector('h3').textContent.toLowerCase();
            const description = card.querySelector('p').textContent.toLowerCase();
            
            if (name.includes(searchTerm) || description.includes(searchTerm)) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    });
    
    // Event listeners
    addToCartButtons.forEach(button => {
        button.addEventListener('click', addToCart);
    });
    
    checkoutBtn.addEventListener('click', checkout);
    
    // Initialize cart
    updateCartDisplay();
    
    // Animation on scroll
    function animateOnScroll() {
        const elements = document.querySelectorAll('.product-card, .section-title');
        
        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const screenPosition = window.innerHeight / 1.3;
            
            if (elementPosition < screenPosition) {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        });
    }
    
    // Set initial state for animated elements
    document.querySelectorAll('.product-card, .section-title').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    });
    
    window.addEventListener('scroll', animateOnScroll);
    window.addEventListener('load', animateOnScroll);
// Cambiar imagen y datos según el tono seleccionado para el primer producto
document.addEventListener('DOMContentLoaded', function() {
    // Función para manejar el cambio de tonos
    function setupToneSelectors() {
        document.querySelectorAll('.tone-option').forEach(option => {
            option.addEventListener('click', function() {
                const productCard = this.closest('.product-card');
                const mainImage = productCard.querySelector('.main-product-img');
                const newImageSrc = this.getAttribute('data-img');
                const toneName = this.getAttribute('data-tone');
                
                // Actualizar la imagen principal
                mainImage.src = newImageSrc;
                
                // Actualizar el botón activo
                productCard.querySelectorAll('.tone-option').forEach(opt => {
                    opt.classList.remove('active');
                });
                this.classList.add('active');
                
                // Actualizar el data-tone en el botón de añadir al carrito
                const addToCartBtn = productCard.querySelector('.add-to-cart');
                if (addToCartBtn) {
                    addToCartBtn.setAttribute('data-tone', toneName);
                    addToCartBtn.setAttribute('data-img', newImageSrc);
                }
            });
        });
    }
    
    // Inicializar los selectores de tono
    setupToneSelectors();
    
    // Tu código existente del carrito aquí...
});


document.addEventListener('DOMContentLoaded', function() {
    const header = document.getElementById('header');
    let lastScroll = 0;
    const scrollThreshold = 100; // Cuántos píxeles hay que desplazar para activar el efecto
    
    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll <= 0) {
            // Estamos en la parte superior de la página
            header.classList.remove('hidden');
            header.classList.add('scrolled');
            return;
        }
        
        if (currentScroll > lastScroll && currentScroll > scrollThreshold) {
            // Scroll hacia abajo - ocultar header
            header.classList.add('hidden');
        } else if (currentScroll < lastScroll) {
            // Scroll hacia arriba - mostrar header
            header.classList.remove('hidden');
            
            // Añadir clase scrolled si no está en la parte superior
            if (currentScroll > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        }
        
        lastScroll = currentScroll;
    });

    // Tu código existente para el selector de tonos...
    function setupToneSelectors() {
        document.querySelectorAll('.tone-option').forEach(option => {
            option.addEventListener('click', function() {
                const productCard = this.closest('.product-card');
                const mainImage = productCard.querySelector('.main-product-img');
                const newImageSrc = this.getAttribute('data-img');
                const toneName = this.getAttribute('data-tone');
                
                // Actualizar la imagen principal
                mainImage.src = newImageSrc;
                
                // Actualizar el botón activo
                productCard.querySelectorAll('.tone-option').forEach(opt => {
                    opt.classList.remove('active');
                });
                this.classList.add('active');
                
                // Actualizar el data-tone en el botón de añadir al carrito
                const addToCartBtn = productCard.querySelector('.add-to-cart');
                if (addToCartBtn) {
                    addToCartBtn.setAttribute('data-tone', toneName);
                    addToCartBtn.setAttribute('data-img', newImageSrc);
                }
            });
        });
    }
    
    setupToneSelectors();
});
