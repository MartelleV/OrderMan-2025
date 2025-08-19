<template>
    <div class="container py-5">
        <div class="row g-4">
            <!-- Left: CartForm Item List -->
            
                <div class="col-lg-8">
                    <div class="cart-items-section">
                        <div v-for="item in orderItems"
                             :key="item.id"
                             class="cart-item-card">
                            <div class="item-content">
                                <div class="item-info">
                                    <h5 class="item-name">{{ item.name }}</h5>
                                    <div class="item-price">
                                        {{ formatPrice(item.price) }}
                                    </div>
                                </div>
                                <div class="item-controls">
                                    <div class="quantity-section">
                                        <label class="quantity-label">Quantity:</label>
                                        <input type="number"
                                               min="1"
                                               :value="item.quantity"
                                               @input="
											updateQuantity(
												item.id,
												$event.target.value
											)
										"
                                               class="quantity-input" />
                                    </div>
                                    <button class="action-btn danger"
                                            @click="removeItem(item.id)">
                                        Remove
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
          
                <!-- Right: Summary Order Details (includes billing and payment form) -->
                <div class="col-lg-4">
                    <div class="summary-card">
                        <!-- Section 1: Customer Information -->
                        <div class="order-section">
                            <h3 class="section-title">Customer Information</h3>
                            <div class="row g-3">
                                <div class="col-sm-6">
                                    <label for="fullName" class="form-label">Full Name</label>
                                    <input type="text"
                                           class="form-control"
                                           id="fullName"
                                           v-model="fullName"
                                           :class="{ 'is-invalid': errors.fullName }"
                                           required />
                                    <div v-if="errors.fullName" class="invalid-feedback">
                                        {{ errors.fullName }}
                                    </div>
                                </div>
                                <div class="col-12">
                                    <label for="address" class="form-label">Address</label>
                                    <input type="text"
                                           class="form-control"
                                           id="address"
                                           v-model="address"
                                           :class="{ 'is-invalid': errors.address }"
                                           required />
                                    <div v-if="errors.address" class="invalid-feedback">
                                        {{ errors.address }}
                                    </div>
                                </div>
                                <div class="col-12">
                                    <label for="address2" class="form-label">
                                        Address 2 <span class="text-muted">(Optional)</span>
                                    </label>
                                    <input type="text"
                                           class="form-control"
                                           id="address2"
                                           v-model="address2" />
                                </div>
                                <div class="col-md-5">
                                    <label for="country" class="form-label">Country</label>
                                    <select class="form-select"
                                            id="country"
                                            v-model="country"
                                            :class="{ 'is-invalid': errors.country }"
                                            required>
                                        <option value="">Choose...</option>
                                        <option>United States</option>
                                    </select>
                                    <div v-if="errors.country" class="invalid-feedback">
                                        {{ errors.country }}
                                    </div>
                                </div>
                                <div class="col-md-4">
                                    <label for="state" class="form-label">State</label>
                                    <select class="form-select"
                                            id="state"
                                            v-model="state"
                                            :class="{ 'is-invalid': errors.state }"
                                            required>
                                        <option value="">Choose...</option>
                                        <option>California</option>
                                    </select>
                                    <div v-if="errors.state" class="invalid-feedback">
                                        {{ errors.state }}
                                    </div>
                                </div>
                                <div class="col-md-3">
                                    <label for="zip" class="form-label">Zip</label>
                                    <input type="text"
                                           class="form-control"
                                           id="zip"
                                           v-model="zip"
                                           :class="{ 'is-invalid': errors.zip }"
                                           required />
                                    <div v-if="errors.zip" class="invalid-feedback">
                                        {{ errors.zip }}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <hr class="section-divider" />

                        <!-- Section 2: Payment -->
                        <div class="order-section">
                            <h3 class="section-title">Payment</h3>
                            <div class="my-3">
                                <div class="form-check">
                                    <input id="credit"
                                           name="paymentMethod"
                                           type="radio"
                                           class="form-check-input"
                                           value="credit"
                                           v-model="paymentMethod"
                                           checked
                                           required />
                                    <label class="form-check-label" for="credit">Credit card</label>
                                </div>
                                <div class="form-check">
                                    <input id="debit"
                                           name="paymentMethod"
                                           type="radio"
                                           class="form-check-input"
                                           value="debit"
                                           v-model="paymentMethod"
                                           required />
                                    <label class="form-check-label" for="debit">Debit card</label>
                                </div>
                                <div v-if="errors.paymentMethod" class="text-danger small">
                                    {{ errors.paymentMethod }}
                                </div>
                            </div>
                            <div class="row gy-3">
                                <div class="col-md-6">
                                    <label for="cc-name" class="form-label">Name on card</label>
                                    <input type="text"
                                           class="form-control"
                                           id="cc-name"
                                           v-model="cardName"
                                           :class="{ 'is-invalid': errors.cardName }"
                                           required />
                                    <small class="text-muted">Full name as displayed on card</small>
                                    <div v-if="errors.cardName" class="invalid-feedback">
                                        {{ errors.cardName }}
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <label for="cc-number" class="form-label">Card number</label>
                                    <input type="text"
                                           class="form-control"
                                           id="cc-number"
                                           v-model="cardNumber"
                                           :class="{ 'is-invalid': errors.cardNumber }"
                                           required />
                                    <div v-if="errors.cardNumber" class="invalid-feedback">
                                        {{ errors.cardNumber }}
                                    </div>
                                </div>
                                <div class="col-md-3">
                                    <label for="cc-expiration" class="form-label">Expiration</label>
                                    <input type="text"
                                           class="form-control"
                                           id="cc-expiration"
                                           v-model="expiry"
                                           :class="{ 'is-invalid': errors.expiry }"
                                           required />
                                    <div v-if="errors.expiry" class="invalid-feedback">
                                        {{ errors.expiry }}
                                    </div>
                                </div>
                                <div class="col-md-3">
                                    <label for="cc-cvv" class="form-label">CVV</label>
                                    <input type="text"
                                           class="form-control"
                                           id="cc-cvv"
                                           v-model="cvv"
                                           :class="{ 'is-invalid': errors.cvv }"
                                           required />
                                    <div v-if="errors.cvv" class="invalid-feedback">
                                        {{ errors.cvv }}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <hr class="section-divider" />

                        <!-- Section 3: Price Summary -->
                        <div class="order-section">
                            <div class="summary-card">
                                <h4 class="summary-title">Order Summary</h4>
                                <div class="summary-line">
                                    <span class="summary-label">
                                        Subtotal
                                        <small class="item-count">({{ itemCount }} item(s))</small>
                                    </span>
                                    <span class="summary-value">
                                        {{
					formatPrice(totalPrice)
                                        }}
                                    </span>
                                </div>

                                <div class="summary-line">
                                    <span class="summary-label">
                                        Discount
                                        <small v-if="discountRate > 0" class="discount-rate">
                                            ({{ (discountRate * 100).toFixed(1) }}%)
                                        </small>
                                    </span>
                                    <span class="summary-value discount">-{{ formatPrice(discount) }}</span>
                                </div>

                                <div class="summary-line">
                                    <span class="summary-label">VAT (8%)</span>
                                    <span class="summary-value">
                                        {{
					formatPrice(tax)
                                        }}
                                    </span>
                                </div>

                                <hr class="summary-divider" />

                                <div class="summary-line total-line">
                                    <span class="summary-label">Total</span>
                                    <span class="summary-value">
                                        {{
					formatPrice(total)
                                        }}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <hr class="section-divider" />

                        <!-- Section 4: Action Buttons -->
                        <div class="order-section">
                            <div v-if="formError" class="text-danger mb-2">{{ formError }}</div>
                            <div class="d-flex gap-3">
                                <button class="btn btn-primary btn-lg flex-fill" type="submit" @click="submitOrder">
                                    Place Order
                                </button>
                                <button class="btn btn-outline-secondary btn-lg flex-fill" type="button" @click="goToProducts">
                                    Continue Shopping
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';


const router = useRouter();
const orderItems = ref([]);
const discount = ref(0);
const discountRate = ref(0);
const itemCount = computed(() =>
  orderItems.value.reduce((sum, item) => sum + (item.quantity || 1), 0)
);
const userRole = ref(localStorage.getItem('userRole') || '');
const formError = ref('');

const discountByCountKey = 'cart-discount-by-count';
const capByCountKey = 'cart-discount-cap-by-count';

const totalPrice = computed(() =>
  orderItems.value.reduce(
    (total, item) => total + item.price * (item.quantity || 1),
    0
  )
);

const tax = computed(() => totalPrice.value * 0.08);

const total = computed(() =>
  Math.max(0, totalPrice.value - discount.value + tax.value)
);

onMounted(() => {
  const items = JSON.parse(localStorage.getItem('orderItems') || '[]');
   orderItems.value = items;
   
    // Load discount if present
const discountData = JSON.parse(localStorage.getItem('orderDiscount') || '{}');
if (discountData.discount !== undefined && discountData.discountRate !== undefined) {
  discount.value = discountData.discount;
  discountRate.value = discountData.discountRate;
} else {
  updateDiscount(); // Only if not present
}
});


async function fetchOrderItems() {
  try {
    const res = await fetch('http://localhost:3000/api/order', {
      headers: { 'Content-Type': 'application/json' }
    });
    if (res.ok) {
      const data = await res.json();
      orderItems.value = normalizeorderItems(data.items);
      loadDiscountState();
      updateDiscount();
    } else {
      orderItems.value = [];
      resetDiscount();
    }
  } catch (e) {
    orderItems.value = [];
    resetDiscount();
  }
}

function getDiscountCap(count) {
  return count > 10 ? 0.5 : 0.35;
}
function getPityThreshold(count) {
  return count > 10 ? 20 : 9;
}
function getMinDiscountRate() {
  return 0.05;
}
function getMaxDiscountRate() {
  return 0.29;
}

const discountByCount = ref({});
const capByCount = ref({});

function loadDiscountState() {
  const stored = localStorage.getItem(discountByCountKey);
  const capStored = localStorage.getItem(capByCountKey);
  discountByCount.value = stored ? JSON.parse(stored) : {};
  capByCount.value = capStored ? JSON.parse(capStored) : {};
}

function saveDiscountState() {
  localStorage.setItem(
    discountByCountKey,
    JSON.stringify(discountByCount.value)
  );
  localStorage.setItem(capByCountKey, JSON.stringify(capByCount.value));
}

function resetDiscount() {
  discount.value = 0;
  discountRate.value = 0;
  itemCount.value = 0;
  discountByCount.value = {};
  capByCount.value = {};
  saveDiscountState();
}

function rollBetween(a, b) {
  return Math.random() * (b - a) + a;
}

function calculateDiscountGacha(targetCount) {
  let prevRate = null;
  let capReached = false;
  let cap = getDiscountCap(targetCount);
  let pity = getPityThreshold(targetCount);

  for (let count = 1; count <= targetCount; count++) {
    let thisCap = getDiscountCap(count);
    let thisPity = getPityThreshold(count);

    if (discountByCount.value[count] !== undefined) {
      prevRate = discountByCount.value[count];
      if (prevRate === thisCap) capReached = true;
      continue;
    }

    if (capReached) {
      discountByCount.value[count] = thisCap;
      capByCount.value[count] = thisCap;
      prevRate = thisCap;
      continue;
    }

    if (
      (count <= 10 && count === thisPity) ||
      (count > 10 && count === thisPity + 10)
    ) {
      discountByCount.value[count] = thisCap;
      capByCount.value[count] = thisCap;
      prevRate = thisCap;
      capReached = true;
      continue;
    }

    if (count === 1) {
      const rate = rollBetween(getMinDiscountRate(), getMaxDiscountRate());
      discountByCount.value[count] = rate;
      capByCount.value[count] = thisCap;
      prevRate = rate;
      continue;
    }

    const lower = prevRate;
    const upper = thisCap;
    let rate;
    if (lower >= upper) {
      rate = upper;
    } else {
      rate = rollBetween(lower, upper);
    }
    discountByCount.value[count] = rate;
    capByCount.value[count] = thisCap;
    prevRate = rate;
  }
  saveDiscountState();
  return discountByCount.value[targetCount];
}

function updateDiscount() {
  const count = orderItems.value.reduce(
    (sum, item) => sum + (item.quantity || 1),
    0
  );
  itemCount.value = count;
  if (count === 0) {
    resetDiscount();
    return;
  }
  const rate = calculateDiscountGacha(count);
  discountRate.value = rate;
   discount.value = Math.floor(totalPrice.value * rate);

    // Save to localStorage
    localStorage.setItem('orderDiscount', JSON.stringify({
  discount: discount.value,
        discountRate: discountRate.value
    }));
}

function formatPrice(price) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price);
}

function updateQuantity(productId, newQuantity) {
  let items = JSON.parse(localStorage.getItem('orderItems') || '[]');
  const idx = items.findIndex(item => item.id === productId);
  if (idx !== -1) {
    items[idx].quantity = Math.max(1, parseInt(newQuantity, 10) || 1);
    localStorage.setItem('orderItems', JSON.stringify(items));
    orderItems.value = items;
    updateDiscount();
  }
}

function normalizeorderItems(items) {
  return (items || []).map(item => ({
    id: item.id,
    name: item.name,
    price: item.price,
    quantity: typeof item.quantity === 'number' ? item.quantity : 1,
  }));
}

function removeItem(productId) {
  // Remove from localStorage
  let items = JSON.parse(localStorage.getItem('orderItems') || '[]');
  items = items.filter(item => item.id !== productId);
  localStorage.setItem('orderItems', JSON.stringify(items));
  // Update UI
  orderItems.value = items;
  // Update discount and totals
  updateDiscount();
}

const fullName = ref('');
const address = ref('');
const address2 = ref('');
const country = ref('');
const state = ref('');
const zip = ref('');
const paymentMethod = ref('credit');
const cardName = ref('');
const cardNumber = ref('');
const expiry = ref('');
const cvv = ref('');
const errors = ref({});

watch(expiry, (val) => {
  if (!val) return;
  let digits = val.replace(/\D/g, '');
  if (digits.length > 4) digits = digits.slice(0, 4);
  if (digits.length > 2) {
    expiry.value = digits.slice(0, 2) + '/' + digits.slice(2);
  } else {
    expiry.value = digits;
  }
});

function validateFullName(name) {
  const trimmed = name.trim();
  const nameParts = trimmed.split(/\s+/);
  if (nameParts.length < 2) {
    return 'Please enter your full name (first and last).';
  }
  const nameRegex = /^[A-Za-z][A-Za-z'-]*$/;
  for (const part of nameParts) {
    if (!nameRegex.test(part)) {
      return 'Name must contain only letters, hyphens, or apostrophes.';
    }
  }
  return '';
}
function validateZip(val) {
  return /^\d{5}$/.test(val);
}
function validateCardNumber(val) {
  const cleaned = val.replace(/\s+/g, '');
  return /^\d{15,16}$/.test(cleaned);
}
function validateExpiry(val) {
  return /^\d{2}\/\d{2}$/.test(val);
}
function validateCVV(val) {
  return /^\d{3,4}$/.test(val);
}

async function submitOrder() {
  errors.value = {};
  formError.value = '';

  if (orderItems.value.length === 0) {
    alert ('No Items Ordered');
    return;
  }

  if (!fullName.value) {
    errors.value.fullName = 'Full name is required';
  } else {
    const fullNameError = validateFullName(fullName.value);
    if (fullNameError) {
      errors.value.fullName = fullNameError;
    }
}
  
  if (!address.value) {
    errors.value.address = 'Address is required';
  }
  if (!country.value) {
    errors.value.country = 'Country is required';
  }
  if (!state.value) {
    errors.value.state = 'State is required';
  }
  if (!zip.value) {
    errors.value.zip = 'Zip code is required';
  } else if (!validateZip(zip.value)) {
    errors.value.zip = 'Zip code must be exactly 5 digits';
  }
  if (!paymentMethod.value) {
    errors.value.paymentMethod = 'Payment method is required';
  }
  if (!cardName.value) {
    errors.value.cardName = 'Name on card is required';
  }
  if (!cardNumber.value) {
    errors.value.cardNumber = 'Card number is required';
  } else if (!validateCardNumber(cardNumber.value)) {
    errors.value.cardNumber = 'Card number must be 15 or 16 digits';
  }
  if (!expiry.value) {
    errors.value.expiry = 'Expiration is required';
  } else if (!validateExpiry(expiry.value)) {
    errors.value.expiry = 'Expiration must be in MM/YY format';
  }
  if (!cvv.value) {
    errors.value.cvv = 'CVV is required';
  } else if (!validateCVV(cvv.value)) {
    errors.value.cvv = 'CVV must be 3 or 4 digits';
  }
  if (Object.keys(errors.value).length > 0) {
    return;
  }

  let customerId = null;
  try {
    const statusRes = await fetch(
      'http://localhost:3000/api/customers/auth/status',
      { credentials: 'include' }
    );
    const statusData = await statusRes.json();
    customerId = statusData.id;
  } catch (e) {
    formError.value = 'Failed to fetch customer info.';
    return;
  }

  const orderData = {
    customerId,
    items: normalizeorderItems(orderItems.value),
    subtotal: totalPrice.value,
    discount: discount.value,
    vat: tax.value,
    totalAmount: total.value,
    billing: {
      fullName: fullName.value,
      address: address.value,
      address2: address2.value,
      country: country.value,
      state: state.value,
      zip: zip.value,
    },
    payment: {
      method: paymentMethod.value,
      cardName: cardName.value,
      cardNumber: cardNumber.value,
      expiry: expiry.value,
      cvv: cvv.value,
    },
    status: 'pending',
    orderDate: new Date().toISOString(),
  };

    try {
    console.log('Submitting order:', orderData);
    const res = await fetch('http://localhost:3000/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData),
    });
    if (!res.ok) {
      formError.value = 'Order failed';
      return;
    }
    alert('Order submitted!');
    localStorage.removeItem('orderItems');
    router.push({ name: 'Customer' });
  } catch (e) {
    formError.value = 'Failed to submit order. Please try again.';
  }
}

function goToProducts() {
  router.push({ name: 'ProductList' });
}

window.addEventListener('storage', () => {
  userRole.value = localStorage.getItem('userRole');
});
</script>

<style>
.container {
  background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
  border-radius: 18px;
  padding: 3rem 2rem;
  box-shadow: 0 4px 24px #00c48011;
}
.cart-content {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.cart-total {
  background: #fff;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 4px 24px #00c48011;
  border: 2px solid #00c48033;
  margin-top: 2rem;
}
.total-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.total-label {
  color: #00c480;
  font-weight: 700;
  font-size: 1.5rem;
  letter-spacing: 0.5px;
  margin: 0;
}
.total-price {
  color: #00c480;
  font-weight: 700;
  font-size: 2rem;
  letter-spacing: 1px;
  background: linear-gradient(135deg, #d2f4ea 0%, #e8f5e8 100%);
  padding: 1rem 2rem;
  border-radius: 12px;
  border: 2px solid #00c48033;
}

/*Empty*/
.empty-cart {
  text-align: center;
  padding: 3rem 2rem;
}
.empty-cart-content {
  background: #f4f8fb;
  border-radius: 12px;
  padding: 2rem;
  border: 1.5px solid #00c48033;
}
.empty-cart-content p {
  color: #666;
  font-size: 1.1rem;
  font-weight: 500;
  margin: 0;
}
.summary-card {
  background: #fff;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 4px 24px #00c48011;
  border: 2px solid #00c48033;
  height: fit-content;
}
.summary-title {
  color: #00c480;
  font-weight: 700;
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  letter-spacing: 0.5px;
}
.summary-line {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}
.summary-label {
  color: #222;
  font-weight: 500;
  font-size: 1rem;
}
.summary-value {
  color: #222;
  font-weight: 600;
  font-size: 1rem;
}
.item-count,
.discount-rate {
  color: #888;
  font-size: 0.85rem;
}
.summary-value.discount {
  color: #e57373;
}
.summary-divider {
  border: none;
  height: 2px;
  background: linear-gradient(90deg, #00c480 0%, #42b983 100%);
  margin: 1.5rem 0;
}
.total-line .summary-label,
.total-line .summary-value {
  font-size: 1.3rem;
  font-weight: 700;
  color: #00c480;
}
.btn-primary.btn-lg {
  background-color: #00c480 !important;
  border-color: #00c480 !important;
}
.btn-primary.btn-lg:hover {
  background-color: #00ad71 !important;
  border-color: #00ad71 !important;
}
.btn-primary.btn-lg:active {
  background-color: #007e52 !important;
  border-color: #007e52 !important;
}
.btn-outline-secondary.btn-lg {
  border-color: #00c480 !important;
  color: #00c480 !important;
}
.btn-outline-secondary.btn-lg:hover {
  background-color: #00c480 !important;
  color: #fff !important;
}

.cart-total, .cart-items, .cart-item, .item-details, .item-quantity, .quantity-value {
  box-sizing: border-box;
}

.cart-total {
  width: 100%;
  max-width: 100%;
  overflow: hidden;
}

.cart-item {
  width: 100%;
  flex-wrap: wrap;
}



.item-quantity {
  min-width: 0;
  flex-wrap: wrap;
  word-break: break-word;
}

.quantity-value {
  min-width: 40px;
  max-width: 100px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
/*Cart Item List*/
.cart-items-section {
	background: #fff;
	border-radius: 16px;
	padding: 1.5rem;
	box-shadow: 0 2px 16px #00c48011;
}

.cart-item-card {
	background: #f4f8fb;
	border-radius: 12px;
	padding: 1.5rem;
	margin-bottom: 1rem;
	border: 1.5px solid #00c48033;
	transition: box-shadow 0.3s ease;
}

.cart-item-card:hover {
	box-shadow: 0 4px 16px #00c48022;
}

.cart-item-card:last-child {
	margin-bottom: 0;
}

.item-content {
	display: flex;
	justify-content: space-between;
	align-items: center;
	gap: 1rem;
}

.item-info {
	flex: 1;
}

.item-name {
	color: #00c480;
	font-weight: 700;
	font-size: 1.25rem;
	margin: 0 0 0.5rem 0;
	letter-spacing: 0.5px;
}

.item-price {
	color: #666;
	font-size: 1.1rem;
	font-weight: 600;
}

.item-controls {
	display: flex;
	align-items: center;
	gap: 1rem;
}

.quantity-section {
	display: flex;
	align-items: center;
	gap: 0.5rem;
}

.quantity-label {
	color: #222;
	font-weight: 600;
	font-size: 0.9rem;
	letter-spacing: 0.5px;
}

.quantity-input {
	width: 80px;
	padding: 8px 12px;
	border: 1.5px solid #00c48033;
	border-radius: 6px;
	font-size: 1rem;
	font-weight: 600;
	text-align: center;
	background: #ffffff;
	color: #222;
	transition: border-color 0.2s, box-shadow 0.2s;
}

.quantity-input:focus {
	outline: none;
	border-color: #00c480;
	box-shadow: 0 0 0 0.2rem rgba(0, 196, 128, 0.25);
}
.action-btn.danger {
  background: #f8f9fa;
  color: #e57373;
  border: 1.5px solid #e5737333;
  padding: 8px 16px;
  font-size: 0.9rem;
  min-height: 36px;
}
.action-btn.danger:hover {
  background: #e57373;
  color: #fff;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px #e5737333;
}

/*Responsive*/

@media (max-width: 991.98px) {
  .cart-item {
    flex-direction: column;
    align-items: stretch;
    gap: 1rem;
  }
  .item-product {
    flex: none;
  }
  .item-details {
    padding-left: 0;
  }
  .cart-total {
    padding: 1.5rem;
  }
  .summary-card {
    padding: 1.5rem;
  }
}
.summary-card {
  background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
  border-radius: 18px;
  box-shadow: 0 4px 24px #00c48011;
  border: 2px solid #00c48033;
  padding: 2rem;
  margin-top: 0;
}
.order-section {
  margin-bottom: 0;
  padding-bottom: 0;
}
.section-title {
  color: #00c480;
  font-weight: 700;
  font-size: 1.25rem;
  margin-bottom: 1.25rem;
  letter-spacing: 0.5px;
  text-transform: uppercase;
}
.section-divider {
  border: none;
  height: 2px;
  background: linear-gradient(90deg, #00c480 0%, #42b983 100%);
  margin: 1.5rem 0;
}
.summary-line {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}
.summary-label {
  color: #222;
  font-weight: 500;
  font-size: 1rem;
}
.summary-value {
  color: #222;
  font-weight: 600;
  font-size: 1rem;
}
.summary-value.discount {
  color: #e57373;
}
.total-line .summary-label,
.total-line .summary-value {
  font-size: 1.2rem;
  font-weight: 700;
  color: #00c480;
}
.btn-primary.btn-lg {
  background-color: #00c480 !important;
  border-color: #00c480 !important;
  font-weight: 700;
  letter-spacing: 0.5px;
}
.btn-outline-secondary.btn-lg {
  border-color: #00c480 !important;
  color: #00c480 !important;
  font-weight: 700;
  letter-spacing: 0.5px;
}
.btn-outline-secondary.btn-lg:hover {
  background-color: #00c480 !important;
  color: #fff !important;
}

</style>