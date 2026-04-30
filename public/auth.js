async function signup() {
  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  const res = await fetch("/studio/auth/signup", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ name, email, password })
  });

  const msg = await res.text();

  if (res.ok) {
    alert("Signup successful");
    location.href = "/studio/login";
  } else {
    alert(msg);
  }
}

async function login() {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  const res = await fetch("/studio/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ email, password })
  });

  const data = await res.json().catch(async () => ({
    message: await res.text()
  }));

  if (res.ok) {
    localStorage.setItem("user", data.name);
    location.href = "/studio/dashboard";
  } else {
    alert(data.message);
  }
}