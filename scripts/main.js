const faqItems = document.querySelectorAll('.faq-item');
const header = document.querySelector('.header');
const headerNav = document.querySelector('.header__nav');
const headerBurger = document.querySelector('.header__burger');
const headerLogoImage = document.querySelector('.header__logo img');
const headerBasketImage = document.querySelector('.header__basket img');
const hero = document.querySelector('.hero');
const discountPopup = document.querySelector('.discount-popup');
const discountPopupClose = document.querySelector('.discount-popup__close');
const discountPopupForm = document.querySelector('.discount-popup__form');
const discountPopupEmail = document.querySelector('.discount-popup__email');
const discountPopupError = document.querySelector('.discount-popup__error');
const discountStorageKey = 'istoraDiscountPopupClosed';

const navigationEntry = performance.getEntriesByType('navigation')[0];

if (navigationEntry?.type === 'reload') {
    history.scrollRestoration = 'manual';

    const resetScrollAfterReload = () => {
        window.requestAnimationFrame(() => {
            window.requestAnimationFrame(() => window.scrollTo(0, 0));
        });
    };

    window.addEventListener('load', resetScrollAfterReload);
    window.addEventListener('pageshow', resetScrollAfterReload);
}

if (window.location.hash) {
    window.addEventListener('load', () => {
        window.requestAnimationFrame(() => {
            history.replaceState(null, '', `${window.location.pathname}${window.location.search}`);
        });
    });
}

if (headerNav && headerBurger) {
    headerBurger.addEventListener('click', () => {
        const isOpen = headerNav.classList.toggle('is-open');

        headerBurger.setAttribute('aria-expanded', String(isOpen));
        headerBurger.setAttribute('aria-label', isOpen ? 'Закрыть меню' : 'Открыть меню');
    });

    headerNav.querySelectorAll('.header__link').forEach((link) => {
        link.addEventListener('click', () => {
            headerNav.classList.remove('is-open');
            headerBurger.setAttribute('aria-expanded', 'false');
            headerBurger.setAttribute('aria-label', 'Открыть меню');
        });
    });
}

if (header && hero && headerLogoImage && headerBasketImage) {
    const headerImages = {
        logoLight: 'images/menu%20logo.svg?v=2',
        logoDark: 'images/menu%20logoblack.png',
        basketLight: 'images/basket.svg',
        basketDark: 'images/basketblack.svg',
    };

    let isCompactHeader = false;
    let isHeaderTicking = false;

    function setHeaderState(shouldBeCompact) {
        if (isCompactHeader === shouldBeCompact) return;

        isCompactHeader = shouldBeCompact;
        header.classList.toggle('is-compact', shouldBeCompact);
        headerLogoImage.src = shouldBeCompact ? headerImages.logoDark : headerImages.logoLight;
        headerBasketImage.src = shouldBeCompact ? headerImages.basketDark : headerImages.basketLight;
    }

    function updateHeaderOnScroll() {
        const canUseCompactHeader = window.matchMedia('(min-width: 601px)').matches;
        const triggerPoint = hero.offsetHeight * 0.48;

        setHeaderState(canUseCompactHeader && window.scrollY >= triggerPoint);
        isHeaderTicking = false;
    }

    function requestHeaderUpdate() {
        if (isHeaderTicking) return;

        isHeaderTicking = true;
        window.requestAnimationFrame(updateHeaderOnScroll);
    }

    window.addEventListener('scroll', requestHeaderUpdate, { passive: true });
    window.addEventListener('resize', requestHeaderUpdate);
    window.addEventListener('load', requestHeaderUpdate);
    requestHeaderUpdate();
}

if (navigationEntry?.type === 'reload') {
    localStorage.removeItem(discountStorageKey);
}

if (discountPopup && localStorage.getItem(discountStorageKey) === 'true') {
    discountPopup.classList.add('is-hidden');
}

if (discountPopup && discountPopupClose) {
    discountPopupClose.addEventListener('click', () => {
        localStorage.setItem(discountStorageKey, 'true');
        discountPopup.classList.add('is-hidden');
    });
}

if (discountPopupForm && discountPopupEmail && discountPopupError) {
    function setEmailError(isVisible) {
        discountPopupEmail.classList.toggle('is-invalid', isVisible);
        discountPopupError.classList.toggle('is-visible', isVisible);
    }

    discountPopupEmail.addEventListener('input', () => {
        discountPopupEmail.value = discountPopupEmail.value.replace(/\s/g, '');

        if (discountPopupEmail.validity.valid) {
            setEmailError(false);
        }
    });

    discountPopupForm.addEventListener('submit', (event) => {
        event.preventDefault();

        if (!discountPopupEmail.validity.valid) {
            setEmailError(true);
            discountPopupEmail.focus();
            return;
        }

        setEmailError(false);
        discountPopup.classList.add('is-hidden');
    });
}

function setFaqState(item, isOpen) {
    const button = item.querySelector('.faq-item__button');
    const answer = item.querySelector('.faq-item__answer');

    item.classList.toggle('is-open', isOpen);
    button.setAttribute('aria-expanded', String(isOpen));
    answer.setAttribute('aria-hidden', String(!isOpen));
}

faqItems.forEach((item) => {
    const button = item.querySelector('.faq-item__button');

    button.addEventListener('click', () => {
        const shouldOpen = !item.classList.contains('is-open');

        faqItems.forEach((faqItem) => setFaqState(faqItem, false));

        if (shouldOpen) {
            setFaqState(item, true);
        }
    });
});
