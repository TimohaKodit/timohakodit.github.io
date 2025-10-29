// document.addEventListener('DOMContentLoaded', () => {
//     const API_BASE_URL = 'http://127.0.0.1:8888/api/v1';
    
//     // Элементы контейнеров
//     const homeView = document.getElementById('home-view');
//     const detailView = document.getElementById('detail-view');
//     const productSectionsContainer = document.getElementById('product-sections-container');
//     const productDetailContainer = document.getElementById('product-detail-container');
//     const backBtn = document.querySelector('.back-btn');

//     let allProducts = []; // Полный список всех товаров со всеми опциями
//     let currentItemVariants = []; // Варианты текущего просматриваемого товара
//     let selectedOptions = { memory: null, color: null };

//     // --- УТИЛИТЫ ---

//     function formatPrice(price) {
//         return new Intl.NumberFormat('ru-RU', {
//             style: 'currency',
//             currency: 'RUB',
//             minimumFractionDigits: 0
//         }).format(price);
//     }
    
//     // --- ПЕРЕКЛЮЧЕНИЕ ВИДОВ ---
    
//     function showHomePage() {
//         homeView.classList.remove('hidden');
//         detailView.classList.add('hidden');
//         backBtn.classList.add('hidden');
//     }

//     function showDetailPage() {
//         homeView.classList.add('hidden');
//         detailView.classList.remove('hidden');
//         backBtn.classList.remove('hidden');
//     }
    
//     // --- ГЛАВНАЯ СТРАНИЦА: ГЕНЕРАЦИЯ КАРТОЧЕК ---
    
//     function createProductCard(item) {
//     const card = document.createElement('div');
//     // Card сама по себе теперь кликабельная
//     card.className = 'product-card';

//     const formattedPrice = formatPrice(item.price);
//     const baseName = item.name;
    
//     // HTML карточки: БЕЗ ТЕГА <a>
//     card.innerHTML = `
//         <p class="product-name">${baseName}</p>
//         <div class="product-price-row">
//             <span class="product-price">от ${formattedPrice}</span>
//             <button class="add-to-cart-btn" data-base-name="${baseName}">+</button>
//         </div>
//     `;

//     // Единый обработчик кликов для всей карточки
//     card.addEventListener('click', (e) => {
//         const target = e.target;
        
//         if (target.classList.contains('add-to-cart-btn')) {
//             // 1. Клик по кнопке "+": Интенция "Добавить в корзину" (но сначала выбираем опции)
//             e.preventDefault();
//             e.stopPropagation(); // Останавливаем, чтобы не сработал клик по карточке
            
//             const name = target.dataset.baseName;
            
//             // Переход на детальную страницу для выбора опций
//             renderProductDetail(name);
//             showDetailPage();
            
//             console.log(`Кнопка "+" нажата: перенаправление на выбор опций для ${name}.`);
        
//         } else {
//             // 2. Клик по остальной части карточки: Интенция "Посмотреть детали"
//             e.preventDefault();
//             const name = card.querySelector('.product-name').textContent;
            
//             // Переход на детальную страницу
//             renderProductDetail(name);
//             showDetailPage();
            
//             console.log(`Клик по товару: перенаправление на страницу ${name}.`);
//         }
//     });
    
//     return card;
// }

//     // --- СТРАНИЦА ТОВАРА: ЛОГИКА ОПЦИЙ И ЦЕНЫ ---
    
//     function updatePriceAndButton() {
//         // Находим точный товар, который соответствует текущему выбору
//         const selectedItem = currentItemVariants.find(item => 
//             (selectedOptions.memory === null || item.memory === selectedOptions.memory) &&
//             (selectedOptions.color === null || item.color === selectedOptions.color)
//         );

//         const priceSpan = document.getElementById('detail-current-price');
//         const finalAddBtn = document.getElementById('detail-add-to-cart-btn');
        
//         // Проверяем, нужны ли вообще опции (если нет, считаем их выбранными)
//         const memoryRequired = document.querySelectorAll('#detail-memory-options .option-btn').length > 0;
//         const colorRequired = document.querySelectorAll('#detail-color-options .option-btn').length > 0;
        
//         let allSelected = true;
//         if (memoryRequired && selectedOptions.memory === null) allSelected = false;
//         if (colorRequired && selectedOptions.color === null) allSelected = false;

//         if (selectedItem) {
//             priceSpan.textContent = formatPrice(selectedItem.price);
//             finalAddBtn.dataset.finalItemId = selectedItem.id;
//         } else {
//             priceSpan.textContent = 'Н/Д';
//             finalAddBtn.dataset.finalItemId = '';
//             allSelected = false;
//         }

//         finalAddBtn.disabled = !allSelected;
//     }

//     // --- СТРАНИЦА ТОВАРА: СОЗДАНИЕ КНОПОК ОПЦИЙ ---
    
//     function createOptionButtons(property, containerId) {
//         const container = document.getElementById(containerId);
//         container.innerHTML = '';
        
//         const uniqueOptions = [...new Set(currentItemVariants.map(item => item[property]))]
//                                 .filter(opt => opt && opt !== '-');

//         if (uniqueOptions.length === 0) {
//             // Если опций нет, скрываем весь блок
//             const optionGroup = container.closest('.option-group');
//             if (optionGroup) optionGroup.classList.add('hidden');
//             return;
//         }
        
//         const optionGroup = container.closest('.option-group');
//         if (optionGroup) optionGroup.classList.remove('hidden');

//         uniqueOptions.forEach(option => {
//             const button = document.createElement('span');
//             button.className = `option-btn ${property}-option-btn`;
//             button.textContent = option;
            
//             button.addEventListener('click', () => {
//                 selectedOptions[property] = option;
                
//                 container.querySelectorAll('.option-btn').forEach(btn => btn.classList.remove('selected'));
//                 button.classList.add('selected');
                
//                 updatePriceAndButton();
//             });
//             container.appendChild(button);
//         });
//     }
    
//     // --- СТРАНИЦА ТОВАРА: ПОСТРОЕНИЕ РАЗМЕТКИ ---
    
//     function renderProductDetail(baseName) {
//         // 1. Фильтруем варианты для текущего товара
//         currentItemVariants = allProducts.filter(item => item.name === baseName);
//         selectedOptions = { memory: null, color: null }; // Сбрасываем выбор

//         if (currentItemVariants.length === 0) {
//              productDetailContainer.innerHTML = `<p class="error-message">Товар "${baseName}" не найден.</p>`;
//              return;
//         }
        
//         const basePrice = currentItemVariants.reduce((min, item) => Math.min(min, item.price), Infinity);

//         // 2. Генерируем HTML-разметку
//         productDetailContainer.innerHTML = `
//             <div class="product-details-header">
//                 <img src="placeholder.png" alt="${baseName}" class="product-image">
//                 <h1 class="detail-title">${baseName}</h1>
//                 <p class="detail-description">Выберите желаемые характеристики для вашего устройства.</p>
//             </div>

//             <div class="options-selection">
//                 <div class="option-group memory-group">
//                     <h4>Память:</h4>
//                     <div id="detail-memory-options" class="options-container"></div>
//                 </div>
//                 <div class="option-group color-group">
//                     <h4>Цвет:</h4>
//                     <div id="detail-color-options" class="options-container"></div>
//                 </div>
//             </div>

//             <div class="detail-footer">
//                 <div class="detail-price-box">
//                     <span>Цена:</span>
//                     <span id="detail-current-price" class="detail-price">${formatPrice(basePrice)}</span>
//                 </div>
//                 <button id="detail-add-to-cart-btn" disabled>Добавить в корзину</button>
//             </div>
//         `;
        
//         // 3. Создаем кнопки опций и добавляем слушатели
//         createOptionButtons('memory', 'detail-memory-options');
//         createOptionButtons('color', 'detail-color-options');
        
//         // 4. Слушатель для кнопки добавления в корзину
//         document.getElementById('detail-add-to-cart-btn').addEventListener('click', async (e) => {
//             const finalId = e.target.dataset.finalItemId;
//             if (!finalId) return;

//             console.log(`Товар ID ${finalId} добавлен в корзину с опциями:`, selectedOptions);
//             alert(`"${baseName}" (ID: ${finalId}) добавлен в корзину!`);
            
//             // TODO: Выполнить POST-запрос на API для добавления в корзину
//         });

//         updatePriceAndButton();
//     }
    
//     // --- ГЛАВНАЯ СТРАНИЦА: ЗАГРУЗКА И РЕНДЕРИНГ ---

//     async function loadAndRenderProducts() {
//         productSectionsContainer.innerHTML = '<p id="loading-message">Загрузка товаров...</p>';
        
//         try {
//             const [itemsResponse, categoriesResponse] = await Promise.all([
//                 fetch(`${API_BASE_URL}/items/`),
//                 fetch(`${API_BASE_URL}/categories/`)
//             ]);
            
//             if (!itemsResponse.ok || !categoriesResponse.ok) {
//                  throw new Error('Ошибка при получении данных с API');
//             }

//             allProducts = await itemsResponse.json(); // Сохраняем все данные
//             const categories = await categoriesResponse.json();

//             // 2. Создаем карту для удобного доступа к категориям (ID -> Объект)
//             const categoryMap = categories.reduce((map, category) => {
//                 map[category.id] = category;
//                 map[category.id].base_items = {}; 
//                 return map;
//             }, {});

//             // 3. Группируем товары по базовому имени
//             allProducts.forEach(item => {
//                 if (item.category_id && categoryMap[item.category_id]) {
//                     const category = categoryMap[item.category_id];
//                     // Сохраняем первый найденный вариант как "базовый" для отображения на главной
//                     if (!category.base_items[item.name]) {
//                         category.base_items[item.name] = item; 
//                     }
//                 }
//             });

//             productSectionsContainer.innerHTML = '';
            
//             // 4. Генерируем HTML для каждой категории на главной странице
//             Object.values(categoryMap).forEach(category => {
//                 const baseItemsArray = Object.values(category.base_items);
                
//                 if (baseItemsArray.length === 0) return; 

//                 const section = document.createElement('section');
//                 section.className = 'product-section';

//                 const headerHtml = `<h2 class="section-title">${category.name}</h2>
//                                     <a href="#" class="view-all-link">Все ></a>`;
//                 section.insertAdjacentHTML('afterbegin', headerHtml);

//                 const grid = document.createElement('div');
//                 grid.className = 'product-grid';

//                 baseItemsArray.forEach(item => {
//                     grid.appendChild(createProductCard(item));
//                 });

//                 section.appendChild(grid);
//                 productSectionsContainer.appendChild(section);
//             });

//             if (allProducts.length === 0) {
//                  productSectionsContainer.innerHTML = '<p id="loading-message">Товары пока не добавлены.</p>';
//             }
            
//             // Настраиваем слушатели для основных кнопок
//             setupGlobalListeners();

//         } catch (error) {
//             console.error('Ошибка загрузки данных с API:', error);
//             productSectionsContainer.innerHTML = '<p class="error-message">Не удалось загрузить товары. Проверьте соединение с API.</p>';
//         }
//     }
    
//     // --- ГЛОБАЛЬНЫЕ СЛУШАТЕЛИ ---

//     function setupGlobalListeners() {
//         // Кнопка "Назад"
//         backBtn.addEventListener('click', showHomePage);
        
//         // Кнопка "Каталог"
//         document.querySelector('.catalog-btn').addEventListener('click', () => {
//             console.log('Кнопка "Каталог" нажата.');
//         });
        
//         // Кнопка "Корзина"
//         document.querySelector('.cart-btn').addEventListener('click', () => {
//             console.log('Кнопка "Корзина" нажата. Открываем корзину...');
//         });
//     }

//     // --- ЗАПУСК ---
//     loadAndRenderProducts();
//     showHomePage(); // По умолчанию показываем главную страницу
// });
// js/scripts.js

// --- ФАЙЛ script.js ---

document.addEventListener('DOMContentLoaded', () => {
    // ВАЖНО: Укажите правильный URL вашего FastAPI бэкенда
    const API_BASE_URL = 'http://127.0.0.1:8888/api/v1'; // ❗ Проверьте порт!

    // --------------------------------------------------------------------------------
    // --- ПРОВЕРЕННЫЕ ЭЛЕМЕНТЫ DOM (Используйте ID для надежности) ---
    // --------------------------------------------------------------------------------

    const homeView = document.getElementById('home-view');
    const detailView = document.getElementById('detail-view');
    const cartView = document.getElementById('cart-view');
    const checkoutFormView = document.getElementById('checkout-form-view');
    const productSectionsContainer = document.getElementById('product-sections-container');
    const productDetailContainer = document.getElementById('product-detail-container');
    const backBtn = document.getElementById('back-btn');
    const categoryDropdown = document.getElementById('category-dropdown');
    const categoriesListEl = document.getElementById('categories-list-dropdown');
    const dropdownLoadingMessage = document.getElementById('dropdown-loading-message');
    const cartCounterEl = document.getElementById('cart-counter');
    const cartItemsContainer = document.getElementById('cart-items-container');
    const cartTotalPriceEl = document.getElementById('cart-total-price');
    const checkoutBtn = document.getElementById('checkout-btn');
    const checkoutForm = document.getElementById('checkout-form');
    const checkoutItemsSummary = document.getElementById('checkout-items-summary');
    const checkoutTotalPriceEl = document.getElementById('checkout-total-price'); 
    const submitOrderBtn = document.getElementById('submit-order-btn');
    const searchInput = document.getElementById('search-input');
    const catalogButton = document.getElementById('catalog-btn');
    const cartButton = document.getElementById('cart-btn');

    // Контейнер для системных сообщений (временное сообщение об успехе)
    const notificationContainer = document.getElementById('notification-container');


    // Глобальные хранилища данных
    let cartItemCount = 0;
    let cartItems = []; 
    let allProducts = []; 
    let allCategories = []; 
    let currentItemVariants = []; 
    let selectedOptions = { memory: null, color: null };
    let currentCategoryFilter = null; 
    let isSearching = false; // 🌟 Флаг для отслеживания режима поиска

    // Заглушка изображения
    const PLACEHOLDER_IMAGE = "https://placehold.co/300x300/007AFF/ffffff?text=Product+Image";

    if (!homeView || !detailView || !cartView || !checkoutFormView) {
        console.error("КРИТИЧЕСКАЯ ОШИБКА: Не найдены основные DOM-контейнеры. Проверьте HTML.");
        return;
    }


    // --------------------------------------------------------------------------------
    // --- УТИЛИТЫ ---
    // --------------------------------------------------------------------------------

    function formatPrice(price) { 
        const numericPrice = Number(price); 
        // 💡 Улучшенная проверка на числовое значение, включая null/undefined
        if (price === null || price === undefined || isNaN(numericPrice)) { 
            console.warn("formatPrice: получено нечисловое значение:", price); 
            return 'Цена не указана'; 
        } 
        return new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB', minimumFractionDigits: 0 }).format(numericPrice); 
    }
    
    /**
     * Показывает временное уведомление (замена alert())
     * @param {string} message 
     * @param {string} type 'success' или 'error'
     */
    function showNotification(message, type = 'success') {
        if (!notificationContainer) return;
        
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        notificationContainer.appendChild(notification);

        // Автоматическое удаление через 3 секунды
        setTimeout(() => {
            notification.classList.add('fade-out');
            notification.addEventListener('transitionend', () => notification.remove());
        }, 3000);
    }

    function renderCheckoutSummary() { 
        if (!checkoutItemsSummary || !checkoutTotalPriceEl) return; 
        let total = 0; 
        checkoutItemsSummary.innerHTML = ''; 
        
        if (cartItems.length === 0) { 
            checkoutTotalPriceEl.textContent = formatPrice(0); 
            checkoutItemsSummary.innerHTML = '<p style="color:#ff3b30; font-style: italic;">Корзина пуста. Добавьте товары, чтобы оформить заказ.</p>'; 
            return; 
        } 
        
        cartItems.forEach(item => { 
            const itemLine = document.createElement('div'); 
            itemLine.className = 'checkout-item-line'; 
            let optionsText = []; 
            if (item.memory && item.memory !== '-') optionsText.push(item.memory); 
            if (item.color && item.color !== '-') optionsText.push(item.color); 
            const optionsHtml = optionsText.length > 0 ? ` (${optionsText.join(', ')})` : ''; 
            
            itemLine.innerHTML = `<span>${item.name}${optionsHtml}</span><span class="item-price">${formatPrice(item.price)}</span>`; 
            checkoutItemsSummary.appendChild(itemLine); 
            total += item.price || 0; 
        }); 
        
        checkoutTotalPriceEl.textContent = formatPrice(total); 
    }

    // --------------------------------------------------------------------------------
    // --- ПЕРЕКЛЮЧЕНИЕ ВИДОВ (SPA) ---
    // --------------------------------------------------------------------------------

    function hideAllViews() { 
        homeView.classList.add('hidden'); 
        detailView.classList.add('hidden'); 
        cartView.classList.add('hidden'); 
        checkoutFormView.classList.add('hidden'); 
        if (backBtn) backBtn.classList.add('hidden'); 
        if (categoryDropdown && categoryDropdown.classList.contains('visible')) {
            toggleCategoryDropdown();
        }
    }
    
    function showHomePage() { 
        hideAllViews(); 
        homeView.classList.remove('hidden'); 
        
        // Если мы не в режиме поиска, применяем фильтр категории
        if (!isSearching) {
            renderProducts(allProducts, currentCategoryFilter);
        } else {
             // Если поиск активен, перерисовываем результаты поиска
             handleSearch();
        }
    }
    
    function showDetailPage() { 
        hideAllViews(); 
        detailView.classList.remove('hidden'); 
        if (backBtn) backBtn.classList.remove('hidden'); 
    }
    
    function showCartPage() { 
        hideAllViews(); 
        renderCart(); 
        cartView.classList.remove('hidden'); 
        if (backBtn) backBtn.classList.remove('hidden'); 
    }
    
    function showCheckoutFormPage() { 
        if (cartItems.length === 0) { 
            showNotification('Корзина пуста!', 'error'); 
            showCartPage(); 
            return; 
        } 
        hideAllViews(); 
        renderCheckoutSummary(); 
        
        const deliveryRadio = document.getElementById('delivery'); 
        const addressGroup = document.getElementById('address-group'); 
        const addressField = document.getElementById('address'); 
        
        // Устанавливаем "Доставка" по умолчанию и показываем поле адреса
        if (deliveryRadio) deliveryRadio.checked = true; 
        if (addressGroup) addressGroup.classList.remove('hidden'); 
        if (addressField) addressField.required = true; 
        
        checkoutFormView.classList.remove('hidden'); 
        if (backBtn) backBtn.classList.remove('hidden'); 
    }

    // --------------------------------------------------------------------------------
    // --- КАТАЛОГ: ЛОГИКА ДРОПДАУНА И ФИЛЬТРАЦИИ ---
    // --------------------------------------------------------------------------------

    function toggleCategoryDropdown() {
        if (!categoryDropdown) return;
        
        // Предполагается, что 'visible' класс управляет видимостью дропдауна
        categoryDropdown.classList.toggle('visible'); 
        
        if (categoryDropdown.classList.contains('visible')) {
            renderCategoriesDropdown();
        }
    }

    function renderCategoriesDropdown() { 
        if (!categoriesListEl) return; 

        if (dropdownLoadingMessage) dropdownLoadingMessage.classList.add('hidden'); 
        categoriesListEl.innerHTML = ''; 

        if (allCategories.length === 0) { 
            categoriesListEl.innerHTML = '<p class="error-message">Категории не загружены.</p>'; 
            return; 
        } 
        
        // 1. Добавляем "Все товары"
        const allItemsLi = document.createElement('li');
        allItemsLi.className = 'category-item';
        allItemsLi.innerHTML = `<span>Все товары</span>`;
        allItemsLi.addEventListener('click', () => {
            currentCategoryFilter = null;
            isSearching = false; // Сбрасываем поиск
            searchInput.value = ''; // Очищаем строку поиска
            renderProducts(allProducts, null);
            toggleCategoryDropdown();
        });
        categoriesListEl.appendChild(allItemsLi);


        // 2. Добавляем остальные категории
        allCategories.forEach(category => { 
            const listItem = document.createElement('li'); 
            listItem.className = 'category-item'; 
            listItem.dataset.categoryId = category.id; 
        
            listItem.addEventListener('click', () => { 
                currentCategoryFilter = category.id;
                isSearching = false; // Сбрасываем поиск
                searchInput.value = ''; // Очищаем строку поиска
                renderProducts(allProducts, category.id); 
                toggleCategoryDropdown(); 
            }); 
        
            listItem.innerHTML = `<span>${category.name}</span>`; 
            categoriesListEl.appendChild(listItem); 
        }); 
    }

    // --------------------------------------------------------------------------------
    // --- КОРЗИНА ---
    // --------------------------------------------------------------------------------

    function addToCart(item) { 
        if (!item || typeof item !== 'object' || !item.id || !item.name || typeof item.price === 'undefined') { 
            console.error("Ошибка добавления в корзину: неверный объект товара", item); 
            showNotification("Не удалось добавить товар в корзину.", 'error'); 
            return; 
        } 
        // Добавляем item_id для бэкенда. Ваш вариант товара уже является уникальной сущностью.
        cartItems.push({ 
            item_variant_id: item.id, // ID варианта для отправки на бэкенд
            name: item.name, 
            price: item.price, 
            memory: item.memory || null, 
            color: item.color || null 
        }); 
        cartItemCount = cartItems.length; 
        updateCartCounter(); 
        
        const options = [item.memory, item.color].filter(Boolean).join(', ');
        showNotification(`"${item.name}" ${options ? `(${options})` : ''} добавлен в корзину!`);
    }
    
    function removeItemFromCart(index) { 
        if (index >= 0 && index < cartItems.length) { 
            const removedItem = cartItems[index];
            cartItems.splice(index, 1); 
            cartItemCount = cartItems.length; 
            updateCartCounter(); 
            renderCart(); 
            showNotification(`"${removedItem.name}" удалён из корзины.`);
        } else { 
            console.error("Ошибка удаления: неверный индекс", index); 
        } 
    }
    
    function updateCartCounter() { 
        if (!cartCounterEl) return; 
        cartCounterEl.textContent = cartItemCount; 
        cartCounterEl.classList.toggle('hidden', cartItemCount === 0); 
    }
    
    function renderCart() { 
        let total = 0; 
        if (!cartItemsContainer || !cartTotalPriceEl || !checkoutBtn) return; 
        
        cartItemsContainer.innerHTML = ''; 
        
        if (cartItems.length === 0) { 
            cartItemsContainer.innerHTML = '<p class="empty-cart-message">Корзина пуста.</p>'; 
            checkoutBtn.disabled = true; 
            cartTotalPriceEl.textContent = formatPrice(0); 
            return; 
        } 
        
        cartItems.forEach((item, index) => { 
            const itemElement = document.createElement('div'); 
            itemElement.className = 'cart-item'; 
            const price = item.price || 0; 
            total += price; 
            
            let optionsText = []; 
            if (item.memory && item.memory !== '-') optionsText.push(item.memory); 
            if (item.color && item.color !== '-') optionsText.push(item.color); 
            const optionsHtml = optionsText.join(', '); 
            
            itemElement.innerHTML = `
                <div class="cart-item-info">
                    <div>
                        <div class="cart-item-name">${item.name}</div>
                        <div class="cart-item-options">${optionsHtml}</div>
                    </div>
                </div>
                <div class="cart-item-controls">
                    <span class="cart-item-price">${formatPrice(price)}</span>
                    <button class="remove-item-btn" data-index="${index}"><i class="fa-solid fa-xmark"></i></button>
                </div>`; 
            
            cartItemsContainer.appendChild(itemElement); 
        }); 
        
        cartTotalPriceEl.textContent = formatPrice(total); 
        checkoutBtn.disabled = false; 
        
        cartItemsContainer.querySelectorAll('.remove-item-btn').forEach(button => { 
            button.addEventListener('click', (e) => { 
                const indexToRemove = parseInt(e.currentTarget.dataset.index); 
                removeItemFromCart(indexToRemove); 
            }); 
        }); 
    }

    // --------------------------------------------------------------------------------
    // --- ГЛАВНАЯ СТРАНИЦА: ГЕНЕРАЦИЯ КАРТОЧЕК ---
    // --------------------------------------------------------------------------------

    function createProductCard(item, showCategory = false) { 
        const card = document.createElement('div'); 
        card.className = 'product-card'; 
        const displayPrice = item.price; 
        const formattedPrice = formatPrice(displayPrice); 
        const baseName = item.name; 
    
        const categoryName = allCategories.find(c => c.id === item.category_id)?.name || 'Продукт';

    // 🌟 ИСПРАВЛЕНО: используем image_urls (массив)
        const imageUrl = (item.image_urls && item.image_urls.length > 0) 
            ? item.image_urls[0] 
            : PLACEHOLDER_IMAGE;

        card.innerHTML = `
            <img src="${imageUrl}" alt="${baseName}" class="product-image-card">
            ${showCategory ? `<p class="product-category">${categoryName}</p>` : ''}
            <p class="product-name">${baseName}</p>
            <div class="product-price-row">
                <span class="product-price">от ${formattedPrice}</span>
                <button class="add-to-cart-btn" data-base-name="${baseName}"><i class="fa-solid fa-arrow-right"></i></button>
            </div>`; 
        
        // 🔄 ОБНОВЛЕННАЯ ЛОГИКА: Слушатель для перехода на страницу деталей
        card.addEventListener('click', (e) => { 
            const baseName = item.name;
            
            // Если клик был по кнопке или ее содержимому, игнорируем переход на детали
            if (e.target.closest('.add-to-cart-btn')) { 
                e.preventDefault(); 
                e.stopPropagation(); 
                
            }
            
            // Если клик был по карточке, переходим на детали
            renderProductDetail(baseName); 
            showDetailPage(); 
        }); 
    
        return card; 
    }
    
    /**
     * Рендерит плоский список карточек. Используется для результатов поиска.
     * @param {Array} products - Массив вариантов товаров.
     * @param {string} query - Поисковый запрос.
     */
    function renderSearchResults(products, query) {
        if (!productSectionsContainer) return;
        productSectionsContainer.innerHTML = '';
        currentCategoryFilter = null;
        isSearching = true;

        // Группируем по базовому имени, чтобы не дублировать карточки
        const baseItems = products.reduce((acc, item) => {
            if (!acc[item.name] || item.price < acc[item.name].price) {
                acc[item.name] = item;
            }
            return acc;
        }, {});

        const baseItemsArray = Object.values(baseItems);

        if (baseItemsArray.length === 0) {
            productSectionsContainer.innerHTML = `<p class="loading-message">По запросу "<b>${query}</b>" ничего не найдено.</p>`;
            return;
        }

        const section = document.createElement('section');
        section.className = 'product-section search-results-section';

        const headerHtml = `<h2 class="section-title">Результаты поиска для: "${query}" (${baseItemsArray.length})</h2>`;
        section.insertAdjacentHTML('afterbegin', headerHtml);

        const grid = document.createElement('div');
        grid.className = 'product-grid';

        baseItemsArray.forEach(item => {
            // Передаем true, чтобы на карточках поиска была видна категория
            grid.appendChild(createProductCard(item, true)); 
        });

        section.appendChild(grid);
        productSectionsContainer.appendChild(section);

        setupProductListeners();
    }


    // --------------------------------------------------------------------------------
    // --- ЛОГИКА ПОИСКА (НОВАЯ ФУНКЦИЯ) ---
    // --------------------------------------------------------------------------------

    function handleSearch() {
        const query = searchInput.value.toLowerCase().trim();
        
        if (query.length > 0) {
            // Фильтруем все варианты, ищем совпадения в названии
            const filteredProducts = allProducts.filter(p => 
                p.name.toLowerCase().includes(query)
            );
            
            renderSearchResults(filteredProducts, query);
            isSearching = true;
        } else {
            // Если поле пустое, возвращаемся к обычному рендерингу
            isSearching = false;
            // Применяем текущий фильтр категории, если он есть
            renderProducts(allProducts, currentCategoryFilter); 
        }
    }


    // --------------------------------------------------------------------------------
    // --- СТРАНИЦА ТОВАРА: ЛОГИКА ОПЦИЙ И ЦЕНЫ ---
    // --------------------------------------------------------------------------------
    
    /**
     * 🌟 НОВАЯ ФУНКЦИЯ: Обновляет визуальное состояние кнопок опций
     * (disabled/enabled) в зависимости от выбора в другой группе.
     * @param {string} changingProperty - Свойство, которое только что было выбрано (например, 'color').
     * @param {string} otherProperty - Свойство, которое нужно обновить (например, 'memory').
     * @param {string} containerId - ID контейнера, который нужно обновить.
     */
    function updateVisualOptionStates(changingProperty, otherProperty, containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        const selectedValue = selectedOptions[changingProperty];
        const buttons = container.querySelectorAll('.option-btn');

        buttons.forEach(button => {
            const optionValue = button.textContent;
            
            // Если в другой группе ничего не выбрано, все кнопки активны.
            if (selectedValue === null) {
                button.classList.remove('disabled');
                return;
            }

            // Проверяем, существует ли вариант, где:
            // 1. changingProperty === selectedValue (например, цвет = 'White')
            // 2. otherProperty === optionValue (например, память = '128GB')
            const isCombinationAvailable = currentItemVariants.some(item => 
                item[changingProperty] === selectedValue && item[otherProperty] === optionValue
            );

            if (isCombinationAvailable) {
                button.classList.remove('disabled');
            } else {
                button.classList.add('disabled');
                // Важно: если опция стала недоступной, но она была выбрана, нужно сбросить выбор
                if (button.classList.contains('selected')) {
                     button.classList.remove('selected');
                     selectedOptions[otherProperty] = null;
                }
            }
        });
    }


    // 🔄 ОБНОВЛЕННАЯ ЛОГИКА: теперь вызывает updateVisualOptionStates
    function updatePriceAndButton() { 
        // 1. Поиск выбранного варианта
        const selectedItem = currentItemVariants.find(item => 
            (selectedOptions.memory === null || !item.memory || item.memory === '-' || item.memory === selectedOptions.memory) && 
            (selectedOptions.color === null || !item.color || item.color === '-' || item.color === selectedOptions.color)
        ); 
        
        const priceSpan = document.getElementById('detail-current-price'); 
        const finalAddBtn = document.getElementById('detail-add-to-cart-btn'); 
        if (!priceSpan || !finalAddBtn) return; 
        
        // 2. Проверка, нужны ли опции (для определения, полностью ли собран товар)
        const memoryRequired = currentItemVariants.some(v => v.memory && v.memory !== '-'); 
        const colorRequired = currentItemVariants.some(v => v.color && v.color !== '-'); 
        
        // 3. Обновление цены и кнопки
        let allSelected = true; 
        
        if (selectedItem) { 
            priceSpan.textContent = formatPrice(selectedItem.price); 
            finalAddBtn.dataset.finalItemId = selectedItem.id; 
        } else { 
            // Если комбинация не найдена:
            
            // Проверяем, нужно ли выбирать опции. Если да, то allSelected = false
            if (memoryRequired && selectedOptions.memory === null) allSelected = false; 
            if (colorRequired && selectedOptions.color === null) allSelected = false; 
            
            // Если выбран не полный, но валидный набор (например, только цвет, но память не обязательна)
            // ИЛИ если выбрана невалидная комбинация (например, 'White' + '512GB', хотя есть только 'White' + '128GB')
            
            // Показываем минимальную цену от всей группы
            const basePrice = currentItemVariants.reduce((min, item) => Math.min(min, item.price), Infinity); 
            priceSpan.textContent = formatPrice(basePrice); 
            finalAddBtn.dataset.finalItemId = ''; 
            allSelected = false; // Блокируем кнопку, пока не будет найден точный вариант
        } 
        
        // Блокируем кнопку, если товар не выбран (selectedItem === null) или не выбраны обязательные опции
        finalAddBtn.disabled = !allSelected || selectedItem === undefined; 
        
        // 4. Обновление визуального состояния других опций (ключевое изменение!)
        updateVisualOptionStates('memory', 'color', 'detail-color-options');
        updateVisualOptionStates('color', 'memory', 'detail-memory-options');
    }

    // 🔄 ОБНОВЛЕННАЯ ЛОГИКА: Изменен слушатель клика для вызова updatePriceAndButton
    function createOptionButtons(property, containerId) { 
        const container = document.getElementById(containerId); 
        if (!container) return; 
        
        container.innerHTML = ''; 
        // Извлекаем уникальные опции, исключая пустые значения или заглушки '-'
        const uniqueOptions = [...new Set(currentItemVariants.map(item => item[property]))].filter(opt => opt && opt !== '-'); 
        const optionGroup = container.closest('.option-group'); 
        
        if (uniqueOptions.length === 0) { 
            if (optionGroup) optionGroup.classList.add('hidden'); 
            selectedOptions[property] = null; 
            return; 
        } 
        
        if (optionGroup) optionGroup.classList.remove('hidden'); 
        
        uniqueOptions.forEach(option => { 
            const button = document.createElement('span'); 
            button.className = `option-btn ${property}-option-btn`; 
            button.textContent = option; 
            button.dataset.optionValue = option; // Добавляем data-атрибут для надежности
            
            button.addEventListener('click', () => { 
                if (button.classList.contains('disabled')) {
                    // Игнорируем клик, если кнопка неактивна
                    showNotification(`Данный вариант не доступен в выбранной комбинации.`, 'error');
                    return; 
                }

                if (button.classList.contains('selected')) { 
                    selectedOptions[property] = null; 
                    button.classList.remove('selected'); 
                } else { 
                    selectedOptions[property] = option; 
                    container.querySelectorAll('.option-btn').forEach(btn => btn.classList.remove('selected')); 
                    button.classList.add('selected'); 
                } 
                // Вызываем обновление цены И доступности других опций
                updatePriceAndButton(); 
            }); 
            container.appendChild(button); 
        }); 
        
        // Если опция только одна, автоматически выбираем ее
        if (uniqueOptions.length === 1) { 
            const firstButton = container.querySelector('.option-btn'); 
            if (firstButton) firstButton.click(); 
        } 
    }

    function renderProductDetail(baseName) { 
        currentItemVariants = allProducts.filter(item => item.name === baseName); 
        selectedOptions = { memory: null, color: null }; 
        
        if (currentItemVariants.length === 0) { 
            if (productDetailContainer) productDetailContainer.innerHTML = `<p class="error-message">Товар "${baseName}" не найден.</p>`; 
            return; 
        } 
        
        const basePrice = currentItemVariants.reduce((min, item) => Math.min(min, item.price), Infinity); 
        const displayItem = currentItemVariants[0]; 
        // 🌟 Использование image_urls для отображения фото на странице детали
        const imageUrl = (displayItem.image_urls && displayItem.image_urls.length > 0) 
            ? displayItem.image_urls[0] 
            : PLACEHOLDER_IMAGE; 
        
        if (productDetailContainer) { 
            productDetailContainer.innerHTML = `
                <div class="product-details-header">
                    <img src="${imageUrl}" alt="${baseName}" class="product-image">
                    <h1 class="detail-title">${baseName}</h1>
                    
                </div>
                <div class="options-selection">
                    <div class="option-group memory-group hidden">
                        <h4>Память:</h4>
                        <div id="detail-memory-options" class="options-container"></div>
                    </div>
                    <div class="option-group color-group hidden">
                        <h4>Цвет:</h4>
                        <div id="detail-color-options" class="options-container"></div>
                    </div>
                </div>
                <div class="detail-footer">
                    <div class="detail-price-box">
                        <span>Цена:</span>
                        <span id="detail-current-price" class="detail-price">${formatPrice(basePrice)}</span>
                    </div>
                    <button id="detail-add-to-cart-btn" disabled>Добавить в корзину</button>
                </div>`; 
        } else { 
            console.error("Контейнер productDetailContainer не найден!"); 
            return; 
        } 
        
        createOptionButtons('memory', 'detail-memory-options'); 
        createOptionButtons('color', 'detail-color-options'); 
        
        const finalAddBtn = document.getElementById('detail-add-to-cart-btn'); 
        if (finalAddBtn) { 
            finalAddBtn.addEventListener('click', (e) => { 
                const finalId = e.target.dataset.finalItemId; 
                if (!finalId) { 
                    showNotification("Пожалуйста, выберите все опции.", 'error'); 
                    return; 
                } 
                const finalItem = allProducts.find(item => item.id === parseInt(finalId)); 
                if (finalItem) { 
                    addToCart(finalItem); 
                    // 💡 ПЕРЕКЛЮЧАЕМСЯ НА ГЛАВНУЮ СТРАНИЦУ после добавления в корзину
                    showHomePage(); 
                } else { 
                    showNotification("Не удалось найти выбранный вариант товара.", 'error'); 
                } 
            }); 
        } 
        updatePriceAndButton(); 
    }

    // --------------------------------------------------------------------------------
    // --- ГЛАВНАЯ СТРАНИЦА: ЗАГРУЗКА И РЕНДЕРИНГ ---
    // --------------------------------------------------------------------------------

   

    function renderProducts(products, categoryId) {
        if (!productSectionsContainer) return;
        productSectionsContainer.innerHTML = '';
    
    // 1. Создаем карту категорий, группируя товары по базовому имени (самый дешевый вариант)
        const categoryMap = allCategories.reduce((map, category) => {
            map[category.id] = { ...category, base_items: {} };
            return map;
        }, {});

        products.forEach(item => {
            if (item.category_id && categoryMap[item.category_id]) {
                const category = categoryMap[item.category_id];
                const baseName = item.name;

            // Группируем по базовому имени и берем самый дешевый вариант для карточки
                if (!category.base_items[baseName] || item.price < category.base_items[baseName].price) {
                    category.base_items[baseName] = item;
                }
            }
        });
    
        let hasContent = false;
    // Определяем, находимся ли мы в режиме фильтрации по конкретной категории
        const isFilteredView = categoryId !== null;

    // 2. Рендеринг секций товаров
        Object.values(categoryMap).forEach(category => {
            const baseItemsArray = Object.values(category.base_items);
        
        // Пропускаем категории, не соответствующие фильтру, если он активен
            if (isFilteredView && category.id !== categoryId) {
                return;
            }

            if (baseItemsArray.length === 0) return;
            hasContent = true;

            const section = document.createElement('section');
            section.className = 'product-section';

        // Определяем, какие товары показывать: 
        // - Если активен фильтр (isFilteredView), показываем ВСЕ товары в категории.
        // - Если фильтра нет (главная страница), показываем только первые 3.
            const productsToShow = isFilteredView ? baseItemsArray : baseItemsArray.slice(0, 3);
        
        // Кнопка "Все >" нужна, только если:
        // 1. Товаров в категории > 3 (baseItemsArray.length > productsToShow.length)
        // 2. Мы НЕ находимся в режиме фильтрации (не показаны все товары)
            const shouldShowViewAll = baseItemsArray.length > 3 && !isFilteredView;
        
        // Формирование заголовка секции
            const headerHtml = `
                <div class="section-header">
                    <h2 class="section-title">${category.name}</h2>
                    ${shouldShowViewAll ? 
                        `<a href="#" class="view-all-link" data-category-id="${category.id}">Все ></a>` : 
                        ''
                    }
                </div>`;
        
            section.insertAdjacentHTML('afterbegin', headerHtml);

            const grid = document.createElement('div');
            grid.className = 'product-grid';

            productsToShow.forEach(item => {
            // В режиме фильтрации по категории или при поиске можем показывать категорию на карточке
                 
                grid.appendChild(createProductCard(item));
            });

            section.appendChild(grid);
            productSectionsContainer.appendChild(section);
        });

    // 3. Сообщения об отсутствии контента
        if (!hasContent) {
            const message = isFilteredView 
                ? 'В этой категории пока нет товаров.' 
                : 'Товары пока не добавлены.';
            productSectionsContainer.innerHTML = `<p id="loading-message" class="text-xl p-10">${message}</p>`;
        }

        setupProductListeners();
    }


    async function loadAndRenderProducts() {
        if (!productSectionsContainer) {
             console.error("Контейнер productSectionsContainer не найден!");
             return;
        }
        productSectionsContainer.innerHTML = '<p id="loading-message">Загрузка товаров...</p>';

        try {
            const [itemsResponse, categoriesResponse] = await Promise.all([
                fetch(`${API_BASE_URL}/items/`),
                fetch(`${API_BASE_URL}/categories/`)
            ]);

            if (!itemsResponse.ok) throw new Error(`Ошибка загрузки товаров: ${itemsResponse.status}`);
            if (!categoriesResponse.ok) throw new Error(`Ошибка загрузки категорий: ${categoriesResponse.status}`);

            const itemsData = await itemsResponse.json();
            const categoriesData = await categoriesResponse.json();

            if (!Array.isArray(itemsData)) throw new Error("API /items/ вернул не массив");
            if (!Array.isArray(categoriesData)) throw new Error("API /categories/ вернул не массив");

            // 💡 ВАЖНОЕ УЛУЧШЕНИЕ: Гарантируем, что image_urls является массивом
            allProducts = itemsData.map(item => ({
                ...item,
                image_urls: item.image_urls || []
            }));
            
            allCategories = categoriesData;

            renderProducts(allProducts, null);
            setupGlobalListeners();

        } catch (error) {
            console.error('Критическая ошибка загрузки данных с API:', error);
            if (productSectionsContainer) {
                 productSectionsContainer.innerHTML = `<p class="error-message" style="color:#ff3b30; text-align: center; margin-top: 50px;">НЕ УДАЛОСЬ ЗАГРУЗИТЬ ТОВАРЫ.<br> Проверьте: <br>1) Запущен ли FastAPI на порту 8888?<br> 2) Верный ли URL API (${API_BASE_URL})?<br> 3) Работают ли эндпоинты /items/ и /categories/?</p>`;
            }
        }
    }


    // --------------------------------------------------------------------------------
    // --- ГЛОБАЛЬНЫЕ СЛУШАТЕЛИ ---
    // --------------------------------------------------------------------------------
    
    function setupProductListeners() {
        document.querySelectorAll('.view-all-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const categoryId = parseInt(e.currentTarget.dataset.categoryId);
                currentCategoryFilter = categoryId;
                isSearching = false; // Сбрасываем поиск при переходе по "Все >"
                searchInput.value = ''; // Очищаем строку поиска
                renderProducts(allProducts, categoryId);
            });
        });
    }

    function setupGlobalListeners() {
        // 🌟 НОВЫЙ СЛУШАТЕЛЬ: Ввод в строку поиска
        if (searchInput) {
            searchInput.addEventListener('input', handleSearch);
        }
        
        // Кнопка "Назад"
        if (backBtn) {
            backBtn.addEventListener('click', showHomePage);
        }

        // Кнопка "Каталог" (ДРОПДАУН)
        if (catalogButton) {
            catalogButton.addEventListener('click', (e) => {
                e.stopPropagation(); 
                toggleCategoryDropdown(); 
            });
        }
        
        // ЗАКРЫТИЕ ДРОПДАУНА при клике вне его
        document.addEventListener('click', (e) => {
            const isClickOutside = categoryDropdown && !categoryDropdown.contains(e.target) && catalogButton && !catalogButton.contains(e.target);
            
            if (isClickOutside && categoryDropdown.classList.contains('visible')) {
                 toggleCategoryDropdown(); 
            }
        }); 
        
        // Кнопка "Корзина"
        if (cartButton) {
            cartButton.addEventListener('click', showCartPage);
        }

        // Кнопка "Оформить заказ"
        if (checkoutBtn) {
             checkoutBtn.addEventListener('click', showCheckoutFormPage);
        }

        // Форма оформления заказа (просто заглушка)
        if (checkoutForm) {
            checkoutForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                submitOrderBtn.disabled = true;
                submitOrderBtn.textContent = 'Отправка...';

                // Имитация задержки отправки заказа
                await new Promise(resolve => setTimeout(resolve, 1500));

                const formData = new FormData(checkoutForm);
                
                // В реальном приложении здесь был бы fetch к /orders/
                console.log("ЗАКАЗ ОФОРМЛЕН (имитация). Данные клиента:", Object.fromEntries(formData));
                console.log("Товары в заказе:", cartItems);

                showNotification('Заказ успешно оформлен!', 'success');
                
                // Очистка корзины и возврат на главную
                cartItems = [];
                cartItemCount = 0;
                updateCartCounter();
                showHomePage();

                submitOrderBtn.disabled = false;
                submitOrderBtn.textContent = 'Подтвердить заказ';
                checkoutForm.reset();
            });

            // Слушатели для полей формы (показываем/скрываем адрес)
            document.querySelectorAll('input[name="shipping_method"]').forEach(radio => {
                radio.addEventListener('change', (e) => {
                    const addressGroup = document.getElementById('address-group');
                    const addressField = document.getElementById('address');
                    
                    if (e.target.value === 'delivery') {
                        addressGroup.classList.remove('hidden');
                        addressField.required = true;
                    } else {
                        addressGroup.classList.add('hidden');
                        addressField.required = false;
                    }
                });
            });
        }
    }

    // Инициализация
    loadAndRenderProducts();
    updateCartCounter(); 
});