/**
 * КОФЕЙНЯ «5 ЧУВСТВ» — ОФИЦИАЛЬНОЕ ПРИЛОЖЕНИЕ ВИТРИНЫ И ДОСТАВКИ
 * Теплая эстетика спешелти кофейни, 100% интерактивные кнопки,
 * живой чекаут, модификаторы напитков, трекер заказа и нулевые ошибки.
 */

(function () {
  'use strict';

  // Global State
  let catalogData = null;
  let activeCategoryId = 'all';
  let deliveryType = 'pickup'; // 'delivery' or 'pickup' (default pickup in coffee shops)
  let cutleryCount = 1;
  let searchQuery = '';
  let selectedBranch = 'мкр. Любимово, 5/1 (1 этаж)';
  let userDeliveryAddress = 'Краснодар, мкр. Любимово, 5/1';
  let selectedPaymentMethod = 'courier'; // 'courier' or 'online'
  let activePromoCode = null;
  let promoDiscountPct = 0;
  let currentPromoSlide = 0;
  let promoInterval = null;
  let activeOrderSimulation = null;

  // Cart: Array of { id, dishId, name, price, basePrice, weight, image, modifiers, quantity }
  let cart = [];

  // Current modal state
  let currentModalDish = null;
  let currentSelectedModifiers = [];

  // DOM Elements Cache
  const el = {
    // Top Bar & Header
    topAboutBtn: document.getElementById('topAboutBtn'),
    logoLink: document.getElementById('logoLink'),
    btnSelectAddress: document.getElementById('btnSelectAddress'),
    currentAddressHeader: document.getElementById('currentAddressHeader'),
    searchInput: document.getElementById('searchInput'),
    searchClearBtn: document.getElementById('searchClearBtn'),
    btnHeaderPromo: document.getElementById('btnHeaderPromo'),
    btnHeaderBonuses: document.getElementById('btnHeaderBonuses'),
    bonusValDisplay: document.getElementById('bonusValDisplay'),
    btnMobileHeaderCart: document.getElementById('btnMobileHeaderCart'),
    mobileHeaderCartBadge: document.getElementById('mobileHeaderCartBadge'),

    // Promo Carousel
    promoCarouselTrack: document.getElementById('promoCarouselTrack'),
    btnPromoPrev: document.getElementById('btnPromoPrev'),
    btnPromoNext: document.getElementById('btnPromoNext'),
    promoCarouselDots: document.getElementById('promoCarouselDots'),
    btnApplyPromo15: document.getElementById('btnApplyPromo15'),
    ticketCode15: document.getElementById('ticketCode15'),
    btnOpenBonusesModal: document.getElementById('btnOpenBonusesModal'),
    ticketLoyaltyCard: document.getElementById('ticketLoyaltyCard'),
    btnGoToCombos: document.getElementById('btnGoToCombos'),
    ticketCodeMorning: document.getElementById('ticketCodeMorning'),
    btnActivatePickupPromo: document.getElementById('btnActivatePickupPromo'),
    ticketCodePickup: document.getElementById('ticketCodePickup'),

    // Categories & Catalog
    compactCategoriesTrack: document.getElementById('compactCategoriesTrack'),
    catalogSectionsWrap: document.getElementById('catalogSectionsWrap'),

    // Desktop Cart Sidebar
    desktopCartSidebar: document.getElementById('desktopCartSidebar'),
    btnSidebarClearCart: document.getElementById('btnSidebarClearCart'),
    cartModeDelivery: document.getElementById('cartModeDelivery'),
    cartModePickup: document.getElementById('cartModePickup'),
    cartFreeDeliveryBox: document.getElementById('cartFreeDeliveryBox'),
    cfdText: document.getElementById('cfdText'),
    cfdFill: document.getElementById('cfdFill'),
    cartEmptyState: document.getElementById('cartEmptyState'),
    cartItemsList: document.getElementById('cartItemsList'),
    cartCutleryBox: document.getElementById('cartCutleryBox'),
    btnSidebarCutleryDec: document.getElementById('btnSidebarCutleryDec'),
    sidebarCutleryNum: document.getElementById('sidebarCutleryNum'),
    btnSidebarCutleryInc: document.getElementById('btnSidebarCutleryInc'),
    cartPromoInput: document.getElementById('cartPromoInput'),
    btnCartApplyPromo: document.getElementById('btnCartApplyPromo'),
    cartPromoAppliedBadge: document.getElementById('cartPromoAppliedBadge'),
    cartPromoBadgeText: document.getElementById('cartPromoBadgeText'),
    btnCartRemovePromo: document.getElementById('btnCartRemovePromo'),
    cartSidebarFooter: document.getElementById('cartSidebarFooter'),
    sidebarItemsCost: document.getElementById('sidebarItemsCost'),
    sidebarDiscountRow: document.getElementById('sidebarDiscountRow'),
    sidebarDiscountLbl: document.getElementById('sidebarDiscountLbl'),
    sidebarDiscountVal: document.getElementById('sidebarDiscountVal'),
    sidebarDeliveryRow: document.getElementById('sidebarDeliveryRow'),
    sidebarDeliveryCost: document.getElementById('sidebarDeliveryCost'),
    sidebarTotalCost: document.getElementById('sidebarTotalCost'),
    btnSidebarCheckout: document.getElementById('btnSidebarCheckout'),
    btnSidebarCheckoutSum: document.getElementById('btnSidebarCheckoutSum'),

    // Mobile Elements
    mobileFloatCartBar: document.getElementById('mobileFloatCartBar'),
    btnMobileFloatCart: document.getElementById('btnMobileFloatCart'),
    mFloatCountBadge: document.getElementById('mFloatCountBadge'),
    mFloatSum: document.getElementById('mFloatSum'),
    mNavMenu: document.getElementById('mNavMenu'),
    mNavPromos: document.getElementById('mNavPromos'),
    mNavCart: document.getElementById('mNavCart'),
    mNavCartBadge: document.getElementById('mNavCartBadge'),
    mNavAbout: document.getElementById('mNavAbout'),

    // Product Detail Modal
    productModalOverlay: document.getElementById('productModalOverlay'),
    btnProductModalClose: document.getElementById('btnProductModalClose'),
    modalProductImg: document.getElementById('modalProductImg'),
    modalProductTags: document.getElementById('modalProductTags'),
    modalProductTitle: document.getElementById('modalProductTitle'),
    modalProductWeight: document.getElementById('modalProductWeight'),
    modalProductDesc: document.getElementById('modalProductDesc'),
    modalProductComposition: document.getElementById('modalProductComposition'),
    modalModifiersContainer: document.getElementById('modalModifiersContainer'),
    btnModalQtyDec: document.getElementById('btnModalQtyDec'),
    modalQtyVal: document.getElementById('modalQtyVal'),
    btnModalQtyInc: document.getElementById('btnModalQtyInc'),
    btnModalAddToCart: document.getElementById('btnModalAddToCart'),
    modalAddPriceSum: document.getElementById('modalAddPriceSum'),

    // Address & Branch Modal
    addressModalOverlay: document.getElementById('addressModalOverlay'),
    btnAddressModalClose: document.getElementById('btnAddressModalClose'),
    tabBranchPickup: document.getElementById('tabBranchPickup'),
    tabCourierDelivery: document.getElementById('tabCourierDelivery'),
    tabContentPickup: document.getElementById('tabContentPickup'),
    tabContentDelivery: document.getElementById('tabContentDelivery'),
    btnConfirmBranch: document.getElementById('btnConfirmBranch'),
    btnConfirmDelivery: document.getElementById('btnConfirmDelivery'),
    deliveryStreetInput: document.getElementById('deliveryStreetInput'),

    // Checkout Modal
    checkoutModalOverlay: document.getElementById('checkoutModalOverlay'),
    btnCheckoutModalClose: document.getElementById('btnCheckoutModalClose'),
    orderClientName: document.getElementById('orderClientName'),
    orderClientPhone: document.getElementById('orderClientPhone'),
    checkoutReceivingSummary: document.getElementById('checkoutReceivingSummary'),
    checkoutRecvTitle: document.getElementById('checkoutRecvTitle'),
    checkoutRecvDesc: document.getElementById('checkoutRecvDesc'),
    btnCheckoutChangeAddress: document.getElementById('btnCheckoutChangeAddress'),
    payMethodCardCourier: document.getElementById('payMethodCardCourier'),
    payMethodCardOnline: document.getElementById('payMethodCardOnline'),
    orderCommentInput: document.getElementById('orderCommentInput'),
    coItemsCount: document.getElementById('coItemsCount'),
    coDiscountLine: document.getElementById('coDiscountLine'),
    coDiscountVal: document.getElementById('coDiscountVal'),
    coDeliveryLine: document.getElementById('coDeliveryLine'),
    coDeliveryVal: document.getElementById('coDeliveryVal'),
    coTotalSum: document.getElementById('coTotalSum'),
    btnSubmitFinalOrder: document.getElementById('btnSubmitFinalOrder'),
    btnSubmitOrderSum: document.getElementById('btnSubmitOrderSum'),

    // Order Tracker Modal
    orderTrackerModalOverlay: document.getElementById('orderTrackerModalOverlay'),
    btnTrackerModalClose: document.getElementById('btnTrackerModalClose'),
    trackerStatusPill: document.getElementById('trackerStatusPill'),
    trackerOrderNum: document.getElementById('trackerOrderNum'),
    trackerTimeRemain: document.getElementById('trackerTimeRemain'),
    stepPoint1: document.getElementById('stepPoint1'),
    stepLine1: document.getElementById('stepLine1'),
    stepPoint2: document.getElementById('stepPoint2'),
    stepLine2: document.getElementById('stepLine2'),
    stepPoint3: document.getElementById('stepPoint3'),
    stepLine3: document.getElementById('stepLine3'),
    stepPoint4: document.getElementById('stepPoint4'),
    trackerStatusIcon: document.getElementById('trackerStatusIcon'),
    trackerStatusHeading: document.getElementById('trackerStatusHeading'),
    trackerStatusText: document.getElementById('trackerStatusText'),
    trackerItemsSummary: document.getElementById('trackerItemsSummary'),
    btnTrackerNewOrder: document.getElementById('btnTrackerNewOrder'),

    // About & Loyalty Modals
    aboutModalOverlay: document.getElementById('aboutModalOverlay'),
    btnAboutModalClose: document.getElementById('btnAboutModalClose'),
    loyaltyModalOverlay: document.getElementById('loyaltyModalOverlay'),
    btnLoyaltyModalClose: document.getElementById('btnLoyaltyModalClose'),
    toastContainer: document.getElementById('toastContainer')
  };

  // Toast Notification Helper
  function showToast(message, icon = '✨') {
    const toast = document.createElement('div');
    toast.className = 'toast-msg';
    toast.innerHTML = `<span>${icon}</span> <span>${message}</span>`;
    el.toastContainer.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 2800);
  }

  // 1. Data Loading & Initialization
  async function initApp() {
    try {
      const resp = await fetch('dishes.json');
      catalogData = await resp.json();
      renderCategories();
      renderCatalog();
      setupEventListeners();
      startPromoAutoSlide();
      updateCartUI();
    } catch (err) {
      console.error('Ошибка загрузки dishes.json:', err);
    }
  }

  // 2. Render Categories Bar
  function renderCategories() {
    if (!catalogData || !catalogData.categories) return;
    el.compactCategoriesTrack.innerHTML = '';

    catalogData.categories.forEach(cat => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = `category-chip ${cat.id === activeCategoryId ? 'active' : ''}`;
      btn.dataset.id = cat.id;

      // Count dishes in category
      let count = 0;
      if (cat.id === 'all') {
        count = catalogData.dishes.length;
      } else {
        count = catalogData.dishes.filter(d => d.category === cat.id).length;
      }

      btn.innerHTML = `
        <span class="chip-icon">${cat.icon}</span>
        <span class="chip-title">${cat.title}</span>
        <span class="chip-count">${count}</span>
      `;

      btn.addEventListener('click', () => {
        activeCategoryId = cat.id;
        document.querySelectorAll('.category-chip').forEach(c => c.classList.remove('active'));
        btn.classList.add('active');

        if (cat.id === 'all') {
          window.scrollTo({ top: el.catalogSectionsWrap.offsetTop - 120, behavior: 'smooth' });
          renderCatalog();
        } else {
          renderCatalog();
          const targetSection = document.getElementById(`cat-section-${cat.id}`);
          if (targetSection) {
            targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }
      });

      el.compactCategoriesTrack.appendChild(btn);
    });
  }

  // 3. Render Catalog Sections & Food Cards
  function renderCatalog() {
    if (!catalogData || !catalogData.dishes) return;
    el.catalogSectionsWrap.innerHTML = '';

    const query = searchQuery.trim().toLowerCase();

    // Filter dishes by search if active
    let filteredDishes = catalogData.dishes;
    if (query) {
      filteredDishes = filteredDishes.filter(d => 
        d.name.toLowerCase().includes(query) ||
        (d.description && d.description.toLowerCase().includes(query)) ||
        (d.composition && d.composition.toLowerCase().includes(query))
      );
    }

    // If searching, show single search result block
    if (query) {
      const sec = document.createElement('div');
      sec.className = 'catalog-section';
      sec.innerHTML = `
        <div class="section-title-row">
          <h2 class="section-title">Результаты поиска «${query}»</h2>
          <span class="section-count-badge">${filteredDishes.length} позиций</span>
        </div>
      `;
      const grid = document.createElement('div');
      grid.className = 'dishes-grid';
      if (filteredDishes.length === 0) {
        grid.innerHTML = `
          <div style="grid-column: 1 / -1; padding: 40px 20px; text-align: center; color: var(--text-dim);">
            Ничего не найдено по запросу «${query}». Попробуйте капучино, сырники или круассан.
          </div>
        `;
      } else {
        filteredDishes.forEach(dish => grid.appendChild(createDishCardElement(dish)));
      }
      sec.appendChild(grid);
      el.catalogSectionsWrap.appendChild(sec);
      return;
    }

    // Normal grouped rendering
    const categoriesToRender = activeCategoryId === 'all' 
      ? catalogData.categories.filter(c => c.id !== 'all')
      : catalogData.categories.filter(c => c.id === activeCategoryId);

    categoriesToRender.forEach(cat => {
      const catDishes = catalogData.dishes.filter(d => d.category === cat.id);
      if (catDishes.length === 0) return;

      const sec = document.createElement('div');
      sec.className = 'catalog-section';
      sec.id = `cat-section-${cat.id}`;
      sec.innerHTML = `
        <div class="section-title-row">
          <h2 class="section-title">${cat.icon} ${cat.title}</h2>
          <span class="section-count-badge">${catDishes.length}</span>
        </div>
      `;

      const grid = document.createElement('div');
      grid.className = 'dishes-grid';
      catDishes.forEach(dish => grid.appendChild(createDishCardElement(dish)));

      sec.appendChild(grid);
      el.catalogSectionsWrap.appendChild(sec);
    });
  }

  // Create single Dish Card
  function createDishCardElement(dish) {
    const card = document.createElement('article');
    card.className = 'dish-card';
    card.dataset.id = dish.id;

    // Badges markup
    let badgesMarkup = '';
    if (dish.tags && dish.tags.length > 0) {
      dish.tags.forEach(t => {
        let colorCls = 'gold';
        if (t.toLowerCase().includes('healthy') || t.toLowerCase().includes('веган') || t.toLowerCase().includes('superfood')) colorCls = 'green';
        if (t.toLowerCase().includes('выгода') || t.toLowerCase().includes('десерт') || t.toLowerCase().includes('завтрак')) colorCls = 'berry';
        badgesMarkup += `<span class="card-badge ${colorCls}">${t}</span>`;
      });
    }

    // Price markup
    let priceMarkup = `<span class="current-price">${dish.price} ₽</span>`;
    if (dish.oldPrice) {
      priceMarkup += `<span class="old-price">${dish.oldPrice} ₽</span>`;
    }

    // Check if dish is in cart
    const inCartItem = cart.find(i => i.dishId === dish.id && (!i.modifiers || i.modifiers.length === 0));
    const qty = inCartItem ? inCartItem.quantity : 0;

    let buttonMarkup = '';
    if (qty > 0) {
      buttonMarkup = `
        <div class="card-stepper-wrap">
          <button type="button" class="card-stepper-btn btn-card-dec" aria-label="Меньше">–</button>
          <span class="card-stepper-val">${qty}</span>
          <button type="button" class="card-stepper-btn btn-card-inc" aria-label="Больше">+</button>
        </div>
      `;
    } else {
      buttonMarkup = `
        <button type="button" class="btn-card-add ${dish.hasModifiers ? 'has-mods' : ''}">
          <span>+ ${dish.hasModifiers ? 'Выбрать' : 'В корзину'}</span>
        </button>
      `;
    }

    card.innerHTML = `
      <div class="dish-card-img-wrap">
        <img src="${dish.image}" alt="${dish.name}" class="dish-card-img" loading="lazy">
        <div class="dish-card-badges">${badgesMarkup}</div>
        <span class="dish-card-weight">${dish.weight}</span>
      </div>
      <div class="dish-card-body">
        <h3 class="dish-card-title">${dish.name}</h3>
        <p class="dish-card-desc">${dish.description || ''}</p>
        <div class="dish-card-footer">
          <div class="price-box">${priceMarkup}</div>
          <div class="card-action-slot">${buttonMarkup}</div>
        </div>
      </div>
    `;

    // Click on photo or title opens details/modifier modal
    const openModalElements = [
      card.querySelector('.dish-card-img-wrap'),
      card.querySelector('.dish-card-title')
    ];
    openModalElements.forEach(elItem => {
      elItem.addEventListener('click', () => openProductModal(dish));
    });

    // Button interactions
    const addBtn = card.querySelector('.btn-card-add');
    if (addBtn) {
      addBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (dish.hasModifiers) {
          openProductModal(dish);
        } else {
          addToCart(dish, 1, []);
          showToast(`Добавлено: ${dish.name}`, '☕');
          renderCatalog();
        }
      });
    }

    const decBtn = card.querySelector('.btn-card-dec');
    const incBtn = card.querySelector('.btn-card-inc');
    if (decBtn && incBtn) {
      decBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        decreaseCartItem(inCartItem.id);
        renderCatalog();
      });
      incBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        increaseCartItem(inCartItem.id);
        renderCatalog();
      });
    }

    return card;
  }

  // 4. Product Details & Modifiers Modal
  function openProductModal(dish) {
    currentModalDish = dish;
    currentSelectedModifiers = [];

    el.modalProductImg.src = dish.image;
    el.modalProductTitle.textContent = dish.name;
    el.modalProductWeight.textContent = dish.weight;
    el.modalProductDesc.textContent = dish.description || '';
    el.modalProductComposition.textContent = `Состав: ${dish.composition || 'Отборные ингредиенты, натуральные сиропы'}`;
    el.modalQtyVal.textContent = '1';

    // Tags
    el.modalProductTags.innerHTML = '';
    if (dish.tags && dish.tags.length > 0) {
      dish.tags.forEach(t => {
        el.modalProductTags.innerHTML += `<span class="card-badge gold">${t}</span>`;
      });
    }

    // Modifiers render
    el.modalModifiersContainer.innerHTML = '';
    if (dish.hasModifiers && dish.modifierGroups && catalogData.modifiers) {
      dish.modifierGroups.forEach(grpKey => {
        const group = catalogData.modifiers[grpKey];
        if (!group) return;

        const grpDiv = document.createElement('div');
        grpDiv.className = 'modifier-group';
        grpDiv.innerHTML = `<h4 class="modifier-group-title">${group.title}</h4>`;

        const optList = document.createElement('div');
        optList.className = 'modifier-options-list';

        group.options.forEach((opt, idx) => {
          const item = document.createElement('div');
          const isSelected = opt.default === true;
          if (isSelected) {
            currentSelectedModifiers.push({ group: grpKey, name: opt.name, price: opt.price });
          }

          item.className = `modifier-option-item ${isSelected ? 'selected' : ''}`;
          item.dataset.group = grpKey;
          item.dataset.name = opt.name;
          item.dataset.price = opt.price;

          const priceText = opt.price > 0 ? `+${opt.price} ₽` : (opt.price < 0 ? `${opt.price} ₽` : 'Бесплатно');

          item.innerHTML = `
            <div class="mod-left">
              <span>${group.type === 'single' ? (isSelected ? '●' : '○') : '☑'}</span>
              <span>${opt.name}</span>
            </div>
            <span class="mod-price">${priceText}</span>
          `;

          item.addEventListener('click', () => {
            if (group.type === 'single') {
              // Remove others in this group
              currentSelectedModifiers = currentSelectedModifiers.filter(m => m.group !== grpKey);
              currentSelectedModifiers.push({ group: grpKey, name: opt.name, price: opt.price });
              optList.querySelectorAll('.modifier-option-item').forEach(elItem => {
                elItem.classList.remove('selected');
                elItem.querySelector('.mod-left span:first-child').textContent = '○';
              });
              item.classList.add('selected');
              item.querySelector('.mod-left span:first-child').textContent = '●';
            } else {
              // Multiple toggle
              const existIdx = currentSelectedModifiers.findIndex(m => m.group === grpKey && m.name === opt.name);
              if (existIdx >= 0) {
                currentSelectedModifiers.splice(existIdx, 1);
                item.classList.remove('selected');
              } else {
                currentSelectedModifiers.push({ group: grpKey, name: opt.name, price: opt.price });
                item.classList.add('selected');
              }
            }
            updateModalPrice();
          });

          optList.appendChild(item);
        });

        grpDiv.appendChild(optList);
        el.modalModifiersContainer.appendChild(grpDiv);
      });
    }

    updateModalPrice();
    openModal(el.productModalOverlay);
  }

  function updateModalPrice() {
    if (!currentModalDish) return;
    const qty = parseInt(el.modalQtyVal.textContent, 10) || 1;
    let singlePrice = currentModalDish.price;

    currentSelectedModifiers.forEach(m => {
      singlePrice += m.price;
    });

    const total = singlePrice * qty;
    el.modalAddPriceSum.textContent = `${total} ₽`;
  }

  // 5. Cart Operations
  function addToCart(dish, quantity = 1, modifiers = []) {
    const modString = modifiers.map(m => m.name).sort().join(', ');
    const uniqueId = `${dish.id}_${modString}`;

    let singleItemPrice = dish.price;
    modifiers.forEach(m => singleItemPrice += m.price);

    const existingIndex = cart.findIndex(i => i.id === uniqueId);
    if (existingIndex >= 0) {
      cart[existingIndex].quantity += quantity;
    } else {
      cart.push({
        id: uniqueId,
        dishId: dish.id,
        name: dish.name,
        price: singleItemPrice,
        basePrice: dish.price,
        weight: dish.weight,
        image: dish.image,
        modifiers: modifiers,
        quantity: quantity
      });
    }

    updateCartUI();
  }

  function increaseCartItem(cartId) {
    const item = cart.find(i => i.id === cartId);
    if (item) {
      item.quantity += 1;
      updateCartUI();
    }
  }

  function decreaseCartItem(cartId) {
    const itemIndex = cart.findIndex(i => i.id === cartId);
    if (itemIndex >= 0) {
      if (cart[itemIndex].quantity > 1) {
        cart[itemIndex].quantity -= 1;
      } else {
        cart.splice(itemIndex, 1);
      }
      updateCartUI();
    }
  }

  function clearCart() {
    cart = [];
    updateCartUI();
    renderCatalog();
    showToast('Корзина очищена', '🗑️');
  }

  // 6. Update Cart UI & Calculations
  function updateCartUI() {
    const totalItemsCount = cart.reduce((acc, i) => acc + i.quantity, 0);
    const itemsCost = cart.reduce((acc, i) => acc + (i.price * i.quantity), 0);

    // Badges
    el.mobileHeaderCartBadge.textContent = totalItemsCount;
    el.mFloatCountBadge.textContent = totalItemsCount;
    el.mNavCartBadge.textContent = totalItemsCount;
    el.mNavCartBadge.style.display = totalItemsCount > 0 ? 'inline-block' : 'none';

    // Empty state vs Filled state
    if (cart.length === 0) {
      el.cartEmptyState.style.display = 'block';
      el.cartItemsList.style.display = 'none';
      el.btnSidebarCheckout.disabled = true;
      el.btnSidebarClearCart.style.display = 'none';
      el.cartCutleryBox.style.display = 'none';
    } else {
      el.cartEmptyState.style.display = 'none';
      el.cartItemsList.style.display = 'flex';
      el.btnSidebarCheckout.disabled = false;
      el.btnSidebarClearCart.style.display = 'inline-block';
      el.cartCutleryBox.style.display = 'flex';
    }

    // Render cart items
    el.cartItemsList.innerHTML = '';
    cart.forEach(item => {
      const row = document.createElement('div');
      row.className = 'cart-item-row';

      const modText = item.modifiers && item.modifiers.length > 0
        ? `<div class="cart-item-modifiers">${item.modifiers.map(m => m.name).join(' • ')}</div>`
        : '';

      row.innerHTML = `
        <img src="${item.image}" alt="${item.name}" class="cart-item-img">
        <div class="cart-item-info">
          <div class="cart-item-name">${item.name}</div>
          ${modText}
          <div class="cart-item-price">${item.price * item.quantity} ₽</div>
        </div>
        <div class="counter-stepper">
          <button type="button" class="stepper-btn btn-ci-dec" aria-label="Уменьшить">–</button>
          <span class="stepper-val">${item.quantity}</span>
          <button type="button" class="stepper-btn btn-ci-inc" aria-label="Увеличить">+</button>
        </div>
      `;

      row.querySelector('.btn-ci-dec').addEventListener('click', () => {
        decreaseCartItem(item.id);
        renderCatalog();
      });
      row.querySelector('.btn-ci-inc').addEventListener('click', () => {
        increaseCartItem(item.id);
        renderCatalog();
      });

      el.cartItemsList.appendChild(row);
    });

    // Discount calculations
    let discountAmount = 0;
    if (deliveryType === 'pickup') {
      discountAmount += Math.round(itemsCost * 0.10); // 10% pickup discount
    }
    if (activePromoCode && promoDiscountPct > 0) {
      discountAmount += Math.round(itemsCost * promoDiscountPct);
    }

    // Delivery calculation
    let deliveryCost = 0;
    if (deliveryType === 'delivery') {
      if (itemsCost >= 800 || itemsCost === 0) {
        deliveryCost = 0;
      } else {
        deliveryCost = 150;
      }
    }

    const finalTotal = Math.max(0, itemsCost - discountAmount + deliveryCost);

    // Free delivery progress
    if (deliveryType === 'pickup') {
      el.cfdText.innerHTML = 'Самовывоз: <strong>Скидка 10% на заказ</strong>';
      el.cfdFill.style.width = '100%';
    } else {
      const freeThreshold = 800;
      const remain = Math.max(0, freeThreshold - itemsCost);
      if (remain > 0) {
        const pct = Math.min(100, Math.round((itemsCost / freeThreshold) * 100));
        el.cfdText.innerHTML = `До бесплатной доставки: <strong>${remain} ₽</strong>`;
        el.cfdFill.style.width = `${pct}%`;
      } else {
        el.cfdText.innerHTML = 'Бесплатная доставка <strong>активна! 🚀</strong>';
        el.cfdFill.style.width = '100%';
      }
    }

    // Summary lines
    el.sidebarItemsCost.textContent = `${itemsCost} ₽`;
    
    if (discountAmount > 0) {
      el.sidebarDiscountRow.style.display = 'flex';
      const reason = deliveryType === 'pickup' && activePromoCode ? 'Самовывоз 10% + Промокод' : (deliveryType === 'pickup' ? 'Скидка на самовывоз (10%)' : 'Скидка по промокоду');
      el.sidebarDiscountLbl.textContent = reason;
      el.sidebarDiscountVal.textContent = `-${discountAmount} ₽`;
    } else {
      el.sidebarDiscountRow.style.display = 'none';
    }

    if (deliveryType === 'pickup') {
      el.sidebarDeliveryRow.style.display = 'none';
    } else {
      el.sidebarDeliveryRow.style.display = 'flex';
      el.sidebarDeliveryCost.textContent = deliveryCost === 0 ? 'Бесплатно' : `${deliveryCost} ₽`;
    }

    el.sidebarTotalCost.textContent = `${finalTotal} ₽`;
    el.btnSidebarCheckoutSum.textContent = `${finalTotal} ₽`;

    // Mobile float cart
    el.mFloatSum.textContent = `${finalTotal} ₽`;
  }

  // 7. Promo Code Handlers
  function applyPromoCode(code) {
    if (!catalogData || !catalogData.promoCodes) return;
    const cleanCode = code.trim().toUpperCase();
    const promo = catalogData.promoCodes[cleanCode];

    if (promo) {
      const itemsCost = cart.reduce((acc, i) => acc + (i.price * i.quantity), 0);
      if (itemsCost < promo.minOrder) {
        showToast(`Минимальный заказ для промокода ${cleanCode} — ${promo.minOrder} ₽`, '⚠️');
        return;
      }
      activePromoCode = cleanCode;
      promoDiscountPct = promo.discountPct;
      el.cartPromoAppliedBadge.style.display = 'flex';
      el.cartPromoBadgeText.textContent = `${cleanCode}: -${Math.round(promo.discountPct * 100)}%`;
      el.cartPromoInput.value = '';
      updateCartUI();
      showToast(`Промокод ${cleanCode} успешно активирован!`, '🎉');
    } else {
      showToast(`Промокод «${cleanCode}» не найден`, '❌');
    }
  }

  function removePromoCode() {
    activePromoCode = null;
    promoDiscountPct = 0;
    el.cartPromoAppliedBadge.style.display = 'none';
    updateCartUI();
    showToast('Промокод удален', 'ℹ️');
  }

  // 8. Promo Carousel Logic
  function goToSlide(idx) {
    currentPromoSlide = idx;
    el.promoCarouselTrack.style.transform = `translateX(-${currentPromoSlide * 100}%)`;
    el.promoCarouselDots.querySelectorAll('.dot-btn').forEach((d, i) => {
      d.classList.toggle('active', i === currentPromoSlide);
    });
  }

  function nextSlide() {
    const total = 4;
    currentPromoSlide = (currentPromoSlide + 1) % total;
    goToSlide(currentPromoSlide);
  }

  function prevSlide() {
    const total = 4;
    currentPromoSlide = (currentPromoSlide - 1 + total) % total;
    goToSlide(currentPromoSlide);
  }

  function startPromoAutoSlide() {
    if (promoInterval) clearInterval(promoInterval);
    promoInterval = setInterval(nextSlide, 5500);
  }

  // 9. Modals Helper
  function openModal(overlay) {
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeModal(overlay) {
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  // 10. Checkout & Order Simulation
  function openCheckoutModal() {
    if (cart.length === 0) {
      showToast('Ваша корзина пуста', '☕');
      return;
    }

    const totalItemsCount = cart.reduce((acc, i) => acc + i.quantity, 0);
    const itemsCost = cart.reduce((acc, i) => acc + (i.price * i.quantity), 0);

    let discountAmount = 0;
    if (deliveryType === 'pickup') discountAmount += Math.round(itemsCost * 0.10);
    if (activePromoCode && promoDiscountPct > 0) discountAmount += Math.round(itemsCost * promoDiscountPct);

    let deliveryCost = 0;
    if (deliveryType === 'delivery') {
      deliveryCost = itemsCost >= 800 ? 0 : 150;
    }

    const finalTotal = Math.max(0, itemsCost - discountAmount + deliveryCost);

    // Receiving summary
    if (deliveryType === 'pickup') {
      el.checkoutRecvTitle.textContent = 'Самовывоз со скидкой 10%';
      el.checkoutRecvDesc.textContent = selectedBranch;
    } else {
      el.checkoutRecvTitle.textContent = 'Доставка курьером (30–45 мин)';
      el.checkoutRecvDesc.textContent = userDeliveryAddress;
    }

    // Summary lines
    el.coItemsCount.textContent = `${totalItemsCount} шт`;
    if (discountAmount > 0) {
      el.coDiscountLine.style.display = 'flex';
      el.coDiscountVal.textContent = `-${discountAmount} ₽`;
    } else {
      el.coDiscountLine.style.display = 'none';
    }

    if (deliveryType === 'pickup') {
      el.coDeliveryLine.style.display = 'none';
    } else {
      el.coDeliveryLine.style.display = 'flex';
      el.coDeliveryVal.textContent = deliveryCost === 0 ? 'Бесплатно' : `${deliveryCost} ₽`;
    }

    el.coTotalSum.textContent = `${finalTotal} ₽`;
    el.btnSubmitOrderSum.textContent = `${finalTotal} ₽`;

    openModal(el.checkoutModalOverlay);
  }

  function submitOrder() {
    const name = el.orderClientName.value.trim() || 'Гость';
    const phone = el.orderClientPhone.value.trim();

    if (!phone || phone.length < 7) {
      showToast('Пожалуйста, введите телефон для подтверждения', '⚠️');
      el.orderClientPhone.focus();
      return;
    }

    closeModal(el.checkoutModalOverlay);

    // Generate simulated order
    const randomOrderNum = Math.floor(1000 + Math.random() * 9000);
    const orderNumberStr = `5C-${randomOrderNum}`;
    const itemsCopy = [...cart];

    // Clear cart after checkout
    cart = [];
    updateCartUI();
    renderCatalog();

    startOrderTracking(orderNumberStr, itemsCopy, name);
  }

  // 11. Live Order Tracker Simulation
  function startOrderTracking(orderNum, items, clientName) {
    el.trackerOrderNum.textContent = `Заказ № ${orderNum}`;
    
    // Fill summary
    el.trackerItemsSummary.innerHTML = `
      <div style="font-weight: 700; margin-bottom: 6px; color: var(--coffee-dark);">Состав заказа:</div>
      ${items.map(i => `<div>• ${i.name} × ${i.quantity} шт (${i.price * i.quantity} ₽)</div>`).join('')}
    `;

    // Reset steps
    el.stepPoint1.className = 'step-point completed';
    el.stepLine1.className = 'step-line completed';
    el.stepPoint2.className = 'step-point active';
    el.stepLine2.className = 'step-line';
    el.stepPoint3.className = 'step-point';
    el.stepLine3.className = 'step-line';
    el.stepPoint4.className = 'step-point';

    el.trackerStatusPill.textContent = 'Готовится бариста ☕';
    el.trackerTimeRemain.textContent = '15–20 мин';
    el.trackerStatusIcon.textContent = '👨‍🍳';
    el.trackerStatusHeading.textContent = `Бариста готовит заказ для ${clientName}`;
    el.trackerStatusText.textContent = 'Смалываем зерна 100% арабики, подогреваем молочную пенку и упаковываем горячую выпечку.';

    openModal(el.orderTrackerModalOverlay);
    showToast(`Заказ № ${orderNum} оформлен!`, '🎉');

    // Simulate progress after 10s
    if (activeOrderSimulation) clearTimeout(activeOrderSimulation);
    activeOrderSimulation = setTimeout(() => {
      el.stepPoint2.className = 'step-point completed';
      el.stepLine2.className = 'step-line completed';
      el.stepPoint3.className = 'step-point active';
      el.trackerStatusPill.textContent = deliveryType === 'pickup' ? 'Готов к выдаче! 🥐' : 'Курьер в пути 🛵';
      el.trackerTimeRemain.textContent = deliveryType === 'pickup' ? 'Ждет вас на стойке' : '10–12 мин';
      el.trackerStatusIcon.textContent = deliveryType === 'pickup' ? '🛍️' : '🛵';
      el.trackerStatusHeading.textContent = deliveryType === 'pickup' 
        ? `Заказ готов в ${selectedBranch}` 
        : 'Курьер забрал термосумку с заказом';
      el.trackerStatusText.textContent = deliveryType === 'pickup'
        ? 'Назовите бариста ваш номер заказа на стойке выдачи.'
        : 'Горячий кофе и свежие круассаны спешат по вашему адресу.';
    }, 9000);
  }

  // 12. Setup Event Listeners (All Interactive Buttons)
  function setupEventListeners() {
    // Top Bar & Logo
    el.topAboutBtn.addEventListener('click', () => openModal(el.aboutModalOverlay));
    el.mNavAbout.addEventListener('click', () => openModal(el.aboutModalOverlay));
    el.logoLink.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // Address & Branch Picker
    el.btnSelectAddress.addEventListener('click', () => openModal(el.addressModalOverlay));
    el.btnAddressModalClose.addEventListener('click', () => closeModal(el.addressModalOverlay));
    el.btnCheckoutChangeAddress.addEventListener('click', () => {
      closeModal(el.checkoutModalOverlay);
      openModal(el.addressModalOverlay);
    });

    el.tabBranchPickup.addEventListener('click', () => {
      el.tabBranchPickup.classList.add('active');
      el.tabCourierDelivery.classList.remove('active');
      el.tabContentPickup.classList.add('active');
      el.tabContentDelivery.classList.remove('active');
    });

    el.tabCourierDelivery.addEventListener('click', () => {
      el.tabCourierDelivery.classList.add('active');
      el.tabBranchPickup.classList.remove('active');
      el.tabContentDelivery.classList.add('active');
      el.tabContentPickup.classList.remove('active');
    });

    document.querySelectorAll('.branch-option-card').forEach(card => {
      card.addEventListener('click', () => {
        document.querySelectorAll('.branch-option-card').forEach(c => c.classList.remove('active'));
        card.classList.add('active');
        const radio = card.querySelector('input[type="radio"]');
        if (radio) radio.checked = true;
      });
    });

    el.btnConfirmBranch.addEventListener('click', () => {
      const activeCard = document.querySelector('.branch-option-card.active .branch-name');
      if (activeCard) {
        selectedBranch = activeCard.textContent;
        el.currentAddressHeader.textContent = selectedBranch.split('(')[0].trim();
        deliveryType = 'pickup';
        el.cartModePickup.classList.add('active');
        el.cartModeDelivery.classList.remove('active');
        updateCartUI();
        showToast(`Выбран филиал: ${selectedBranch}`, '📍');
      }
      closeModal(el.addressModalOverlay);
    });

    el.btnConfirmDelivery.addEventListener('click', () => {
      const st = el.deliveryStreetInput.value.trim() || 'Краснодар, мкр. Любимово';
      userDeliveryAddress = st;
      el.currentAddressHeader.textContent = st;
      deliveryType = 'delivery';
      el.cartModeDelivery.classList.add('active');
      el.cartModePickup.classList.remove('active');
      updateCartUI();
      showToast(`Адрес доставки сохранен: ${st}`, '🛵');
      closeModal(el.addressModalOverlay);
    });

    // Search Input
    el.searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value;
      el.searchClearBtn.classList.toggle('visible', searchQuery.length > 0);
      renderCatalog();
    });

    el.searchClearBtn.addEventListener('click', () => {
      el.searchInput.value = '';
      searchQuery = '';
      el.searchClearBtn.classList.remove('visible');
      renderCatalog();
    });

    // Promo & Loyalty Buttons
    el.btnHeaderPromo.addEventListener('click', () => openModal(el.loyaltyModalOverlay));
    el.btnHeaderBonuses.addEventListener('click', () => openModal(el.loyaltyModalOverlay));
    el.btnOpenBonusesModal.addEventListener('click', () => openModal(el.loyaltyModalOverlay));
    el.ticketLoyaltyCard.addEventListener('click', () => openModal(el.loyaltyModalOverlay));
    el.mNavPromos.addEventListener('click', () => openModal(el.loyaltyModalOverlay));
    el.btnLoyaltyModalClose.addEventListener('click', () => closeModal(el.loyaltyModalOverlay));

    // Perforated Tickets & Promo Actions
    el.btnApplyPromo15.addEventListener('click', () => applyPromoCode('5ЧУВСТВ'));
    el.ticketCode15.addEventListener('click', () => {
      navigator.clipboard?.writeText('5ЧУВСТВ');
      applyPromoCode('5ЧУВСТВ');
    });

    el.btnGoToCombos.addEventListener('click', () => {
      activeCategoryId = 'combos';
      document.querySelectorAll('.category-chip').forEach(c => {
        c.classList.toggle('active', c.dataset.id === 'combos');
      });
      renderCatalog();
      const sec = document.getElementById('cat-section-combos');
      if (sec) sec.scrollIntoView({ behavior: 'smooth' });
    });

    el.ticketCodeMorning.addEventListener('click', () => {
      applyPromoCode('УТРО');
    });

    el.btnActivatePickupPromo.addEventListener('click', () => {
      deliveryType = 'pickup';
      el.cartModePickup.classList.add('active');
      el.cartModeDelivery.classList.remove('active');
      applyPromoCode('САМОВЫВОЗ');
    });

    el.ticketCodePickup.addEventListener('click', () => {
      deliveryType = 'pickup';
      el.cartModePickup.classList.add('active');
      el.cartModeDelivery.classList.remove('active');
      applyPromoCode('САМОВЫВОЗ');
    });

    // Available Promo Codes inside Modal
    document.querySelectorAll('.promo-item-pill').forEach(pill => {
      pill.querySelector('.btn-pip-copy').addEventListener('click', () => {
        const code = pill.dataset.code;
        applyPromoCode(code);
        closeModal(el.loyaltyModalOverlay);
      });
    });

    // Carousel Navigation
    el.btnPromoNext.addEventListener('click', () => {
      nextSlide();
      startPromoAutoSlide();
    });
    el.btnPromoPrev.addEventListener('click', () => {
      prevSlide();
      startPromoAutoSlide();
    });

    el.promoCarouselDots.querySelectorAll('.dot-btn').forEach((dot, idx) => {
      dot.addEventListener('click', () => {
        goToSlide(idx);
        startPromoAutoSlide();
      });
    });

    // Delivery vs Pickup Mode Buttons in Sidebar
    el.cartModeDelivery.addEventListener('click', () => {
      deliveryType = 'delivery';
      el.cartModeDelivery.classList.add('active');
      el.cartModePickup.classList.remove('active');
      updateCartUI();
      showToast('Выбран режим: Доставка курьером', '🛵');
    });

    el.cartModePickup.addEventListener('click', () => {
      deliveryType = 'pickup';
      el.cartModePickup.classList.add('active');
      el.cartModeDelivery.classList.remove('active');
      updateCartUI();
      showToast('Выбран режим: С собой со скидкой 10%', '🛍️');
    });

    // Cutlery Counter
    el.btnSidebarCutleryDec.addEventListener('click', () => {
      if (cutleryCount > 0) {
        cutleryCount -= 1;
        el.sidebarCutleryNum.textContent = cutleryCount;
      }
    });
    el.btnSidebarCutleryInc.addEventListener('click', () => {
      cutleryCount += 1;
      el.sidebarCutleryNum.textContent = cutleryCount;
    });

    // Cart Promo Field
    el.btnCartApplyPromo.addEventListener('click', () => {
      const code = el.cartPromoInput.value;
      if (code) applyPromoCode(code);
    });
    el.cartPromoInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const code = el.cartPromoInput.value;
        if (code) applyPromoCode(code);
      }
    });
    el.btnCartRemovePromo.addEventListener('click', removePromoCode);
    el.btnSidebarClearCart.addEventListener('click', clearCart);

    // Checkout Triggers
    el.btnSidebarCheckout.addEventListener('click', openCheckoutModal);
    el.btnMobileFloatCart.addEventListener('click', openCheckoutModal);
    el.btnMobileHeaderCart.addEventListener('click', openCheckoutModal);
    el.mNavCart.addEventListener('click', openCheckoutModal);
    el.mNavMenu.addEventListener('click', () => {
      window.scrollTo({ top: el.catalogSectionsWrap.offsetTop - 120, behavior: 'smooth' });
    });

    // Checkout Modal
    el.btnCheckoutModalClose.addEventListener('click', () => closeModal(el.checkoutModalOverlay));
    el.payMethodCardCourier.addEventListener('click', () => {
      el.payMethodCardCourier.classList.add('active');
      el.payMethodCardOnline.classList.remove('active');
      selectedPaymentMethod = 'courier';
    });
    el.payMethodCardOnline.addEventListener('click', () => {
      el.payMethodCardOnline.classList.add('active');
      el.payMethodCardCourier.classList.remove('active');
      selectedPaymentMethod = 'online';
    });
    el.btnSubmitFinalOrder.addEventListener('click', submitOrder);

    // Product Detail Modal
    el.btnProductModalClose.addEventListener('click', () => closeModal(el.productModalOverlay));
    el.btnModalQtyDec.addEventListener('click', () => {
      let qty = parseInt(el.modalQtyVal.textContent, 10) || 1;
      if (qty > 1) {
        el.modalQtyVal.textContent = qty - 1;
        updateModalPrice();
      }
    });
    el.btnModalQtyInc.addEventListener('click', () => {
      let qty = parseInt(el.modalQtyVal.textContent, 10) || 1;
      el.modalQtyVal.textContent = qty + 1;
      updateModalPrice();
    });
    el.btnModalAddToCart.addEventListener('click', () => {
      if (currentModalDish) {
        const qty = parseInt(el.modalQtyVal.textContent, 10) || 1;
        addToCart(currentModalDish, qty, [...currentSelectedModifiers]);
        closeModal(el.productModalOverlay);
        renderCatalog();
        showToast(`Добавлено: ${currentModalDish.name} (${qty} шт)`, '☕');
      }
    });

    // Order Tracker Modal
    el.btnTrackerModalClose.addEventListener('click', () => closeModal(el.orderTrackerModalOverlay));
    el.btnTrackerNewOrder.addEventListener('click', () => {
      closeModal(el.orderTrackerModalOverlay);
      window.scrollTo({ top: el.catalogSectionsWrap.offsetTop - 120, behavior: 'smooth' });
    });

    // About Modal
    el.btnAboutModalClose.addEventListener('click', () => closeModal(el.aboutModalOverlay));

    // Close Modals on Overlay Click
    [
      el.productModalOverlay,
      el.addressModalOverlay,
      el.checkoutModalOverlay,
      el.orderTrackerModalOverlay,
      el.aboutModalOverlay,
      el.loyaltyModalOverlay
    ].forEach(overlay => {
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
          closeModal(overlay);
        }
      });
    });
  }

  // Start Application
  document.addEventListener('DOMContentLoaded', initApp);
})();
