// Sedap POS — scan-to-order food ordering app

const MENU = [
  {
    id: 'cat-signature',
    name: 'Chef Signatures',
    desc: 'Most-loved dishes hand-picked by our chef',
    items: [
      {
        id: 'sig-1', name: 'Sedap Grilled Chicken Rice',
        desc: 'Charcoal-grilled chicken thigh, fragrant pandan rice, house chili sauce',
        price: 9.80, emoji: '🍗', tag: 'BESTSELLER',
        options: [
          { name: 'Spice level', type: 'single', required: true, choices: [
            { id: 'mild', name: 'Mild', delta: 0 },
            { id: 'medium', name: 'Medium', delta: 0 },
            { id: 'hot', name: 'Extra Hot 🌶', delta: 0 }
          ]},
          { name: 'Add-ons', type: 'multi', max: 3, choices: [
            { id: 'egg', name: 'Sunny-side egg', delta: 1.50 },
            { id: 'sambal', name: 'Extra sambal', delta: 0.80 },
            { id: 'achar', name: 'Pickled achar', delta: 1.20 }
          ]}
        ]
      },
      {
        id: 'sig-2', name: 'Crispy Salted Egg Prawns',
        desc: 'Golden battered prawns tossed in creamy salted egg yolk',
        price: 14.50, emoji: '🍤', tag: 'CHEF PICK'
      },
      {
        id: 'sig-3', name: 'Beef Rendang Set',
        desc: 'Slow-cooked beef in coconut and lemongrass curry, served with steamed rice',
        price: 13.20, emoji: '🍛', tag: 'SPICY', tagClass: 'spicy'
      }
    ]
  },
  {
    id: 'cat-mains',
    name: 'Mains',
    items: [
      {
        id: 'main-1', name: 'Nasi Lemak Special',
        desc: 'Coconut rice, fried chicken, anchovies, peanuts, egg, sambal',
        price: 8.90, emoji: '🍱',
        options: [
          { name: 'Protein', type: 'single', required: true, choices: [
            { id: 'chicken', name: 'Fried chicken', delta: 0 },
            { id: 'beef', name: 'Beef rendang', delta: 2.50 },
            { id: 'fish', name: 'Sambal fish', delta: 1.80 }
          ]}
        ]
      },
      {
        id: 'main-2', name: 'Char Kway Teow',
        desc: 'Wok-fried flat noodles, prawns, Chinese sausage, bean sprouts, dark soy',
        price: 9.50, emoji: '🍜'
      },
      {
        id: 'main-3', name: 'Hainanese Chicken Rice',
        desc: 'Poached chicken, ginger-scallion oil rice, chili-garlic dip',
        price: 8.50, emoji: '🍚'
      },
      {
        id: 'main-4', name: 'Laksa Bowl',
        desc: 'Spicy coconut curry noodle soup with prawns, tofu puffs, and quail egg',
        price: 10.80, emoji: '🍲', tag: 'SPICY', tagClass: 'spicy'
      },
      {
        id: 'main-5', name: 'Mee Goreng',
        desc: 'Stir-fried yellow noodles with tofu, potatoes, and a hint of sweetness',
        price: 8.20, emoji: '🍝', tag: 'VEGETARIAN', tagClass: 'veg'
      }
    ]
  },
  {
    id: 'cat-sides',
    name: 'Sides',
    items: [
      { id: 'side-1', name: 'Roti Canai (2pc)', desc: 'Flaky pan-fried flatbread with dhal curry', price: 4.50, emoji: '🫓' },
      { id: 'side-2', name: 'Satay Skewers (6pc)', desc: 'Grilled chicken skewers, peanut sauce, cucumber, onion', price: 7.80, emoji: '🍢' },
      { id: 'side-3', name: 'Crispy Tofu', desc: 'Golden tofu cubes with sweet-spicy chili glaze', price: 5.20, emoji: '🥡', tag: 'VEGETARIAN', tagClass: 'veg' },
      { id: 'side-4', name: 'Kangkung Belacan', desc: 'Stir-fried water spinach in shrimp paste sambal', price: 6.50, emoji: '🥬' }
    ]
  },
  {
    id: 'cat-drinks',
    name: 'Drinks',
    items: [
      {
        id: 'drink-1', name: 'Teh Tarik',
        desc: 'Pulled milk tea, frothy and creamy',
        price: 3.20, emoji: '🥤',
        options: [
          { name: 'Temperature', type: 'single', required: true, choices: [
            { id: 'hot', name: 'Hot', delta: 0 },
            { id: 'iced', name: 'Iced', delta: 0.50 }
          ]},
          { name: 'Sugar', type: 'single', required: true, choices: [
            { id: 's0', name: 'No sugar', delta: 0 },
            { id: 's50', name: 'Less sweet (50%)', delta: 0 },
            { id: 's100', name: 'Normal', delta: 0 }
          ]}
        ]
      },
      { id: 'drink-2', name: 'Fresh Coconut', desc: 'Whole young coconut, chilled', price: 5.80, emoji: '🥥' },
      { id: 'drink-3', name: 'Lime Juice', desc: 'Freshly squeezed calamansi with a hint of honey', price: 3.80, emoji: '🍋' },
      { id: 'drink-4', name: 'Iced Coffee', desc: 'Local kopi-o with condensed milk over ice', price: 3.50, emoji: '🧋' }
    ]
  },
  {
    id: 'cat-desserts',
    name: 'Desserts',
    items: [
      { id: 'des-1', name: 'Cendol', desc: 'Pandan jelly, coconut milk, palm sugar, shaved ice', price: 4.80, emoji: '🍧' },
      { id: 'des-2', name: 'Mango Sticky Rice', desc: 'Sweet sticky rice, fresh mango, coconut cream', price: 6.50, emoji: '🥭' },
      { id: 'des-3', name: 'Kaya Toast Set', desc: 'Toasted bread with coconut jam and butter, soft-boiled eggs', price: 5.20, emoji: '🍞' }
    ]
  }
];

// ---------- State ----------
const state = {
  cart: [], // { uid, item, qty, options, notes }
  activeCat: MENU[0].id,
  modalItem: null,
  modalQty: 1,
  modalOptions: {},
  modalNotes: '',
  spot: new URLSearchParams(location.search).get('spot') || '303'
};

// ---------- Utilities ----------
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);
const fmt = (n) => '$' + n.toFixed(2);
const uid = () => Math.random().toString(36).slice(2, 10);

function calcItemPrice(item, options, qty = 1) {
  let price = item.price;
  if (options) {
    for (const groupName in options) {
      const sel = options[groupName];
      if (Array.isArray(sel)) {
        sel.forEach(c => { price += c.delta || 0; });
      } else if (sel) {
        price += sel.delta || 0;
      }
    }
  }
  return price * qty;
}

function cartTotals() {
  const subtotal = state.cart.reduce((sum, ci) => sum + calcItemPrice(ci.item, ci.options, ci.qty), 0);
  const service = subtotal * 0.10;
  const tax = subtotal * 0.06;
  const total = subtotal + service + tax;
  return { subtotal, service, tax, total };
}

function cartItemCount() {
  return state.cart.reduce((n, ci) => n + ci.qty, 0);
}

// ---------- Render: Categories ----------
function renderCategories() {
  const nav = $('#categories');
  nav.innerHTML = MENU.map(cat =>
    `<button class="cat-chip ${cat.id === state.activeCat ? 'active' : ''}" data-cat="${cat.id}">${cat.name}</button>`
  ).join('');
  nav.querySelectorAll('.cat-chip').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.cat;
      state.activeCat = id;
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      renderCategories();
    });
  });
}

// ---------- Render: Menu ----------
function renderMenu(filter = '') {
  const menu = $('#menu');
  const q = filter.trim().toLowerCase();
  const sections = MENU.map(cat => {
    const items = cat.items.filter(it =>
      !q || it.name.toLowerCase().includes(q) || (it.desc || '').toLowerCase().includes(q)
    );
    if (!items.length) return '';
    return `
      <section class="cat-section" id="${cat.id}">
        <h2>${cat.name}</h2>
        ${cat.desc ? `<p class="cat-desc">${cat.desc}</p>` : ''}
        ${items.map(it => `
          <div class="item-card" data-item="${it.id}">
            <div class="item-text">
              <h3 class="item-name">${it.name}</h3>
              <p class="item-desc">${it.desc || ''}</p>
              <div class="item-price-row">
                <span class="item-price">${fmt(it.price)}</span>
                ${it.tag ? `<span class="item-tag ${it.tagClass || ''}">${it.tag}</span>` : ''}
              </div>
            </div>
            <div class="item-image">
              ${it.emoji}
              <div class="add-pill">+</div>
            </div>
          </div>
        `).join('')}
      </section>
    `;
  }).join('');

  menu.innerHTML = sections || `<div class="empty">No dishes match "${filter}"</div>`;

  menu.querySelectorAll('.item-card').forEach(card => {
    card.addEventListener('click', () => openItemModal(card.dataset.item));
  });
}

function findItem(id) {
  for (const cat of MENU) {
    const it = cat.items.find(x => x.id === id);
    if (it) return it;
  }
  return null;
}

// ---------- Item Modal ----------
function openItemModal(itemId) {
  const item = findItem(itemId);
  if (!item) return;
  state.modalItem = item;
  state.modalQty = 1;
  state.modalOptions = {};
  state.modalNotes = '';

  // Pre-select required single-choice defaults
  (item.options || []).forEach(g => {
    if (g.type === 'single' && g.required) {
      state.modalOptions[g.name] = g.choices[0];
    } else if (g.type === 'multi') {
      state.modalOptions[g.name] = [];
    }
  });

  $('#modalHero').textContent = item.emoji;
  $('#modalName').textContent = item.name;
  $('#modalDesc').textContent = item.desc || '';
  $('#modalPrice').textContent = fmt(item.price);

  const optsEl = $('#modalOptions');
  optsEl.innerHTML = (item.options || []).map(group => `
    <div class="option-group" data-group="${group.name}">
      <div class="option-group-head">
        <span class="option-group-name">${group.name}</span>
        <span class="option-group-meta">${group.required ? 'Required' : group.type === 'multi' ? `Up to ${group.max || group.choices.length}` : 'Optional'}</span>
      </div>
      ${group.choices.map(c => `
        <label class="option-row">
          <input type="${group.type === 'single' ? 'radio' : 'checkbox'}" name="${group.name}" value="${c.id}" />
          <span class="selector ${group.type === 'multi' ? 'square' : ''}"></span>
          <span style="flex:1">${c.name}</span>
          ${c.delta ? `<span class="option-price">+${fmt(c.delta)}</span>` : ''}
        </label>
      `).join('')}
    </div>
  `).join('');

  // Wire option inputs
  optsEl.querySelectorAll('.option-group').forEach(g => {
    const groupName = g.dataset.group;
    const group = item.options.find(x => x.name === groupName);
    g.querySelectorAll('input').forEach(input => {
      // Set pre-selected for required single
      if (group.type === 'single' && group.required && state.modalOptions[groupName]?.id === input.value) {
        input.checked = true;
      }
      input.addEventListener('change', () => {
        if (group.type === 'single') {
          const c = group.choices.find(x => x.id === input.value);
          state.modalOptions[groupName] = c;
        } else {
          const selected = Array.from(g.querySelectorAll('input:checked')).map(i =>
            group.choices.find(x => x.id === i.value)
          );
          if (group.max && selected.length > group.max) {
            input.checked = false;
            return;
          }
          state.modalOptions[groupName] = selected;
        }
        updateModalTotal();
      });
    });
  });

  $('#modalNotes').value = '';
  $('#modalNotes').oninput = (e) => { state.modalNotes = e.target.value; };
  $('#qtyValue').textContent = '1';
  updateModalTotal();
  showModal('itemModal');
}

function updateModalTotal() {
  const total = calcItemPrice(state.modalItem, state.modalOptions, state.modalQty);
  $('#addToCartTotal').textContent = fmt(total);
}

// ---------- Cart ----------
function addToCart() {
  const item = state.modalItem;
  // Validate required options
  for (const group of (item.options || [])) {
    if (group.required && group.type === 'single' && !state.modalOptions[group.name]) {
      alert(`Please choose: ${group.name}`);
      return;
    }
  }
  state.cart.push({
    uid: uid(),
    item,
    qty: state.modalQty,
    options: { ...state.modalOptions },
    notes: state.modalNotes
  });
  closeAllModals();
  renderCartBar();
}

function removeCartItem(uid) {
  state.cart = state.cart.filter(ci => ci.uid !== uid);
  renderCartBar();
  renderCart();
}

function changeCartQty(uid, delta) {
  const ci = state.cart.find(x => x.uid === uid);
  if (!ci) return;
  ci.qty += delta;
  if (ci.qty < 1) { removeCartItem(uid); return; }
  renderCartBar();
  renderCart();
}

function renderCartBar() {
  const count = cartItemCount();
  const bar = $('#cartBar');
  if (count === 0) {
    bar.hidden = true;
    return;
  }
  bar.hidden = false;
  $('#cartCount').textContent = count;
  $('#cartItemsText').textContent = count === 1 ? '1 item' : `${count} items`;
  const { total } = cartTotals();
  $('#cartTotal').textContent = fmt(total);
}

function renderCart() {
  const list = $('#cartList');
  if (state.cart.length === 0) {
    list.innerHTML = `
      <div class="cart-empty">
        <div class="cart-empty-icon">🛒</div>
        <p>Your order is empty</p>
      </div>
    `;
    $('#cartSummary').innerHTML = '';
    $('#checkoutTotal').textContent = fmt(0);
    return;
  }

  list.innerHTML = state.cart.map(ci => {
    const optsText = Object.values(ci.options).flat().filter(Boolean).map(o => o.name).join(' · ');
    return `
      <div class="cart-item" data-uid="${ci.uid}">
        <div class="cart-item-emoji">${ci.item.emoji}</div>
        <div class="cart-item-info">
          <p class="cart-item-name">${ci.item.name}</p>
          ${optsText ? `<div class="cart-item-opts">${optsText}</div>` : ''}
          ${ci.notes ? `<div class="cart-item-opts"><em>"${ci.notes}"</em></div>` : ''}
          <div class="cart-item-bottom">
            <span class="cart-item-price">${fmt(calcItemPrice(ci.item, ci.options, ci.qty))}</span>
            <div class="cart-qty">
              <button data-action="dec">−</button>
              <span>${ci.qty}</span>
              <button data-action="inc">+</button>
            </div>
          </div>
        </div>
      </div>
    `;
  }).join('');

  list.querySelectorAll('.cart-item').forEach(el => {
    const u = el.dataset.uid;
    el.querySelector('[data-action="dec"]').addEventListener('click', () => changeCartQty(u, -1));
    el.querySelector('[data-action="inc"]').addEventListener('click', () => changeCartQty(u, 1));
  });

  const t = cartTotals();
  $('#cartSummary').innerHTML = `
    <div class="summary-row"><span>Subtotal</span><span>${fmt(t.subtotal)}</span></div>
    <div class="summary-row"><span>Service charge (10%)</span><span>${fmt(t.service)}</span></div>
    <div class="summary-row"><span>Tax (6%)</span><span>${fmt(t.tax)}</span></div>
    <div class="summary-row total"><span>Total</span><span>${fmt(t.total)}</span></div>
  `;
  $('#checkoutTotal').textContent = fmt(t.total);
}

// ---------- Modal helpers ----------
function showModal(id) {
  $(`#${id}`).hidden = false;
  document.body.style.overflow = 'hidden';
}

function closeAllModals() {
  $$('.modal').forEach(m => m.hidden = true);
  document.body.style.overflow = '';
}

// ---------- Checkout ----------
function placeOrder() {
  const orderId = '#' + Math.floor(1000 + Math.random() * 9000);
  $('#confirmOrderId').textContent = orderId;
  $('#confirmSpot').textContent = state.spot;
  state.cart = [];
  closeAllModals();
  showModal('confirmModal');
  renderCartBar();
}

// ---------- Wiring ----------
function init() {
  $('#spotNumber').textContent = state.spot;

  renderCategories();
  renderMenu();

  // Search toggle
  $('#searchBtn').addEventListener('click', () => {
    $('#searchWrap').hidden = false;
    $('#searchInput').focus();
  });
  $('#searchClose').addEventListener('click', () => {
    $('#searchWrap').hidden = true;
    $('#searchInput').value = '';
    renderMenu();
  });
  $('#searchInput').addEventListener('input', (e) => renderMenu(e.target.value));

  // Back button — just go home (no-op demo)
  $('#backBtn').addEventListener('click', () => history.back());
  $('#langBtn').addEventListener('click', () => {
    alert('Language switcher — demo only');
  });

  // Modal close handlers
  document.addEventListener('click', (e) => {
    if (e.target.matches('[data-close]')) closeAllModals();
  });

  // Qty stepper in item modal
  $('#qtyMinus').addEventListener('click', () => {
    if (state.modalQty > 1) {
      state.modalQty--;
      $('#qtyValue').textContent = state.modalQty;
      updateModalTotal();
    }
  });
  $('#qtyPlus').addEventListener('click', () => {
    if (state.modalQty < 20) {
      state.modalQty++;
      $('#qtyValue').textContent = state.modalQty;
      updateModalTotal();
    }
  });

  // Add to cart
  $('#addToCartBtn').addEventListener('click', addToCart);

  // Cart bar opens cart
  $('#cartBar').addEventListener('click', () => {
    renderCart();
    showModal('cartModal');
  });

  // Checkout
  $('#checkoutBtn').addEventListener('click', placeOrder);

  // Track scroll → highlight active category
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        state.activeCat = entry.target.id;
        document.querySelectorAll('.cat-chip').forEach(c => {
          c.classList.toggle('active', c.dataset.cat === state.activeCat);
        });
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });

  setTimeout(() => {
    document.querySelectorAll('.cat-section').forEach(s => obs.observe(s));
  }, 50);
}

init();
