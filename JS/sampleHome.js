const carousel = document.querySelector(".carousel"),
firstImg = carousel.querySelectorAll("img")[0],
arrowIcons = document.querySelectorAll(".wrapper i");

let isDragStart = false, isDragging = false, prevPageX, prevScrollLeft, positionDiff, autoScrollInterval;

const showHideIcons = () => {
    let scrollWidth = carousel.scrollWidth - carousel.clientWidth;
    arrowIcons[0].style.display = carousel.scrollLeft == 0 ? "none" : "block";
    arrowIcons[1].style.display = carousel.scrollLeft == scrollWidth ? "none" : "block";
}

const updateProgressIndicator = () => {
    const progressIndicator = document.querySelector(".progress-indicator");
    let scrollWidth = carousel.scrollWidth - carousel.clientWidth;
    let scrollPosition = (carousel.scrollLeft / scrollWidth) * 100;
    progressIndicator.style.width = `${scrollPosition}%`;
}

arrowIcons.forEach(icon => {
    icon.addEventListener("click", () => {
        let firstImgWidth = firstImg.clientWidth + 14;
        carousel.scrollLeft += icon.id == "left" ? -firstImgWidth : firstImgWidth;
        setTimeout(() => showHideIcons(), 60);
    });
});

const autoSlide = () => {
    if (carousel.scrollLeft >= (carousel.scrollWidth - carousel.clientWidth) - 1) {
        carousel.scrollLeft = 0;
    } else {
        let firstImgWidth = firstImg.clientWidth + 14;
        carousel.scrollLeft += firstImgWidth;
    }
    updateProgressIndicator();
    showHideIcons();
}

const startAutoScroll = () => {
    autoScrollInterval = setInterval(autoSlide, 3000);
}

const stopAutoScroll = () => {
    clearInterval(autoScrollInterval);
}

const dragStart = (e) => {
    isDragStart = true;
    prevPageX = e.pageX || e.touches[0].pageX;
    prevScrollLeft = carousel.scrollLeft;
    stopAutoScroll();
}

const dragging = (e) => {
    if (!isDragStart) return;
    e.preventDefault();
    isDragging = true;
    carousel.classList.add("dragging");
    positionDiff = (e.pageX || e.touches[0].pageX) - prevPageX;
    carousel.scrollLeft = prevScrollLeft - positionDiff;
    updateProgressIndicator();
    showHideIcons();
}

const dragStop = () => {
    isDragStart = false;
    carousel.classList.remove("dragging");
    if (!isDragging) return;
    isDragging = false;
    autoSlide();
    startAutoScroll();
}

carousel.addEventListener("mousedown", dragStart);
carousel.addEventListener("touchstart", dragStart);

document.addEventListener("mousemove", dragging);
carousel.addEventListener("touchmove", dragging);

document.addEventListener("mouseup", dragStop);
carousel.addEventListener("touchend", dragStop);

carousel.addEventListener("mouseenter", stopAutoScroll);
carousel.addEventListener("mouseleave", startAutoScroll);

// Initial setup
showHideIcons();
updateProgressIndicator();
startAutoScroll();
