<template>
    <div class="container py-5">
        <h2 class="page-title text-center mb-5">Pending Payments</h2>
        <div v-if="loading" class="text-center">Loading...</div>
        <div v-else-if="error" class="alert alert-danger">{{ error }}</div>
        <div v-else>
            <div v-if="payments.length === 0" class="text-center">
                <p>No pending payments found.</p>
            </div>
            <div v-else class="payment-list">
                <div v-for="payment in payments" :key="payment.id" class="payment-card">
                    <div class="payment-info">
                        <h5 class="payment-title">Payment #{{ payment.id }}</h5>
                        <p><strong>Amount:</strong> {{ formatCurrency(payment.amount) }}</p>
                        <p><strong>Date:</strong> {{ formatDate(payment.date) }}</p>
                        <p><strong>Status:</strong> <span :class="statusClass(payment.status)">{{ payment.status }}</span></p>
                    </div>
                    <button class="action-btn accept" @click="acceptPayment(payment.id)" :disabled="payment.status !== 'pending'">
                        Accept Payment
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const payments = ref([]);
const loading = ref(true);
const error = ref("");

function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
}

function formatDate(dateString) {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
}

function statusClass(status) {
    if (status === 'pending') return 'status-pending';
    if (status === 'completed') return 'status-completed';
    if (status === 'failed') return 'status-failed';
    return '';
}

async function fetchPayments() {
    loading.value = true;
    error.value = "";

    try {
        const res = await fetch('http://localhost:3000/api/payments?status=pending');
        if (res.ok) {
            payments.value = await res.json();
        } else {
            error.value = "Failed to fetch payments.";
        }
    } catch (e) {
        error.value = "An error occurred while fetching payments.";
    } finally {
        loading.value = false;
    }
}

async function acceptPayment(paymentId) {
    try {
        const res = await fetch(`http://localhost:3000/api/payment/accept/${paymentId}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
        });
        if (res.ok) {
            alert('Payment accepted successfully!');
            await fetchPayments(); // Refresh the list
        } else {
            alert('Failed to accept payment.');
        }
    } catch (e) {
        alert('An error occurred while accepting payment.');
    }
}

onMounted(fetchPayments);
</script>

<style scoped>
.container {
    background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
    border-radius: 18px;
    padding: 3rem 2rem;
    box-shadow: 0 4px 24px #00c48011;
}

.page-title {
    color: #00c480;
    font-weight: 700;
    font-size: 2.5rem;
    letter-spacing: 1px;
    margin-bottom: 0;
}

.payment-list {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
}

.payment-card {
    background: #f4f8fb;
    border-radius: 12px;
    padding: 1.5rem;
    border: 1.5px solid #00c48033;
    box-shadow: 0 2px 16px #00c48011;
    transition: box-shadow 0.3s ease;
}

.payment-card:hover {
    box-shadow: 0 4px 16px #00c48022;
}

.payment-info {
    margin-bottom: 1rem;
}

.payment-title {
    color: #00c480;
    font-weight: 700;
    font-size: 1.25rem;
    margin-bottom: 0.5rem;
}

.status-pending {
    background: #fff3cd;
    color: #856404;
    padding: 4px 12px;
    border-radius: 20px;
    font-weight: 700;
    text-transform: uppercase;
}

.status-completed {
    background: #d4edda;
    color: #155724;
    padding: 4px 12px;
    border-radius: 20px;
    font-weight: 700;
    text-transform: uppercase;
}

.status-failed {
    background: #f8d7da;
    color: #721c24;
    padding: 4px 12px;
    border-radius: 20px;
    font-weight: 700;
    text-transform: uppercase;
}

.action-btn {
    width: 100%;
    font-size: 1.1rem;
    padding: 0.95rem 0;
    border-radius: 8px;
    font-weight: 700;
    letter-spacing: 0.5px;
    margin-top: 0.75rem;
    transition: background 0.18s, color 0.18s, box-shadow 0.18s;
    box-shadow: 0 2px 8px #00c48011;
    border: none;
}

.action-btn.accept {
    background: linear-gradient(90deg, #00c480 60%, #42b983 100%);
    color: #fff;
}

.action-btn.accept:hover:not(:disabled) {
    background: linear-gradient(90deg, #009e6b 60%, #369e6b 100%);
    color: #fff;
    box-shadow: 0 4px 16px #00c48033;
}

.action-btn:disabled {
    filter: grayscale(0.5) brightness(1.2);
    opacity: 0.6;
    cursor: not-allowed !important;
    pointer-events: none;
}
</style>