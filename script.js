const form = document.getElementById("contactForm");
const responseMsg = document.getElementById("response");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = form.name.value;

  const formData = {
    name: name,
    email: form.email.value,
    message: form.message.value
  };

  try {
    const btn = form.querySelector("button");
    btn.innerText = "Sending...";
    btn.disabled = true;

    // ✅ FORM SPREE (EMAIL)
    await fetch("https://formspree.io/f/xnjopoll", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(formData)
    });

    // ✅ MYSQL (LOCAL ONLY)
    await fetch("http://localhost:5000/contact", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(formData)
    });

    responseMsg.innerText = `✅ Thank you ${name}, message sent successfully!`;
    form.reset();

  } catch (err) {
    console.error(err);
    responseMsg.innerText = "❌ Error sending message";
  } finally {
    const btn = form.querySelector("button");
    btn.innerText = "Send Message";
    btn.disabled = false;
  }
});
