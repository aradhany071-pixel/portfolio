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

  const btn = form.querySelector("button");
  btn.innerText = "Sending...";
  btn.disabled = true;

  try {
    // ✅ Formspree email
    await fetch("https://formspree.io/f/YOUR_FORM_ID", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(formData)
    });

    // ✅ MySQL save
    await fetch("http://127.0.0.1:5000/contact", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(formData)
    });

    responseMsg.innerText = `✅ Thank you ${name}! Message sent & saved.`;
    form.reset();

  } catch (err) {
    console.error(err);
    responseMsg.innerText = "❌ Error sending message";
  } finally {
    btn.innerText = "Send Message";
    btn.disabled = false;
  }
});
