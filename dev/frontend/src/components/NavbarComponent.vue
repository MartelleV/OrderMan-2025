<template>
	<nav class="navbar navbar-expand-lg border bg-body-tertiary">
		<div class="container-fluid">
			<router-link to="/" class="navbar-brand d-flex align-items-center">
				<img
					src="/favicon.ico"
					alt="Logo"
					width="30"
					height="24"
					class="d-inline-block align-text-top"
				/>
			</router-link>
			<button
				class="navbar-toggler"
				type="button"
				data-bs-toggle="collapse"
				data-bs-target="#navbarSupportedContent"
				aria-controls="navbarSupportedContent"
				aria-expanded="false"
				aria-label="Toggle navigation"
			>
				<span class="navbar-toggler-icon"></span>
			</button>
			<div class="collapse navbar-collapse" id="navbarSupportedContent">
				<ul class="navbar-nav me-auto mb-2 mb-lg-0 nav-underline">
					<li class="nav-item">
						<router-link
							to="/"
							class="nav-link"
							active-class="active"
							exact-active-class="active"
							exact
						>
							Products
						</router-link>
					</li>
					<!-- Hide Cart for accountant -->
					<li class="nav-item" v-if="userRole !== 'accountant'">
						<router-link
							to="/order2"
							class="nav-link"
							active-class="active"
							exact-active-class="active"
						>
							Order
						</router-link>
					</li>
					<!-- Hide Login if userRole is set -->
					<li class="nav-item" v-if="!userRole">
						<router-link
							to="/auth"
							class="nav-link"
							active-class="active"
							exact-active-class="active"
						>
							Login
						</router-link>
					</li>
					<li class="nav-item" v-if="userRole === 'customer'">
						<router-link
							to="/customer"
							class="nav-link"
							active-class="active"
							exact-active-class="active"
						>
							Customer
						</router-link>
					</li>
					<li class="nav-item" v-if="userRole === 'accountant'">
						<router-link
							to="/accountant"
							class="nav-link"
							active-class="active"
							exact-active-class="active"
						>
							Accountant
						</router-link>
					</li>
				</ul>
			</div>
		</div>
	</nav>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const userRole = ref(localStorage.getItem('userRole') || '');

function updateRole() {
	userRole.value = localStorage.getItem('userRole') || '';
}

onMounted(() => {
	window.addEventListener('storage', updateRole);
});
onUnmounted(() => {
	window.removeEventListener('storage', updateRole);
});
</script>

<style>
.navbar {
	background: linear-gradient(90deg, #f8fafc 0%, #e0f7fa 100%);
	box-shadow: 0 2px 8px rgba(0, 0, 0, 0.07);
	padding: 0.5rem 1.5rem;
}
.navbar-brand {
	font-weight: bold;
	font-size: 1.3rem;
	color: #00c480 !important;
	letter-spacing: 1px;
}
.navbar-toggler {
	border: none;
	background: #e0f7fa;
	border-radius: 8px;
	transition: background 0.2s;
}
.navbar-toggler:focus {
	outline: none;
	box-shadow: 0 0 0 2px #00c48033;
}
.navbar-nav .nav-link {
	color: #333;
	font-weight: 500;
	margin: 0 0.5rem;
	border-radius: 6px;
	padding: 0.5rem 1rem;
	transition: background 0.2s, color 0.2s;
}
.navbar-nav .nav-link.active {
	color: #fff !important;
	background: #00c480;
	box-shadow: 0 2px 8px #00c48022;
}
.navbar-nav .nav-link:hover {
	color: #00c480 !important;
	background: #e0f7fa;
}
@media (max-width: 991.98px) {
	.navbar {
		border-radius: 0;
		padding: 0.5rem 1rem;
	}
	.navbar-nav .nav-link {
		margin: 0.25rem 0;
		padding: 0.5rem 1rem;
	}
}
</style>
