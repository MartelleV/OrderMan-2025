<template>
  <div class="container py-5">
    <div class="row justify-content-center">
      <div class="col-lg-8 card shadow-sm border-0">
        <div class="card-body text-center">
            <h2 class="mb-4 fw-semibold">Order Details</h2>
          <div v-if="orderId">
            <p>Order ID: <strong>{{ orderId }}</strong></p>
            <div v-if="loading">Loading order details...</div>
            <div v-else-if="error" class="alert alert-danger">{{ error }}</div>
            <div v-else-if="orderDetails">
              <p>Customer ID: <strong>{{ orderDetails.customerName || orderDetails.customerId }}</strong></p>
              <p>Total: <strong>{{ orderDetails.totalAmount }}</strong></p>
              <p>Status: <strong>{{ orderDetails.status }}</strong></p>
            </div>
          </div>
          <div v-else>
            <p>No order selected.</p>
          </div>
          <button class="btn btn-secondary mt-3" @click="goBack">Back</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
const route = useRoute();
const router = useRouter();
const orderId = route.params.orderId;

const orderDetails = ref(null);
const loading = ref(false);
const error = ref('');

async function fetchOrderDetails() {
  if (!orderId) return;
  loading.value = true;
  error.value = '';
  try {
    const res = await fetch(`http://localhost:3000/api/orders/${orderId}`);
    if (res.ok) {
      orderDetails.value = await res.json();
    } else {
      error.value = 'Failed to fetch order details.';
    }
  } catch (e) {
    error.value = 'Error fetching order details.';
  }
  loading.value = false;
}

onMounted(fetchOrderDetails);

function goBack() {
  router.back();
}
</script>

<style scoped>
.card {
  border-radius: 18px;
  background: #fff;
  box-shadow: 0 4px 24px #00c48011;
}
.card-body {
  padding: 2.5rem 2rem;
}
</style>
