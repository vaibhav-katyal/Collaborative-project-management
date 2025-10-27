document.addEventListener("DOMContentLoaded", function () {
  const loggedInUserJSON = localStorage.getItem("loggedInUser");
  const navButtons = document.getElementById("nav-buttons");
  const signInLink = document.getElementById("sign-in-link");
  const usersKey = 'hivemindUsers';
  const allUsers = JSON.parse(localStorage.getItem(usersKey) || '[]');

  if (!loggedInUserJSON) {
    // If NO user is logged in, redirect them to the login page
    window.location.href = "login.html";
    return;
  }

  let user = JSON.parse(loggedInUserJSON);
  
  // Find the most up-to-date user data from the main user list (if it exists)
  const masterUser = allUsers.find(u => u.email === user.email);
  if (masterUser) {
      user = masterUser;
      // Ensure local user data is also up to date (for consistency)
      localStorage.setItem("loggedInUser", JSON.stringify(masterUser));
  }

  // Initialize dynamic fields
  user.points = user.points || 0;
  user.tasksCompleted = user.tasksCompleted || 0;
  user.badges = user.badges || [];
  
  // --- 1. Dynamic Content Update ---

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
  document.title = `${user.name}'s Profile`;
  
  // NEW: Update stat cards with dynamic data
  // The '312' task count needs to be made dynamic
  const tasksDeliveredStat = document.querySelector('.stat-cards-grid .stat-card:nth-child(2) .stat-value');
  tasksDeliveredStat.textContent = user.tasksCompleted;
  
  // --- 2. Dynamic Points and Badges ---
  
  // Assuming Leadership Card is the first one where points are shown
  const leadershipPoints = document.querySelector('.achievement-card:nth-child(1) .achievement-points');
  leadershipPoints.textContent = `${user.points} Points`;
  
  // Simple logic to calculate achievement level (e.g., Level = floor(Points / 300) + 1)
  const level = Math.floor(user.points / 300) + 1;
  const levelProgress = Math.round((user.points % 300) / 300 * 100);
  
  const leadershipProgressLabel = document.querySelector('.achievement-card:nth-child(1) .progress-label');
  const leadershipProgressBar = document.querySelector('.achievement-card:nth-child(1) .leadership-progress');
  
  if (leadershipProgressLabel && leadershipProgressBar) {
      leadershipProgressLabel.innerHTML = `Level ${level} Progress<span>${levelProgress}%</span>`;
      leadershipProgressBar.style.width = `${levelProgress}%`;
  }
  
  // Clear and render dynamic badges
  const badgeContainer = document.querySelector('.achievement-card:nth-child(1) .achievement-badges');
  badgeContainer.innerHTML = '';
  
  if (user.badges.length > 0) {
      user.badges.forEach(badgeName => {
          const badgeDiv = document.createElement('div');
          badgeDiv.className = 'achievement-badge';
          badgeDiv.title = badgeName; // Show badge name on hover
          
          // Simple icon mapping based on badge name
          let iconPath = '';
          if (badgeName === 'Task Master') {
              iconPath = 'M10 20.485c-.93 0-1.77-.38-2.384-1.01-.613-.63-1.026-1.503-1.026-2.583V14h-2c-1.1 0-2 .9-2 2v2c0 1.1.9 2 2 2h3c.552 0 1 .448 1 1v1c0 1.1.9 2 2 2s2-.9 2-2v-1c0-.552.448-1 1-1h3c1.1 0 2-.9 2-2v-2c0-1.1-.9-2-2-2h-2v2.923c0 1.08-.413 1.953-1.026 2.583-.614.63-1.454 1.01-2.384 1.01zM14 14h-4c-1.1 0-2 .9-2 2v1c0 1.1.9 2 2 2h4c1.1 0 2-.9 2-2v-1c0-1.1-.9-2-2-2z';
          } else if (badgeName === 'Hive Contributor') {
              iconPath = 'M12 2c-5.523 0-10 4.477-10 10s4.477 10 10 10 10-4.477 10-10-4.477-10-10-10zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8zm-2.828-10.828l-1.414 1.414 4.242 4.242 6.364-6.364-1.414-1.414-4.95 4.95-2.828-2.828z';
          } else {
               iconPath = 'M12 2l3.09 6.36L22 9.27l-5 4.87 1.18 6.88L12 18.06l-6.18 3.25L7 14.14l-5-4.87 8.91-1.28L12 2z';
          }
          
          badgeDiv.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="${iconPath}" /></svg>`;
          badgeContainer.appendChild(badgeDiv);
      });
  } else {
      badgeContainer.innerHTML = '<small style="font-size: 0.8em; color: #6b7280;">No badges yet.</small>';
  }

  // --- 3. Navbar Update (Sign Out Button) ---

  if (signInLink) {
    signInLink.remove();
  }

  const signOutButton = document.createElement("button");
  signOutButton.textContent = "Sign Out";
  signOutButton.className = "btn-secondary";
  signOutButton.style.padding = "8px 16px";
  signOutButton.style.borderRadius = "8px";
  signOutButton.style.fontWeight = "600";
  signOutButton.style.color = "#ef4444";
  signOutButton.style.border = "1px solid #ef4444";
  signOutButton.style.cursor = "pointer";

  const getStartedLink = navButtons.querySelector(".btn-primary");
  navButtons.insertBefore(signOutButton, getStartedLink);

  signOutButton.addEventListener("click", function () {
    localStorage.removeItem("loggedInUser");
    window.location.href = "login.html";
  });
});