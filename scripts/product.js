const slides = [...document.querySelectorAll('.product-gallery__slide')];
const previousButton = document.querySelector('.product-gallery__nav--prev');
const nextButton = document.querySelector('.product-gallery__nav--next');
const backLink = document.querySelector('.product-gallery__back');
const quantityOutput = document.querySelector('.product-quantity output');
const minusButton = document.querySelector('[data-quantity="minus"]');
const plusButton = document.querySelector('[data-quantity="plus"]');
const cartButton = document.querySelector('.product-details__cart');

let currentSlide = 0;
let quantity = 1;

const source = new URLSearchParams(window.location.search).get('from');
backLink.href = source === 'home'
    ? backLink.dataset.homeTarget
    : backLink.dataset.catalogTarget;

function showSlide(index) {
    currentSlide = Math.max(0, Math.min(index, slides.length - 1));

    slides.forEach((slide, slideIndex) => {
        const isActive = slideIndex === currentSlide;
        slide.classList.toggle('is-active', isActive);
        slide.setAttribute('aria-hidden', String(!isActive));
    });

    previousButton.disabled = currentSlide === 0;
    nextButton.disabled = currentSlide === slides.length - 1;
}

previousButton.addEventListener('click', () => showSlide(currentSlide - 1));
nextButton.addEventListener('click', () => showSlide(currentSlide + 1));

minusButton.addEventListener('click', () => {
    quantity = Math.max(1, quantity - 1);
    quantityOutput.value = String(quantity);
    quantityOutput.textContent = String(quantity);
});

plusButton.addEventListener('click', () => {
    quantity += 1;
    quantityOutput.value = String(quantity);
    quantityOutput.textContent = String(quantity);
});

cartButton.addEventListener('click', () => {
    const originalText = 'ДОБАВИТЬ В КОРЗИНУ';
    cartButton.textContent = `ДОБАВЛЕНО · ${quantity}`;

    window.setTimeout(() => {
        cartButton.textContent = originalText;
    }, 1600);
});

showSlide(0);
