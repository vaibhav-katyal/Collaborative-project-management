document
  .getElementById("login-form")
  .addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent default form submission

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const messageBox = document.getElementById("message");

    messageBox.style.display = "none";
    messageBox.classList.remove("success");
    messageBox.classList.remove("message-box");

    // 1. Retrieve all users
    const users = JSON.parse(localStorage.getItem("users") || "[]");

    // 2. Find the user by email
    const user = users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase()
    );

    if (!user) {
      // User not found
      messageBox.textContent =
        "Error: Account not found. Please sign up first.";
      messageBox.classList.add("message-box");
      messageBox.style.display = "block";
      return;
    }

    // 3. Validate password
    if (user.password !== password) {
      messageBox.textContent = "Error: Invalid password.";
      messageBox.classList.add("message-box");
      messageBox.style.display = "block";
      return;
    }

    // 4. Successful Login: Set the user session
    // Only store safe/necessary data for the session!
    const loggedInUser = {
      name: user.name,
      email: user.email,
      role: user.role,
      joinedDate: user.joinedDate,
    };
    localStorage.setItem("loggedInUser", JSON.stringify(loggedInUser));

    // 5. Success Message and Redirect
    messageBox.textContent = "Success! Signed in. Redirecting to profile...";
    messageBox.classList.add("message-box", "success");
    messageBox.style.display = "block";

    setTimeout(() => {
      window.location.href = "user-profile.html";
    }, 1000);
  });
