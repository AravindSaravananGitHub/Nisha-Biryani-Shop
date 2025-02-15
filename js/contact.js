const clear = document.getElementById("clearForm");
const form = document.getElementById("contact-form");

// For Contact page message

form.addEventListener("submit", function (event) {
  event.preventDefault();
  const firstName = document.getElementById("first-name").value;
  const secondName = document.getElementById("second-name").value;
  const email = document.getElementById("email").value;
  const mobile = document.getElementById("mobile").value;
  const message = document.getElementById("message").value;

  emailjs
    .send("service_x02djnh", "template_sw4h1vu", {
      first_name: firstName,
      last_name: secondName,
      email: email,
      mobile_number: mobile,
      message: message,
    })
    .then(
      function (response) {
        alert("Message sent successfully!");
        form.reset();
      },
      function (error) {
        alert("Failed to send message. Try again!");
        form.reset();
      }
    );
});

clear.addEventListener("click", () => {
  form.reset();
});
