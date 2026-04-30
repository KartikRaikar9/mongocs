async function signup() {
  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  const res = await fetch("/api/auth/signup", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ name, email, password })
  });

  const msg = await res.json().catch(async () => ({
    error: await res.text()
  }));

  if (res.ok) {
    alert("Signup successful");
    location.href = "/login";
  } else {
    alert(msg.error || msg.message);
  }
}

async function login() {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  const res = await fetch("/api/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ email, password })
  });

  const data = await res.json().catch(async () => ({
    error: await res.text()
  }));

  if (res.ok) {
    localStorage.setItem("user", data.name);
    location.href = "/dashboard";
  } else {
    alert(data.error || data.message);
  }
}