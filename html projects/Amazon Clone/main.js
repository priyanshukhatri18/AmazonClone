const imgs = document.querySelectorAll('.header-slider ul img');
const prev_btn = document.querySelector('.control_Prev');
const next_btn = document.querySelector('.control_Next');

let currentIndex = 0;
function showImage() {
    for (let i = 0; i < imgs.length; i++) {
        imgs[i].style.display = 'none';
    }
    imgs[currentIndex].style.display = 'block';

}
showImage();

prev_btn.addEventListener('click', (e) => {
    if (currentIndex > 0) {
        currentIndex--;
    }
    else {
        currentIndex = imgs.length - 1;
    }
    showImage();
})

next_btn.addEventListener('click', (e) => {
    if (currentIndex < imgs.length - 1) {
        currentIndex++;
    }
    else {
        currentIndex =  0;
    }
    showImage();
})

const scrollContainer = document.querySelectorAll('.products');
for(const item of scrollContainer) {
    item.addEventListener('wheel', (e) => {
        e.preventDefault();
        item.scrollLeft += e.deltaY;
    });
}