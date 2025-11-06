// Simple Carousel
let slides = document.querySelectorAll(".slide");
let current = 0;

function showSlide(index) {
  slides.forEach((slide, i) => {
    slide.classList.toggle("active", i === index);
  });
}

setInterval(() => {
  current = (current + 1) % slides.length;
  showSlide(current);
}, 5000);

// Simple search simulation
document.getElementById("searchBtn").addEventListener("click", () => {
  const loc = document.getElementById("location").value.trim().toLowerCase();
  const resultBox = document.getElementById("result");

  if (!loc) {
    resultBox.textContent = "Please enter your area.";
    return;
  }

  // Example local database (to be replaced by Firebase later)
  const contacts = {
    ashaiman: { name: "John Doe", phone: "0256613433" },
    tema: { name: "Mary Mensah", phone: "0267894561" },
    accra: { name: "Michael K.", phone: "0241234567" }
  };

  const contact = contacts[loc];
  if (contact) {
    resultBox.innerHTML = `
      <strong>Regional Marketer:</strong> ${contact.name}<br>
      📞 <a href="tel:${contact.phone}" class="call-link">${contact.phone}</a> |
      💬 <a href="https://wa.me/${contact.phone}" target="_blank">WhatsApp Now</a>
    `;
  } else {
    resultBox.textContent = "No regional marketer found for this area.";
  }
});
