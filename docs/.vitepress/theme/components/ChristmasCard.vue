<!--
  Copyright (c) 2024 taskylizard

  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at

  http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.
-->
<script setup lang="ts">
import { ref } from 'vue'

const clickIcon = ref<HTMLSpanElement>()
const card = ref<HTMLDivElement>()

const handleClick = () => {
  card.value?.classList.toggle('is-opened')
  clickIcon.value?.classList.toggle('is-hidden')
}
</script>

<template>
	<div class="h-xl" />
	<div class="card" ref="card" :onClick="handleClick">
		<div class="card-page cart-page-front">
			<div class="card-page cart-page-outside"></div>
			<div class="card-page cart-page-inside"></div>
		</div>
		<div class="card-page cart-page-bottom">
			<p class="card-text">Merry Christmas from the Wotaku team!</p>
		</div>
	</div>
	<span class="click-icon" ref="clickIcon">
		<svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
			<path fill="#fff"
				d="M31.6 17.7V26c0 1.9-.7 3.7-2 5.1v.9c0 1.6-1.3 3-3 3h-8.4c-1.6 0-3-1.3-3-3 0-.6.5-1 1-1s1 .4 1 1c0 .5.4 1 1 1h8.4c.5 0 1-.4 1-1v-1.2-.3-.1c0-.1.1-.2.2-.3 1.1-1.1 1.7-2.5 1.7-4v-8.3c0-.3-.1-.5-.3-.7-.1-.1-.5-.4-1-.3-.4.1-.8.6-.8 1.1v2.4c0 .6-.5 1-1 1s-1-.4-1-1v-5.5c0-.3-.1-.5-.3-.7s-.4-.3-.7-.3c-.5 0-1 .5-1 1v5.5c0 .6-.5 1-1 1s-1-.4-1-1v-8.5c0-.3-.1-.5-.3-.7s-.4-.3-.7-.3c-.5 0-1 .5-1 1v8.5c0 .6-.5 1-1 1s-1-.4-1-1V7.7c0-.3-.1-.5-.3-.7-.1-.1-.5-.4-1-.3-.4.1-.8.6-.8 1.1V20c0 .4-.2.8-.6.9-.4.2-.8.1-1.1-.2L11 18.1c-.6-.6-1.6-.6-2.2.1-.5.6-.4 1.5.2 2.1l7 7c.4.4.4 1 0 1.4-.2.2-.5.3-.7.3-.3 0-.5-.1-.7-.3l-7-7.1c-1.3-1.3-1.5-3.5-.3-4.8C8 16 9 15.5 10 15.5c.9 0 1.8.4 2.5 1l.9.9V7.9c0-1.4.9-2.7 2.3-3 1-.3 2.1 0 2.8.8.6.6.9 1.3.9 2.1V9c.3-.1.7-.2 1-.2.8 0 1.5.3 2.1.9s.9 1.3.9 2.1v.2c.3-.1.7-.2 1-.2.8 0 1.5.3 2.1.9s.9 1.3.9 2.1v.2c.1 0 .2-.1.3-.1 1-.3 2.1 0 2.8.8.8.5 1.1 1.3 1.1 2z" />
		</svg>
	</span>
</template>

<style scoped>
.card {
	perspective: 1500px;
	position: absolute;
	left: calc(50% - 175px);
	top: calc(50% - 250px);
	transition-property: transform;
	transition-duration: 1s;
	transition-timing-function: cubic-bezier(0.68, -0.55, 0.265, 1.55);
	transition-delay: initial;
	transform: rotate(-10deg) translate(0, 0);
	-webkit-animation: cardIn 1s alternate cubic-bezier(0.87, -0.41, 0.19, 1.44);
	animation: cardIn 1s alternate cubic-bezier(0.87, -0.41, 0.19, 1.44);
}

@media (max-width: 767px) {
	.card {
		left: calc(50% - 115px);
		top: calc(50% - 164.5px);
	}
}

@media (max-width: 479px) {
	.card {
		left: calc(50% - 75px);
		top: calc(50% - 107px);
	}
}

.card:before {
	content: "";
	display: block;
	position: absolute;
	left: 0;
	top: 0;
	width: 100%;
	height: 100%;
	box-shadow: 0 0 50px #000;
	transition: all 0.5s ease-in-out;
}

.card.is-opened {
	transform: rotate(0deg) translate(175px, 0);
}

@media (max-width: 767px) {
	.card.is-opened {
		transform: rotate(0deg) translate(115px, 0);
	}
}

@media (max-width: 479px) {
	.card.is-opened {
		transform: rotate(0deg) translate(75px, 0);
	}
}

.card.is-opened .cart-page-front {
	transform: rotateY(-180deg);
}

@-webkit-keyframes cardIn {
	0% {
		opacity: 0;
		transform: rotate(-10deg) translate(0, -100%);
	}

	25% {
		opacity: 1;
	}

	100% {
		opacity: 1;
		transform: rotate(-10deg) translate(0, 0);
	}
}

@keyframes cardIn {
	0% {
		opacity: 0;
		transform: rotate(-10deg) translate(0, -100%);
	}

	25% {
		opacity: 1;
	}

	100% {
		opacity: 1;
		transform: rotate(-10deg) translate(0, 0);
	}
}

.card,
.card-page {
	width: 350px;
	height: 500px;
}

@media (max-width: 767px) {

	.card,
	.card-page {
		width: 230px;
		height: 329px;
	}
}

@media (max-width: 479px) {

	.card,
	.card-page {
		width: 150px;
		height: 214px;
	}
}

.card-page {
	transition: transform 1s ease-in-out;
	cursor: pointer;
	position: absolute;
	outline: 1px solid transparent;
}

.cart-page-front {
	transform-origin: 0 50% 0;
	transform-style: preserve-3d;
	transform: rotateY(-20deg);
	z-index: 2;
}

.cart-page-outside,
.cart-page-inside {
	position: absolute;
	-webkit-backface-visibility: hidden;
	backface-visibility: hidden;
}

.cart-page-outside {
	border: 10px solid #fbfbfb;
	background: #c72320 url("/christmas/front.png") no-repeat center;
	background-size: cover;
	width: 100%;
	height: 100%;
}

@media (max-width: 767px) {
	.cart-page-outside {
		border: 5px solid #fbfbfb;
	}
}

.cart-page-inside {
	background: #c72320 url("/christmas/out.jpg") no-repeat center;
	background-size: cover;
	width: 100%;
	height: 100%;
}

.cart-page-bottom {
	background-color: #d4d1d0;
	background-image: url("/christmas/pattern.png");
	border: 20px solid #d4d1d0;
	display: -webkit-box;
	display: -moz-box;
	display: box;
	display: -moz-flex;
	display: flex;
	box-pack: center;
	-moz-justify-content: center;
	-ms-justify-content: center;
	-o-justify-content: center;
	justify-content: center;
	-ms-flex-pack: center;
	box-align: center;
	-moz-align-items: center;
	-ms-align-items: center;
	-o-align-items: center;
	align-items: center;
	-ms-flex-align: center;
	text-align: center;
}

@media (max-width: 767px) {
	.cart-page-bottom {
		border: 10px solid #d4d1d0;
	}
}

.cart-page-bottom {
	z-index: 1;
	border-left: none !important;
	background-position: -22px 80px;
}

@media (max-width: 767px) {
	.cart-page-bottom {
		background-position: 85px 30px;
	}
}

@media (max-width: 479px) {
	.cart-page-bottom {
		background-position: 0px 30px;
	}
}

.click-icon {
	position: absolute;
	left: 50%;
	transform: translate(-50%, 0);
	bottom: 20px;
	-webkit-animation: iconAnimation 1s infinite alternate ease-in-out;
	animation: iconAnimation 1s infinite alternate ease-in-out;
	transition: opacity 0.5s ease-in-out;
	opacity: 1;
}

.click-icon svg {
	width: 96px;
	height: 96px;
}

@media (max-width: 767px) {
	.click-icon svg {
		width: 72px;
		height: 72px;
	}
}

@media (max-width: 479px) {
	.click-icon svg {
		width: 48px;
		height: 48px;
	}
}

.click-icon.is-hidden {
	opacity: 0;
}

@-webkit-keyframes iconAnimation {
	0% {
		transform: translate(-50%, 0);
	}

	100% {
		transform: translate(-50%, 10px);
	}
}

@keyframes iconAnimation {
	0% {
		transform: translate(-50%, 0);
	}

	100% {
		transform: translate(-50%, 10px);
	}
}

.card-text {
	color: #3c3c43;
	font-size: 36px;
	line-height: 1.2em;
	padding-left: 10px;
}

@media (max-width: 767px) {
	.card-text {
		font-size: 24px;
	}
}

@media (max-width: 479px) {
	.card-text {
		font-size: 20px;
	}
}
</style>
