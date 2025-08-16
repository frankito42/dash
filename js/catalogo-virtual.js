 const productos = [
            {
                id: 1,
                nombre: "Pan Integral",
                descripcion: "Pan fresco integral, elaborado diariamente con ingredientes naturales",
                precio: 150,
                categoria: "panaderia",
                stock: 25,
                imagen: null
            },
            {
                id: 2,
                nombre: "Coca Cola 500ml",
                descripcion: "Bebida gaseosa refrescante, lata de 500ml",
                precio: 180,
                categoria: "bebidas",
                stock: 50,
                imagen: null
            },
            {
                id: 3,
                nombre: "Papas Fritas",
                descripcion: "Papas fritas crujientes sabor original",
                precio: 120,
                categoria: "snacks",
                stock: 30,
                imagen: null
            },
            {
                id: 4,
                nombre: "Leche Entera 1L",
                descripcion: "Leche fresca entera, rico en calcio y proteínas",
                precio: 200,
                categoria: "lacteos",
                stock: 20,
                imagen: null
            },
            {
                id: 5,
                nombre: "Croissant",
                descripcion: "Croissant de manteca, horneado en el día",
                precio: 80,
                categoria: "panaderia",
                stock: 15,
                imagen: null
            },
            {
                id: 6,
                nombre: "Agua Mineral",
                descripcion: "Agua mineral natural sin gas 500ml",
                precio: 90,
                categoria: "bebidas",
                stock: 40,
                imagen: null
            }
        ];

        // Estado del carrito
        let carrito = [];
        let filtroActual = 'todos';
        let busquedaActual = '';

        // Elementos del DOM
        const productsGrid = document.getElementById('productsGrid');
        const cartButton = document.getElementById('cartButton');
        const cartPanel = document.getElementById('cartPanel');
        const cartOverlay = document.getElementById('cartOverlay');
        const closeCartBtn = document.getElementById('closeCartBtn');
        const cartItems = document.getElementById('cartItems');
        const cartCount = document.getElementById('cartCount');
        const cartTotal = document.getElementById('cartTotal');
        const cartTotalAmount = document.getElementById('cartTotalAmount');
        const searchInput = document.getElementById('searchInput');
        const categoryFilters = document.getElementById('categoryFilters');

        // Inicializar la aplicación
        function init() {
            renderProducts();
            setupEventListeners();
        }

        // Configurar event listeners
        function setupEventListeners() {
            // Carrito
            cartButton.addEventListener('click', toggleCart);
            closeCartBtn.addEventListener('click', closeCart);
            cartOverlay.addEventListener('click', closeCart);

            // Búsqueda
            searchInput.addEventListener('input', handleSearch);

            // Filtros de categoría
            categoryFilters.addEventListener('click', handleCategoryFilter);
        }

        // Renderizar productos
        function renderProducts() {
            const productosFiltrados = filtrarProductos();
            
            if (productosFiltrados.length === 0) {
                productsGrid.innerHTML = `
                    <div class="no-products">
                        <svg class="no-products-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                            <circle cx="11" cy="11" r="8"/>
                            <path d="m21 21-4.35-4.35"/>
                        </svg>
                        <h3>No se encontraron productos</h3>
                        <p>Intenta cambiar los filtros de búsqueda</p>
                    </div>
                `;
                return;
            }

            productsGrid.innerHTML = productosFiltrados.map(producto => `
                <div class="product-card">
                    <div class="product-image">
                        <span class="product-category">${getCategoryName(producto.categoria)}</span>
                    </div>
                    <div class="product-info">
                        <h3 class="product-name">${producto.nombre}</h3>
                        <p class="product-description">${producto.descripcion}</p>
                        <div class="product-price">${producto.precio}</div>
                        <div class="product-stock">
                            <svg class="stock-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
                                <polyline points="3.27,6.96 12,12.01 20.73,6.96"/>
                                <line x1="12" y1="22.08" x2="12" y2="12"/>
                            </svg>
                            ${producto.stock} disponibles
                        </div>
                        <button class="add-to-cart-btn" onclick="addToCart(${producto.id})">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M12 5v14M5 12h14"/>
                            </svg>
                            Agregar al carrito
                        </button>
                    </div>
                </div>
            `).join('');
        }

        // Filtrar productos según búsqueda y categoría
        function filtrarProductos() {
            return productos.filter(producto => {
                const coincideBusqueda = producto.nombre.toLowerCase().includes(busquedaActual.toLowerCase()) ||
                                       producto.descripcion.toLowerCase().includes(busquedaActual.toLowerCase());
                const coincideCategoria = filtroActual === 'todos' || producto.categoria === filtroActual;
                
                return coincideBusqueda && coincideCategoria;
            });
        }

        // Obtener nombre legible de la categoría
        function getCategoryName(categoria) {
            const nombres = {
                'panaderia': 'Panadería',
                'bebidas': 'Bebidas',
                'snacks': 'Snacks',
                'lacteos': 'Lácteos'
            };
            return nombres[categoria] || categoria;
        }

        // Manejar búsqueda
        function handleSearch(event) {
            busquedaActual = event.target.value;
            renderProducts();
        }

        // Manejar filtros de categoría
        function handleCategoryFilter(event) {
            if (event.target.classList.contains('category-filter')) {
                // Remover clase active de todos los filtros
                document.querySelectorAll('.category-filter').forEach(btn => {
                    btn.classList.remove('active');
                });
                
                // Agregar clase active al filtro seleccionado
                event.target.classList.add('active');
                
                // Actualizar filtro actual
                filtroActual = event.target.dataset.category;
                
                // Renderizar productos filtrados
                renderProducts();
            }
        }

        // Agregar producto al carrito
        function addToCart(productId) {
            const producto = productos.find(p => p.id === productId);
            if (!producto) return;

            const itemExistente = carrito.find(item => item.id === productId);
            
            if (itemExistente) {
                itemExistente.cantidad++;
            } else {
                carrito.push({
                    id: producto.id,
                    nombre: producto.nombre,
                    precio: producto.precio,
                    cantidad: 1
                });
            }

            // Animación del botón
            const button = event.target.closest('.add-to-cart-btn');
            button.classList.add('added');
            button.innerHTML = `
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M20 6L9 17l-5-5"/>
                </svg>
                ¡Agregado!
            `;
            
            setTimeout(() => {
                button.classList.remove('added');
                button.innerHTML = `
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M12 5v14M5 12h14"/>
                    </svg>
                    Agregar al carrito
                `;
            }, 1500);

            updateCartUI();
        }

        // Actualizar interfaz del carrito
        function updateCartUI() {
            const totalItems = carrito.reduce((sum, item) => sum + item.cantidad, 0);
            const totalAmount = carrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);

            // Actualizar contador
            cartCount.textContent = totalItems;
            cartCount.classList.toggle('visible', totalItems > 0);

            // Actualizar total en header
            cartTotal.textContent = `${totalAmount}`;

            // Actualizar total en panel
            cartTotalAmount.textContent = `${totalAmount}`;

            // Renderizar items del carrito
            renderCartItems();
        }

        // Renderizar items del carrito
        function renderCartItems() {
            if (carrito.length === 0) {
                cartItems.innerHTML = `
                    <div class="empty-cart">
                        <svg class="empty-cart-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                            <path d="M9 22V12h6v10M9 12L4.91 4.91a2.78 2.78 0 0 1 .49-3.4 2.78 2.78 0 0 1 3.4.49L19.09 12"/>
                        </svg>
                        <h4>Tu carrito está vacío</h4>
                        <p>Agrega productos para comenzar tu pedido</p>
                    </div>
                `;
                return;
            }

            cartItems.innerHTML = carrito.map(item => `
                <div class="cart-item">
                    <div class="cart-item-image">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
                        </svg>
                    </div>
                    <div class="cart-item-info">
                        <div class="cart-item-name">${item.nombre}</div>
                        <div class="cart-item-price">${item.precio}</div>
                        <div class="cart-item-controls">
                            <button class="quantity-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                            <span class="quantity-value">${item.cantidad}</span>
                            <button class="quantity-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                            <button class="remove-item-btn" onclick="removeFromCart(${item.id})">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <polyline points="3,6 5,6 21,6"/>
                                    <path d="m19,6v14a2,2 0,0 1,-2,2H7a2,2 0,0 1,-2,-2V6m3,0V4a2,2 0,0 1,2,-2h4a2,2 0,0 1,2,2v2"/>
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            `).join('');
        }

        // Actualizar cantidad de un item
        function updateQuantity(itemId, change) {
            const item = carrito.find(item => item.id === itemId);
            if (!item) return;

            item.cantidad += change;
            
            if (item.cantidad <= 0) {
                removeFromCart(itemId);
            } else {
                updateCartUI();
            }
        }

        // Remover item del carrito
        function removeFromCart(itemId) {
            carrito = carrito.filter(item => item.id !== itemId);
            updateCartUI();
        }

        // Abrir/cerrar carrito
        function toggleCart() {
            cartPanel.classList.toggle('open');
            cartOverlay.classList.toggle('active');
            document.body.style.overflow = cartPanel.classList.contains('open') ? 'hidden' : '';
        }

        function closeCart() {
            cartPanel.classList.remove('open');
            cartOverlay.classList.remove('active');
            document.body.style.overflow = '';
        }

        // Proceder al checkout
        function proceedToCheckout() {
            if (carrito.length === 0) {
                alert('Tu carrito está vacío');
                return;
            }

            // Crear mensaje de WhatsApp
            const mensaje = crearMensajeWhatsApp();
            
            // Aquí podrías abrir WhatsApp o mostrar un modal con el resumen
            alert('Funcionalidad de checkout:\n\n' + mensaje);
            
            // Limpiar carrito después del pedido
            // carrito = [];
            // updateCartUI();
            // closeCart();
        }

        // Crear mensaje para WhatsApp
        function crearMensajeWhatsApp() {
            const total = carrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
            
            let mensaje = '🛒 *Nuevo Pedido - Mi Negocio Pro*\n\n';
            mensaje += '*Productos:*\n';
            
            carrito.forEach(item => {
                mensaje += `• ${item.cantidad}x ${item.nombre} - ${item.precio * item.cantidad}\n`;
            });
            
            mensaje += `\n*Total: ${total}*\n\n`;
            mensaje += 'Por favor confirme la disponibilidad y tiempo de entrega. ¡Gracias!';
            
            return mensaje;
        }

        // Inicializar cuando el DOM esté listo
        document.addEventListener('DOMContentLoaded', init);