const slides = document.querySelectorAll(".slide");
const counter = document.getElementById("counter");
let current = 0;

function show(index) {
  current = Math.max(0, Math.min(index, slides.length - 1));
  slides.forEach((s, i) => s.classList.toggle("active", i === current));
  counter.textContent = `${current + 1} / ${slides.length}`;
  location.hash = slides[current].id;
}

document.getElementById("prev").addEventListener("click", () => show(current - 1));
document.getElementById("next").addEventListener("click", () => show(current + 1));

document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowRight" || e.key === " ") show(current + 1);
  if (e.key === "ArrowLeft") show(current - 1);
});

const startIndex = [...slides].findIndex((s) => s.id === location.hash.slice(1));
show(startIndex >= 0 ? startIndex : 0);
