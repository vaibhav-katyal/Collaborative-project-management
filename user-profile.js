document.addEventListener("DOMContentLoaded", function () {
  const loggedInUserJSON = localStorage.getItem("loggedInUser");
  const navButtons = document.getElementById("nav-buttons");
  const signInLink = document.getElementById("sign-in-link");

  if (!loggedInUserJSON) {
    // If NO user is logged in, redirect them to the login page
    window.location.href = "login.html";
    return;
  }

  const user = JSON.parse(loggedInUserJSON);

  // --- 1. Dynamic Content Update ---

  // Get user's initials for the profile picture
  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("");

  document.getElementById("profile-name").textContent = user.name;
  document.getElementById("profile-role").textContent = user.role;
  document.getElementById("profile-email").textContent = user.email;
  document.getElementById(
    "profile-joined-date"
  ).textContent = `Joined ${user.joinedDate}`;
  document.getElementById(
    "profile-picture"
  ).src = `https://placehold.co/96x96/6c63ff/FFFFFF?text=${initials}`;
  document.title = `${user.name}'s Profile`; // Update page title

  // --- 2. Navbar Update (Sign Out Button) ---

  // Remove the static "Sign In" link and create a "Sign Out" button
  if (signInLink) {
    signInLink.remove();
  }

  // const signOutButton = document.createElement("button");
  // signOutButton.textContent = "Sign Out";
  signOutButton.className = "btn-secondary"; // Reusing your secondary button styling
  signOutButton.style.backgroundColor = "#ef4444"; // Example red color for sign out
  signOutButton.style.color = "white";
  signOutButton.style.border = "none";

  // Insert the new Sign Out button before the "Get Started" link
  const getStartedLink = navButtons.querySelector(".btn-primary");
  navButtons.insertBefore(signOutButton, getStartedLink);

  // --- 3. Sign Out Functionality ---
  signOutButton.addEventListener("click", function () {
    localStorage.removeItem("loggedInUser"); // Clear the session
    window.location.href = "login.html"; // Redirect to login
  });
});
