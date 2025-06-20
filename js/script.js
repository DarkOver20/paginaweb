document.addEventListener('DOMContentLoaded', function() {
    // Menu Toggle Mobile
    const menuToggle = document.querySelector('.menu-toggle');
    const navbar = document.querySelector('.navbar');

    menuToggle.addEventListener('click', function() {
        navbar.classList.toggle('active');
    });

    // Carrusel Hero
    const carouselItems = document.querySelectorAll('.carousel-item');
    const prevBtn = document.querySelector('.carousel-prev');
    const nextBtn = document.querySelector('.carousel-next');
    let currentIndex = 0;

    function showSlide(index) {
        carouselItems.forEach(item => item.classList.remove('active'));
        carouselItems[index].classList.add('active');
    }

    function nextSlide() {
        currentIndex = (currentIndex + 1) % carouselItems.length;
        showSlide(currentIndex);
    }

    function prevSlide() {
        currentIndex = (currentIndex - 1 + carouselItems.length) % carouselItems.length;
        showSlide(currentIndex);
    }

    // Cambio automático cada 10 segundos
    let slideInterval = setInterval(nextSlide, 10000);

    // Event listeners para controles
    nextBtn.addEventListener('click', function() {
        clearInterval(slideInterval);
        nextSlide();
        slideInterval = setInterval(nextSlide, 10000);
    });

    prevBtn.addEventListener('click', function() {
        clearInterval(slideInterval);
        prevSlide();
        slideInterval = setInterval(nextSlide, 10000);
    });

    // Smooth scrolling para enlaces
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

                // Cerrar menú móvil si está abierto
                if (navbar.classList.contains('active')) {
                    navbar.classList.remove('active');
                }
            }
        });
    });

    // Efecto de aparición al hacer scroll
    const animateOnScroll = function() {
        const elements = document.querySelectorAll('.payment-card, .product-card');
        
        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const screenPosition = window.innerHeight / 1.3;
            
            if (elementPosition < screenPosition) {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        });
    };

    // Aplicar estilos iniciales para la animación
    document.querySelectorAll('.payment-card, .product-card').forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    });

    window.addEventListener('scroll', animateOnScroll);
    animateOnScroll(); // Ejecutar una vez al cargar
});


// Filtrado de productos
const filterButtons = document.querySelectorAll('.filter-btn');
const productCards = document.querySelectorAll('.product-card');
const searchInput = document.querySelector('.search-input');

// Asignar orden para animación escalonada
productCards.forEach((card, index) => {
    card.style.setProperty('--order', index);
});

filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Cambiar botón activo
        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        
        const filter = button.dataset.filter;
        
        // Filtrar productos
        productCards.forEach(card => {
            if (filter === 'all' || card.dataset.category === filter) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    });
});

// Búsqueda en tiempo real
searchInput.addEventListener('input', () => {
    const searchTerm = searchInput.value.toLowerCase();
    
    productCards.forEach(card => {
        const productName = card.querySelector('h3').textContent.toLowerCase();
        const productDesc = card.querySelector('.product-description').textContent.toLowerCase();
        
        if (productName.includes(searchTerm) || productDesc.includes(searchTerm)) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
});

// Transformación visual al filtrar
