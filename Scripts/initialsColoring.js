const colors = [
    "rgb(var(--color1))",
    "rgb(var(--color2))",
    "rgb(var(--color3))",
    "rgb(var(--color4))",
    "rgb(var(--color5))"
];

const initials = document.querySelectorAll('.initials');

initials.forEach(initial => {
    let randomIndex = Math.floor(Math.random() * colors.length)
    let randomColor = colors[randomIndex];

    initial.style.color = randomColor;
});