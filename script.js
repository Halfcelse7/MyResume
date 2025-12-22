const modal = document.getElementById("skillModal");
const modalTitle = document.getElementById("modalTitle");
const modalList = document.getElementById("modalList");
const closeBtn = document.querySelector(".close-btn");

document.querySelectorAll(".skill-card").forEach(card => {
    card.addEventListener("click", () => {
        const title = card.dataset.title;
        const items = card.dataset.items;

        if (!title || !items) return;

        modalTitle.textContent = title;
        modalList.innerHTML = "";

        items.split(",").forEach(text => {
            const li = document.createElement("li");
            li.textContent = text.trim();
            modalList.appendChild(li);
        });

        modal.classList.remove("hidden");
    });
});

closeBtn?.addEventListener("click", () => {
    modal.classList.add("hidden");
});

modal?.addEventListener("click", e => {
    if (e.target === modal) modal.classList.add("hidden");
});
card.setAttribute("tabindex", "0");
card.addEventListener("keydown", e => {
    if (e.key === "Enter") card.click();
});
const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add("fade-in");
        }
    });
});

document.querySelectorAll(".experience-card, .project-row, .grid-card").forEach(el => {
    observer.observe(el);
});
