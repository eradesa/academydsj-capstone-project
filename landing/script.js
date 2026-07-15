document.querySelectorAll(".faq-question").forEach((btn) => {
  btn.addEventListener("click", () => {
    const answer = btn.nextElementSibling;
    const isOpen = answer.classList.contains("open");

    document.querySelectorAll(".faq-answer").forEach((a) => a.classList.remove("open"));

    if (!isOpen) answer.classList.add("open");
  });
});
