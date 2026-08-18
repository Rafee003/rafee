// Small interactions for the portfolio site
document.getElementById("year").textContent = new Date().getFullYear();

function handleContact(e) {
	e.preventDefault();
	const name = document.getElementById("name").value.trim();
	const email = document.getElementById("email").value.trim();
	const message = document.getElementById("message").value.trim();
	if (!name || !email || !message) {
		alert("Please complete all fields.");
		return false;
	}
	const subject = encodeURIComponent("Quote Request from " + name);
	const body = encodeURIComponent(
		"Name: " + name + "\nEmail: " + email + "\n\nMessage:\n" + message,
	);
	const mailto =
		"mailto:rafeerahman104024@gmail.com?subject=" +
		subject +
		"&body=" +
		body;
	window.location.href = mailto;
	return false;
}

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach((a) => {
	a.addEventListener("click", (e) => {
		const href = a.getAttribute("href");
		if (href.length > 1) {
			e.preventDefault();
			document.querySelector(href).scrollIntoView({ behavior: "smooth" });
		}
	});
});

// Mobile nav toggle
const navToggle = document.querySelector(".nav-toggle");
const nav = document.querySelector(".nav");
if (navToggle && nav) {
	navToggle.addEventListener("click", () => {
		const isOpen = nav.classList.toggle("open");
		navToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
	});
}
