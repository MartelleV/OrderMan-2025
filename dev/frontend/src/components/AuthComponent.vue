<template>
	<div class="container py-5">
		<div class="row justify-content-center">
			<div class="col-md-6 card shadow-sm border-0">
				<div class="card-body">
					<h2 class="py-4 text-center fw-semibold">
						{{ isSignup ? 'Sign Up' : 'Login' }}
					</h2>
					<form @submit.prevent="handleSubmit" novalidate>
						<div class="mb-3">
							<label for="role" class="form-label fw-bold"
								>Role</label
							>
							<select
								id="role"
								class="form-select custom-input"
								v-model="role"
								required
								:class="{ 'is-invalid': errors.role }"
							>
								<option value="">Select role</option>
								<option value="customer">Customer</option>
								<option value="accountant">Accountant</option>
							</select>
							<div v-if="errors.role" class="invalid-feedback">
								{{ errors.role }}
							</div>
						</div>
						<div class="mb-3">
							<label for="username" class="form-label fw-bold"
								>Username</label
							>
							<input
								type="text"
								class="form-control custom-input"
								id="username"
								v-model="username"
								:class="{ 'is-invalid': errors.username }"
								required
							/>
							<div
								v-if="errors.username"
								class="invalid-feedback"
							>
								{{ errors.username }}
							</div>
						</div>
						<div class="mb-3">
							<label for="password" class="form-label fw-bold"
								>Password</label
							>
							<input
								type="password"
								class="form-control custom-input"
								id="password"
								v-model="password"
								:class="{ 'is-invalid': errors.password }"
								required
							/>
							<div
								v-if="errors.password"
								class="invalid-feedback"
							>
								{{ errors.password }}
							</div>
						</div>
						<div class="mb-3">
							<label for="email" class="form-label fw-bold"
								>Email</label
							>
							<input
								type="email"
								class="form-control custom-input"
								id="email"
								v-model="email"
								:class="{ 'is-invalid': errors.email }"
								required
							/>
							<div v-if="errors.email" class="invalid-feedback">
								{{ errors.email }}
							</div>
						</div>
						<button
							type="submit"
							class="action-btn accept w-100 mb-3"
						>
							{{ isSignup ? 'Sign Up' : 'Login' }}
						</button>
					</form>
					<div class="text-center">
						<small>
							<a
								href="#"
								@click.prevent="toggleMode"
								class="toggle-link"
							>
								{{
									isSignup
										? 'Already have an account? Login'
										: "Don't have an account? Sign Up"
								}}
							</a>
						</small>
					</div>
					<div v-if="message" class="alert custom-alert mt-3 alert">
						{{ message }}
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { auth, db } from '@/firebase.js';
import {
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
	signOut,
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';

const router = useRouter();

const isSignup = ref(false);
const username = ref('');
const password = ref('');
const email = ref('');
const role = ref('');
const errors = ref({});
const message = ref('');

function toggleMode() {
	isSignup.value = !isSignup.value;
	username.value = '';
	password.value = '';
	email.value = '';
	role.value = '';
	errors.value = {};
	message.value = '';
}

function validateEmail(val) {
	return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
}

async function handleSubmit() {
	errors.value = {};
	message.value = '';

	if (!username.value) errors.value.username = 'Username is required!';
	if (!password.value) errors.value.password = 'Password is required!';
	if (isSignup.value) {
		if (!role.value) errors.value.role = 'Please select your role!';
		if (!email.value) {
			errors.value.email = 'Email is required!';
		} else if (!validateEmail(email.value)) {
			errors.value.email = 'Invalid email format.';
		}
	}
	if (Object.keys(errors.value).length > 0) return;

	try {
		let res, data;
		if (isSignup.value) {
			if (role.value === 'customer') {
				res = await fetch(
					'http://localhost:3000/api/customers/auth/signup',
					{
						method: 'POST',
						headers: { 'Content-Type': 'application/json' },
						body: JSON.stringify({
							email: email.value,
							password: password.value,
							role: role.value,
							username: username.value,
						}),
					}
				);
			} else if (role.value === 'accountant') {
				res = await fetch(
					'http://localhost:3000/api/accountant/auth/signup',
					{
						method: 'POST',
						headers: { 'Content-Type': 'application/json' },
						body: JSON.stringify({
							email: email.value,
							password: password.value,
							role: role.value,
							username: username.value,
						}),
					}
				);
			}
			data = await res.json();
			if (res.ok && data.role) {
				localStorage.setItem('userRole', data.role);
				window.dispatchEvent(new Event('storage'));
				router.push({
					name:
						data.role === 'accountant'
							? 'Accountant'
							: 'ProductList',
				});
				return;
			} else {
				message.value = data.error || 'Sign up failed.';
			}
		} else {
			// Login
			if (role.value === 'accountant') {
				res = await fetch(
					'http://localhost:3000/api/accountant/auth/signin',
					{
						method: 'POST',
						headers: { 'Content-Type': 'application/json' },
						body: JSON.stringify({
							email: email.value,
							password: password.value,
							role: 'accountant',
							username: username.value,
						}),
					}
				);
			} else {
				res = await fetch(
					'http://localhost:3000/api/customers/auth/signin',
					{
						method: 'POST',
						headers: { 'Content-Type': 'application/json' },
						body: JSON.stringify({
							email: email.value,
							password: password.value,
							role: 'customer',
							username: username.value,
						}),
					}
				);
			}
			data = await res.json();
			if (res.ok && data.role) {
				localStorage.setItem('userRole', data.role);
				window.dispatchEvent(new Event('storage'));
				router.push({
					name:
						data.role === 'accountant'
							? 'Accountant'
							: 'ProductList',
				});
				return;
			} else {
				message.value = data.error || 'Login failed.';
			}
		}
	} catch (e) {
		message.value = 'An error occurred. Please try again.';
	}
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

h2 {
	color: #00c480;
	font-weight: 700;
	letter-spacing: 1px;
}

.form-label {
	color: #222;
	margin-bottom: 8px;
}

.custom-input {
	border: 1.5px solid #00c48033;
	border-radius: 8px;
	padding: 12px 16px;
	font-size: 1rem;
	transition: border-color 0.2s, box-shadow 0.2s;
	background: #f4f8fb;
}

.custom-input:focus {
	border-color: #00c480;
	box-shadow: 0 0 0 0.2rem rgba(0, 196, 128, 0.25);
	background: #fff;
}

.action-btn {
	font-size: 1rem;
	padding: 12px 24px;
	border-radius: 8px;
	font-weight: 600;
	border: none;
	outline: none;
	transition: background 0.18s, color 0.18s, box-shadow 0.18s;
	box-shadow: 0 2px 8px #00c48022;
	letter-spacing: 0.5px;
	min-height: 48px;
	display: inline-flex;
	align-items: center;
	justify-content: center;
}

.action-btn.accept {
	background: linear-gradient(90deg, #00c480 60%, #42b983 100%);
	color: #fff;
	border: none;
}

.action-btn.accept:hover {
	background: #00b06b;
	color: #fff;
	transform: translateY(-1px);
	box-shadow: 0 4px 12px #00c48033;
}

.toggle-link {
	color: #00c480;
	text-decoration: none;
	font-weight: 600;
	transition: color 0.2s;
}

.toggle-link:hover {
	color: #00b06b;
	text-decoration: underline;
}

.custom-alert {
	background: #d2f4ea;
	color: #007a5a;
	border: 1.5px solid #00c48033;
	border-radius: 8px;
	padding: 12px 16px;
	margin: 0;
}

.invalid-feedback {
	color: #e57373;
	font-weight: 600;
}

.is-invalid {
	border-color: #e57373 !important;
	background: #fff0f0 !important;
}

.is-invalid:focus {
	box-shadow: 0 0 0 0.2rem rgba(229, 115, 115, 0.25) !important;
}

.alert {
	color: #fff;
	background-color: #dc3545;
}

@media (max-width: 767.98px) {
	.card-body {
		padding: 1.5rem 1rem;
	}
}
</style>
