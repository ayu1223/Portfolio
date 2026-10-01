/* =========================================================
   MOBILE NAVIGATION
========================================================= */

const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");
const navItems = document.querySelectorAll(".nav-link");

menuToggle.addEventListener("click", () => {
    navLinks.classList.toggle("show");

    const icon = menuToggle.querySelector("i");

    if (navLinks.classList.contains("show")) {
        icon.classList.remove("fa-bars");
        icon.classList.add("fa-xmark");
    } else {
        icon.classList.remove("fa-xmark");
        icon.classList.add("fa-bars");
    }
});


navItems.forEach((link) => {

    link.addEventListener("click", () => {

        navLinks.classList.remove("show");

        const icon = menuToggle.querySelector("i");

        icon.classList.remove("fa-xmark");
        icon.classList.add("fa-bars");

    });

});


/* =========================================================
   ACTIVE NAVIGATION
========================================================= */

const sections = document.querySelectorAll("section[id]");

function updateActiveNav() {

    const scrollPosition = window.scrollY + 150;

    sections.forEach((section) => {

        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute("id");

        if (
            scrollPosition >= sectionTop &&
            scrollPosition < sectionTop + sectionHeight
        ) {

            navItems.forEach((link) => {
                link.classList.remove("active");
            });

            const activeLink = document.querySelector(
                `.nav-link[href="#${sectionId}"]`
            );

            if (activeLink) {
                activeLink.classList.add("active");
            }
        }

    });

}

window.addEventListener("scroll", updateActiveNav);


/* =========================================================
   SCROLL REVEAL
========================================================= */

const revealElements = document.querySelectorAll(".reveal");

const revealObserver = new IntersectionObserver(
    (entries) => {

        entries.forEach((entry) => {

            if (entry.isIntersecting) {

                entry.target.classList.add("visible");

                revealObserver.unobserve(entry.target);

            }

        });

    },
    {
        threshold: 0.12
    }
);


revealElements.forEach((element) => {
    revealObserver.observe(element);
});


/* =========================================================
   BACK TO TOP
========================================================= */

const backToTop = document.getElementById("backToTop");

window.addEventListener("scroll", () => {

    if (window.scrollY > 600) {
        backToTop.classList.add("show");
    } else {
        backToTop.classList.remove("show");
    }

});


backToTop.addEventListener("click", () => {

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

});


/* =========================================================
   CONTACT FORM
=========================================================

   IMPORTANT:
   Replace this with your own Web3Forms access key.

   Do not commit a sensitive/private API key to GitHub.

========================================================= */

const FORM_API_KEY = "d7f6a402-a1d1-44ce-b0fe-22c2d9d220bf";

const contactForm = document.getElementById("contactForm");

const popup = document.getElementById("popup");
const popupTitle = document.getElementById("popupTitle");
const popupMessage = document.getElementById("popupMessage");

const closePopup = document.getElementById("closePopup");
const popupOkay = document.getElementById("popupOkay");


function showPopup(title, message) {

    popupTitle.textContent = title;
    popupMessage.textContent = message;

    popup.classList.add("show");

}


function hidePopup() {

    popup.classList.remove("show");

}


closePopup.addEventListener("click", hidePopup);
popupOkay.addEventListener("click", hidePopup);


popup.addEventListener("click", (event) => {

    if (event.target === popup) {
        hidePopup();
    }

});


/* =========================================================
   FORM SUBMISSION
========================================================= */

contactForm.addEventListener("submit", async (event) => {

    event.preventDefault();

    const name = document
        .getElementById("name")
        .value
        .trim();

    const email = document
        .getElementById("email")
        .value
        .trim();

    const message = document
        .getElementById("message")
        .value
        .trim();


    if (!name || !email || !message) {

        showPopup(
            "Missing Information",
            "Please fill in all the fields before sending your message."
        );

        return;
    }


    if (FORM_API_KEY === "YOUR_WEB3FORMS_ACCESS_KEY") {

        showPopup(
            "Form Not Configured",
            "Please configure your Web3Forms access key in script.js."
        );

        return;
    }


    const submitButton = contactForm.querySelector(
        "button[type='submit']"
    );

    const originalButtonHTML = submitButton.innerHTML;


    submitButton.disabled = true;

    submitButton.innerHTML = `
        Sending...
        <i class="fa-solid fa-spinner fa-spin"></i>
    `;


    try {

        const response = await fetch(
            "https://api.web3forms.com/submit",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },

                body: JSON.stringify({
                    access_key: FORM_API_KEY,
                    name: name,
                    email: email,
                    message: message
                })
            }
        );


        const data = await response.json();


        if (data.success) {

            contactForm.reset();

            showPopup(
                "Message Sent!",
                "Thanks for reaching out. I'll get back to you soon."
            );

        } else {

            showPopup(
                "Something Went Wrong",
                data.message ||
                "Unable to send your message right now."
            );

        }

    } catch (error) {

        console.error("Form submission error:", error);

        showPopup(
            "Connection Error",
            "Something went wrong. Please try again later."
        );

    } finally {

        submitButton.disabled = false;

        submitButton.innerHTML = originalButtonHTML;

    }

});


/* =========================================================
   YEAR
========================================================= */

const currentYear = new Date().getFullYear();

const footerYear = document.querySelector(
    ".footer-bottom span:first-child"
);

if (footerYear) {

    footerYear.textContent =
        `© ${currentYear} Ayush Lokare`;

}