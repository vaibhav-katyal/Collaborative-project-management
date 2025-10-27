document.addEventListener("DOMContentLoaded", function () {
    const authUiContainer = document.getElementById("auth-ui-container");
    const navButtons = document.getElementById("nav-buttons");
    const loggedInUserJSON = localStorage.getItem("loggedInUser");

    // Function to handle logging out the user
    const handleLogout = () => {
        localStorage.removeItem("loggedInUser"); // Clear the session
        window.location.href = "login.html"; // Redirect to login
    };

    if (loggedInUserJSON) {
        // --- User IS Logged In: Show Profile Icon, Dropdown, AND Get Started button ---
        const user = JSON.parse(loggedInUserJSON);

        // Get user's initials for the profile picture/icon
        const nameParts = user.name.split(" ");
        const initials = nameParts.length > 1
            ? nameParts[0][0] + nameParts[nameParts.length - 1][0]
            : nameParts[0][0];

        // 1. Construct the complete profile menu HTML (Dropdown)
        authUiContainer.innerHTML = `
            <div id="user-menu" style="position: relative; display: flex; align-items: center; z-index: 100;">
                <!-- Profile Icon (Clickable) -->
                <div id="profile-icon" 
                    style="
                        width: 40px; 
                        height: 40px; 
                        border-radius: 50%; 
                        background-color: #6c63ff; 
                        color: white; 
                        display: flex; 
                        align-items: center; 
                        justify-content: center; 
                        font-weight: 600; 
                        font-size: 16px; 
                        cursor: pointer;
                        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                        transition: transform 0.1s ease;
                        margin-right: 15px; /* Added spacing from Get Started button */
                    "
                    title="${user.name}"
                >${initials.toUpperCase()}</div>
                
                <!-- Dropdown Content -->
                <div id="user-dropdown" 
                    style="
                        display: none; 
                        position: absolute; 
                        top: 100%; /* Position below the icon */
                        right: 0; 
                        min-width: 160px; 
                        background-color: white; 
                        border-radius: 8px; 
                        box-shadow: 0 8px 16px rgba(0,0,0,0.2); 
                        border: 1px solid #e5e7eb;
                        overflow: hidden;
                        margin-top: 5px; /* Small gap below icon */
                    ">
                    <a href="user-profile.html" class="dropdown-item" 
                        style="
                            display: block; 
                            padding: 12px 16px; 
                            text-decoration: none; 
                            color: #374151; 
                            font-size: 14px;
                            transition: background-color 0.15s;
                        ">
                        <i class="fas fa-user-circle" style="margin-right: 8px;"></i>Profile
                    </a>
                    <button id="logout-button" class="dropdown-item" 
                        style="
                            display: block; 
                            padding: 12px 16px; 
                            color: #374151; 
                            width: 100%;
                            text-align: left;
                            border: none;
                            background: none;
                            cursor: pointer;
                            font-size: 14px;
                            transition: background-color 0.15s;
                            border-top: 1px solid #f3f4f6;
                        ">
                        <i class="fas fa-sign-out-alt" style="margin-right: 8px;"></i>Log Out
                    </button>
                </div>
            </div>
        `;

        // 2. Add the "Get Started" button back as a primary button
        authUiContainer.insertAdjacentHTML('afterend', `
            <a href="projects.html" class="btn-primary" id="get-started-button"
                style="
                    text-decoration: none; 
                    padding: 10px 20px; 
                    border-radius: 6px; 
                    background-color: #6c63ff; 
                    border: 1px solid #6c63ff; 
                    color: white; 
                    font-weight: 500;
                    display: inline-block;
                ">
                Get Started
            </a>
        `);


        // 3. Add event listeners to the dynamically created elements
        const profileIcon = document.getElementById("profile-icon");
        const userDropdown = document.getElementById("user-dropdown");
        const logoutButton = document.getElementById("logout-button");

        // Toggle dropdown visibility on icon click
        profileIcon.addEventListener("click", (e) => {
            e.stopPropagation(); // Prevent the document click from closing it immediately
            userDropdown.style.display = userDropdown.style.display === "block" ? "none" : "block";
        });

        // Add hover effect suggestion for dropdown items
        const dropdownItems = userDropdown.querySelectorAll('a, button');
        dropdownItems.forEach(item => {
            item.onmouseover = () => item.style.backgroundColor = "#f3f4f6";
            item.onmouseout = () => item.style.backgroundColor = "white";
        });

        // Close dropdown when clicking outside
        document.addEventListener("click", (e) => {
            // Check if the click was not inside the user menu
            const userMenu = document.getElementById("user-menu");
            if (userMenu && !userMenu.contains(e.target)) {
                userDropdown.style.display = "none";
            }
        });

        // Log out functionality
        logoutButton.addEventListener("click", handleLogout);

    } else {
        // --- User IS NOT Logged In: Show Sign In button AND Get Started button ---
        authUiContainer.innerHTML = `
            <a href="login.html" class="btn-secondary" style="
                text-decoration: none; 
                padding: 10px 20px; 
                border-radius: 6px; 
                background-color: white; 
                border: 1px solid #6c63ff; 
                color: #6c63ff; 
                font-weight: 500;
                display: inline-block; /* Ensure it respects flex/inline layout */
                margin-right: 15px; /* Added spacing from Get Started button */
            ">
                Sign In
            </a>
        `;
        // Since we removed the static one in index.html, we must re-insert Get Started here too
        authUiContainer.insertAdjacentHTML('afterend', `
            <a href="projects.html" class="btn-primary" id="get-started-button"
                style="
                    text-decoration: none; 
                    padding: 10px 20px; 
                    border-radius: 6px; 
                    background-color: #6c63ff; 
                    border: 1px solid #6c63ff; 
                    color: white; 
                    font-weight: 500;
                    display: inline-block;
                ">
                Get Started
            </a>
        `);
    }
    
    // Cleanup: Remove the duplicated 'Get Started' link if it exists in the DOM after the script runs
    // This handles the case where the user kept the original static link in the HTML.
    const staticGetStarted = document.querySelector('.nav-btns .btn-primary');
    if (staticGetStarted) {
        staticGetStarted.remove();
    }
});
