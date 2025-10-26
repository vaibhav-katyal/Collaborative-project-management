document
  .getElementById("signup-form")
  .addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent default form submission

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirm-password").value;
    const messageBox = document.getElementById("message");

    messageBox.style.display = "none";
    messageBox.classList.remove("success");
    messageBox.classList.remove("message-box"); // clear previous styling

    // 1. Password Match Validation
    if (password !== confirmPassword) {
      messageBox.textContent = "Error: Passwords do not match.";
      messageBox.classList.add("message-box");
      messageBox.style.display = "block";
      return;
    }

    // 2. Check for existing user
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const existingUser = users.find(
      (user) => user.email.toLowerCase() === email.toLowerCase()
    );

    if (existingUser) {
      messageBox.textContent =
        "Error: An account with this email already exists. Please sign in.";
      messageBox.classList.add("message-box");
      messageBox.style.display = "block";
      return;
    }

    // 3. Create new user object
    const newUser = {
      name: name,
      email: email,
      password: password, // Store password (for this demo)
      // Default profile details for the user-profile page
      role: "New HiveMind Member",
      joinedDate: new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
      }),
    };

    // 4. Store user data in local storage
    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));

    // 5. Success Message and Redirect
    messageBox.textContent =
      "Success! Account created. Redirecting to Sign In...";
    messageBox.classList.add("message-box", "success");
    messageBox.style.display = "block";

    setTimeout(() => {
      window.location.href = "login.html";
    }, 1500);
  });
