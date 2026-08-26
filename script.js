// Small interactions for the portfolio site
document.getElementById("year").textContent = new Date().getFullYear();

// Show selected file name next to the file input
const MAX_ATTACHMENT_BYTES = 10 * 1024 * 1024; // FormSubmit's per-submission attachment limit
const attachmentInput = document.getElementById("attachment");
if (attachmentInput) {
	const fileNameEl = document.createElement("div");
	fileNameEl.className = "file-name";
	fileNameEl.textContent = "No file chosen";
	attachmentInput.parentNode.appendChild(fileNameEl);
	attachmentInput.addEventListener("change", function () {
		const file = this.files[0];
		if (file && file.size > MAX_ATTACHMENT_BYTES) {
			this.value = "";
			fileNameEl.textContent = "No file chosen";
			alert(`"${file.name}" is larger than 10MB and can't be attached.`);
			confirm("Send the message without the attachment instead?");
			return;
		}
		fileNameEl.textContent = file ? file.name : "No file chosen";
	});
}

function handleContact(e) {
	e.preventDefault();
	const form = document.getElementById("contactForm");
	const statusEl = document.getElementById("formStatus");
	const name = document.getElementById("name").value.trim();
	const email = document.getElementById("email").value.trim();
	const message = document.getElementById("message").value.trim();

	if (!name || !email || !message) {
		statusEl.textContent = "Please complete all fields.";
		statusEl.className = "form-status error";
		statusEl.style.display = "flex";
		return false;
	}

	// Basic email format validation
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	if (!emailRegex.test(email)) {
		statusEl.textContent = "Please enter a valid email address.";
		statusEl.className = "form-status error";
		statusEl.style.display = "flex";
		return false;
	}

	const attachedFile = attachmentInput && attachmentInput.files[0];
	if (attachedFile && attachedFile.size > MAX_ATTACHMENT_BYTES) {
		statusEl.textContent =
			"Attachment is too large. Please keep it under 10MB.";
		statusEl.className = "form-status error";
		statusEl.style.display = "flex";
		return false;
	}

	const submitBtn = form.querySelector('button[type="submit"]');
	const originalText = submitBtn.textContent;
	submitBtn.disabled = true;
	submitBtn.textContent = "Sending…";
	statusEl.textContent = "Sending your message…";
	statusEl.className = "form-status loading";
	statusEl.style.display = "flex";

	const formData = new FormData(form);

	fetch(form.action, {
		method: "POST",
		headers: { Accept: "application/json" },
		body: formData,
	})
		.then(function (response) {
			submitBtn.disabled = false;
			submitBtn.textContent = originalText;

			if (response.ok) {
				statusEl.textContent =
					"Message sent successfully! I'll be in touch soon.";
				statusEl.className = "form-status success";
				form.reset();
				if (attachmentInput) {
					const nameEl =
						attachmentInput.parentNode.querySelector(".file-name");
					if (nameEl) nameEl.textContent = "No file chosen";
				}
			} else {
				statusEl.textContent =
					"Something went wrong. Please try again.";
				statusEl.className = "form-status error";
			}
		})
		.catch(function (error) {
			submitBtn.disabled = false;
			submitBtn.textContent = originalText;
			statusEl.textContent =
				"Unable to send message. Please try again later.";
			statusEl.className = "form-status error";
		});

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

/* =====================
   Gallery (GLightbox)
   ===================== */
// Source images live in images/gallery/. Captions are derived from filenames,
// with non-descriptive "WhatsApp Image" shots falling back to a generic label.
const galleryFiles = [
	"Skimming.jpeg",
	// Patching
	"Round Patching.jpeg",
	"Patching 5.jpeg",
	"Patching 6.jpeg",
	"Patching Preparation- Grinding.jpeg",
	"Patching 3.jpeg",
	"Patching.jpeg",
	"Patching 2.jpeg",
	"Patching Preparation-Grinding (Before Patching).jpeg",
	"Patching Preparation- Grinding 2(Before Patching).jpeg",
	"Patching Preparation- (After Patching).jpeg",
	"Patching Preparation.jpeg",
	"Before Patching.jpeg",
	"After Patching.jpeg",
	"Patching Preparation - Grinding (Before).jpeg",
	"Patching Preparation - Grinding (After).jpeg",
	"Patching Preparation - Grinding (Before) 2.jpeg",
	"Patching Preparation - Grinding (After) 2.jpeg",

	// Grinding
	"Before Floor Grinding.jpeg",
	"After Floor Grinding.jpeg",
	"Floor Grinding.jpeg",
	"Floor Grinding 2.jpeg",
	"Before Grinding.jpeg",
	"After Grinding.jpeg",

	// Demolition / Jackhammering
	"Chipping.jpeg",
	"Level Alteration - Jackhammering.jpeg",
	"Level Alteration (Cutting & Jckhammering).jpeg",
	"Alteration of Extended Portion (Cutting-Jackhammering-Grinding).jpeg",
	"Plumbing Relocation (Cutting and Jackhammering).jpeg",
	"Pan Clearing (Jackhammering).jpeg",
];

function galleryCaption(file) {
	const stem = file.replace(/\.[^.]+$/, "");
	if (/^WhatsApp Image/i.test(stem)) return "Project photo";
	return stem.charAt(0).toUpperCase() + stem.slice(1);
}

function galleryUrl(file) {
	return "images/gallery/" + encodeURIComponent(file);
}

function buildGallery() {
	const grid = document.getElementById("galleryGrid");
	if (!grid) return;

	grid.innerHTML = "";
	galleryFiles.forEach((file, i) => {
		const caption = galleryCaption(file);
		const path = galleryUrl(file);

		const link = document.createElement("a");
		link.href = path;
		link.target = "_blank";
		link.rel = "noopener";
		link.className = "gallery-item-link";

		// The <img> is the GLightbox trigger: v3 reads the slide caption from
		// img.alt and the gallery group from data-gallery. Anchor title is
		// intentionally avoided to suppress a redundant native tooltip.
		const img = document.createElement("img");
		img.className = "glightbox";
		img.dataset.gallery = "gallery";
		img.src = path;
		img.alt = caption;
		img.loading = "lazy";
		img.fetchPriority = i < 4 ? "high" : "low";
		link.appendChild(img);

		const figure = document.createElement("figure");
		figure.className = "gallery-item";
		figure.appendChild(link);

		const figcap = document.createElement("figcaption");
		figcap.className = "gallery-caption";
		figcap.textContent = caption;
		figure.appendChild(figcap);

		grid.appendChild(figure);
	});

	if (typeof GLightbox !== "undefined") {
		// Click-to-zoom (zoomable) and slider navigation between gallery images
		// are enabled by default in GLightbox v3; the caption is sourced from
		// <img alt> and rendered in .gslide-title beneath the image.
		GLightbox({
			selector: ".glightbox",
			touch: true,
			loop: true,
		});
	}
}

buildGallery();
