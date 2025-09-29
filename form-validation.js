// -----------------------------------------------------
// The Woof of Walk Street — Form Validation Script
// Applies to all forms site-wide
// -----------------------------------------------------

document.addEventListener("DOMContentLoaded", () => {
  const forms = document.querySelectorAll("form");

  forms.forEach((form) => {
    const successMessage = form.querySelector(".success-message");

    form.addEventListener("submit", (e) => {
      let isValid = true;

      // Validate all required inputs/selects/textareas
      const requiredFields = form.querySelectorAll("input[required], select[required], textarea[required]");

      requiredFields.forEach((field) => {
        const error = field.nextElementSibling;
        if (!field.value.trim()) {
          isValid = false;
          field.classList.add("invalid");
          if (error && error.classList.contains("error-message")) {
            error.textContent = "This field is required.";
          }
        } else if (field.type === "email" && !validateEmail(field.value)) {
          isValid = false;
          field.classList.add("invalid");
          if (error && error.classList.contains("error-message")) {
            error.textContent = "Please enter a valid email.";
          }
        } else {
          field.classList.remove("invalid");
          if (error && error.classList.contains("error-message")) {
            error.textContent = "";
          }
        }
      });

      // Prevent submission if invalid
      if (!isValid) {
        e.preventDefault();
        return;
      }

      // Show success message (only for demo / formspree setup)
      if (successMessage) {
        e.preventDefault(); // remove this if you want live submission to Formspree
        successMessage.style.display = "block";
        setTimeout(() => {
          successMessage.style.display = "none";
          form.reset();
        }, 5000);
      }
    });
  });
});

// Utility: email regex check
function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email.toLowerCase());
}
