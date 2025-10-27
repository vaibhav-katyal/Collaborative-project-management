
// --- Global Keys ---
const projectsKey = 'hivemindProjects';
const loggedInUserKey = 'loggedInUser';

// --- Utility Functions ---

function getProjects() {
    return JSON.parse(localStorage.getItem(projectsKey) || '[]');
}

function setProjects(projects) {
    localStorage.setItem(projectsKey, JSON.stringify(projects));
}

function getLoggedInUser() {
    const userJSON = localStorage.getItem(loggedInUserKey);
    return userJSON ? JSON.parse(userJSON) : null;
}

function getCommunityProjects() {
    return getProjects().filter(p => p.isCommunityProject);
}

/**
 * Initializes mock projects in localStorage if they don't already exist by ID.
 */
function initializeMockData() {
    let projects = getProjects();
    let projectsUpdated = false;

    const mockProjects = [
        {
            id: 'mock-1',
            projectName: 'HiveMind AI Assistant',
            projectCategory: 'AI/ML',
            startDate: '2025-01-15',
            expectedEndDate: '2025-12-31',
            projectDescription: 'A generative AI assistant that helps teams draft documentation, manage tasks, and synthesize meeting notes automatically, leveraging cutting-edge LLMs.',
            gitHubLink: 'https://github.com/hivemind-ai/assistant',
            techStack: ['Python', 'TensorFlow', 'React', 'Node.js'],
            projectProgress: 50,
            projectStatus: 'in-progress',
            teamLeader: { name: 'Alice Smith', email: 'alice.smith@example.com' },
            teamMembers: [
                { name: 'Alice Smith', email: 'alice.smith@example.com', role: 'Team Leader' },
                { name: 'Bob Johnson', email: 'bob.johnson@example.com', role: 'Developer' },
                { name: 'Charlie Brown', email: 'charlie.brown@example.com', role: 'Designer' }
            ],
            projectID: '#2025-001',
            isCommunityProject: true,
            imageURL: 'https://placehold.co/600x400/6c63ff/ffffff?text=HiveMind+AI'
        },
        {
            id: 'mock-2',
            projectName: 'GreenLeaf Urban Farm Monitor',
            projectCategory: 'GreenTech',
            startDate: '2025-04-01',
            expectedEndDate: '2025-11-01',
            projectDescription: 'IoT system for monitoring and optimizing conditions in vertical urban farms. Tracks soil moisture, light levels, and air quality.',
            gitHubLink: 'https://github.com/greenleaf-tech/monitor',
            techStack: ['C++', 'Arduino', 'Vue.js', 'AWS IoT'],
            projectProgress: 85,
            projectStatus: 'in-progress',
            teamLeader: { name: 'David Lee', email: 'david.lee@example.com' },
            teamMembers: [
                { name: 'David Lee', email: 'david.lee@example.com', role: 'Team Leader' },
                { name: 'Emily Chen', email: 'emily.chen@example.com', role: 'Hardware Engineer' }
            ],
            projectID: '#2025-002',
            isCommunityProject: true,
            imageURL: 'https://placehold.co/600x400/10b981/ffffff?text=GreenTech+Monitor'
        }
    ];

    // Check if mock projects exist and add them if they don't
    mockProjects.forEach(mockProject => {
        const exists = projects.some(p => p.id === mockProject.id);
        if (!exists) {
            projects.push(mockProject);
            projectsUpdated = true;
        }
    });

    if (projectsUpdated) {
        setProjects(projects);
    }

    // Add a mock logged-in user if none exists, primarily for testing the 'Upload Project' feature easily
    if (!getLoggedInUser()) {
        localStorage.setItem(loggedInUserKey, JSON.stringify({
            name: 'Mock User',
            email: 'mock.user@hivemind.com'
        }));
    }
}

// --- Community Project Rendering ---

function createCommunityProjectCard(project) {
    const user = getLoggedInUser();
    const isUserProject = user && project.teamLeader.email === user.email;

    const card = document.createElement('div');
    card.className = 'project-card';

    // Determine the action button based on project ownership
    let actionButtonHTML;
    if (isUserProject) {
        actionButtonHTML = `<a href="#" class="btn-remove" data-id="${project.id}">Remove from Community</a>`;
    } else {
        actionButtonHTML = `<a href="#" class="btn-primary btn-contribute" data-id="${project.id}" style="border-radius: 9999px; padding: 0.5rem 1rem; text-decoration: none; font-size: 0.875rem;">Contribute in this project</a>`;
    }

    card.innerHTML = `
                <img src="${project.imageURL || 'https://placehold.co/600x400/8b5cf6/ffffff?text=' + encodeURIComponent(project.projectName)}" alt="${project.projectName}" class="project-card-image">
                <div class="project-card-header">
                    <div class="left-side">
                        <span class="category" style="background-color: #f3e8ff; color: #7e22ce;">${project.projectCategory}</span>
                        <div class="rating">
                            <i class="fas fa-star"></i> 4.5
                        </div>
                    </div>
                    <span class="like-button"><i class="fas fa-heart"></i></span>
                </div>
                <h3>${project.projectName}</h3>
                <p>${project.projectDescription.substring(0, 100)}...</p>
                <div class="project-tags">
                    ${project.techStack.slice(0, 3).map(tag => `<span class="project-tag">${tag}</span>`).join('')}
                    ${project.techStack.length > 3 ? `<span class="project-tag">+${project.techStack.length - 3}</span>` : ''}
                </div>
                <div class="project-card-footer">
                    <div>
                        <h4>Team Members</h4>
                        <div class="team-members-avatars">
                            ${project.teamMembers.slice(0, 3).map(member =>
        `<div class="team-member-avatar">${member.name.substring(0, 2).toUpperCase()}</div>`
    ).join('')}
                        </div>
                    </div>
                    <div class="social-stats">
                        <div class="social-stat">
                            <i class="fas fa-thumbs-up"></i> ${Math.floor(Math.random() * 500) + 50}
                        </div>
                        <div class="social-stat">
                            <i class="fas fa-comments"></i> ${Math.floor(Math.random() * 50) + 10}
                        </div>
                    </div>
                    <span class="date">${new Date(project.startDate).toLocaleDateString()}</span>
                </div>
                <div style="margin-top: 10px; display: flex; justify-content: flex-end;">
                    ${actionButtonHTML}
                </div>
            `;

    // Add event listener to the appropriate button
    if (isUserProject) {
        const removeBtn = card.querySelector('.btn-remove');
        removeBtn.addEventListener('click', (e) => {
            e.preventDefault();
            // REPLACED CONFIRM WITH CUSTOM MODAL
            showAlertModal('confirm',
                `Are you sure you want to remove "${project.projectName}" from the Community Showcase? This will make the project private again.`,
                () => { // onConfirm
                    toggleCommunityStatus(project.id, false);
                    renderCommunityProjects();
                    showAlertModal('success', `Project "${project.projectName}" has been removed from the Community Showcase.`);
                },
                null, // onCancel (defaults to close)
                'Yes, Remove It',
                'Keep It'
            );
        });
    } else {
        const contributeBtn = card.querySelector('.btn-contribute');
        contributeBtn.addEventListener('click', (e) => {
            e.preventDefault();
            showProjectDetailsModal(project);
        });
    }

    return card;
}

function renderCommunityProjects() {
    const grid = document.getElementById('community-projects-grid');
    grid.innerHTML = '';
    const communityProjects = getCommunityProjects();

    if (communityProjects.length === 0) {
        grid.innerHTML = '<p style="text-align: center; grid-column: 1 / -1; padding: 50px;">No projects have been uploaded to the Community Showcase yet.</p>';
        // Reset stats
        document.getElementById('completed-projects-stat').textContent = '0';
        document.getElementById('average-rating-stat').textContent = 'N/A';
        return;
    }

    // Calculate and update stats based on real data (simplified)
    const completedProjects = communityProjects.filter(p => p.projectStatus === 'completed').length;
    document.getElementById('completed-projects-stat').textContent = completedProjects;
    // Simplified average rating (using a static value for now)
    document.getElementById('average-rating-stat').textContent = '4.6';

    communityProjects.forEach(project => {
        grid.appendChild(createCommunityProjectCard(project));
    });
}

// --- Selection Modal Logic (Upload) ---

const selectionModal = document.getElementById('project-selection-modal');
const selectionModalCloseBtn = document.getElementById('selection-modal-close-btn');
const uploadProjectBtn = document.getElementById('upload-project-btn');
const myProjectsList = document.getElementById('my-projects-list');

function openSelectionModal() {
    const user = getLoggedInUser();
    if (!user) {
        // REPLACED ALERT WITH CUSTOM MODAL
        showAlertModal('error', 'You must be signed in to upload a project to the community.',
            () => { window.location.href = 'login.html'; },
            null,
            'Sign In');
        return;
    }

    const allProjects = getProjects();
    // Filter for projects where the logged-in user is the team leader
    const userProjects = allProjects.filter(p => p.teamLeader.email === user.email);

    myProjectsList.innerHTML = '';

    if (userProjects.length === 0) {
        myProjectsList.innerHTML = '<li style="justify-content: center; color: #6b7280;">You have no projects where you are the Team Leader.</li>';
    } else {
        userProjects.forEach(project => {
            const listItem = document.createElement('li');
            listItem.innerHTML = `
                        <span><strong>${project.projectName}</strong> (${project.projectCategory})</span>
                        <button class="project-selection-btn ${project.isCommunityProject ? 'added-to-community-btn' : 'add-to-community-btn'}" 
                                data-id="${project.id}" 
                                ${project.isCommunityProject ? 'disabled' : ''}>
                            ${project.isCommunityProject ? 'Added' : 'Add to Community'}
                        </button>
                    `;
            myProjectsList.appendChild(listItem);
        });

        // Add event listeners for the 'Add to Community' buttons
        myProjectsList.querySelectorAll('.add-to-community-btn').forEach(btn => {
            btn.addEventListener('click', function () {
                const projectId = this.getAttribute('data-id');
                toggleCommunityStatus(projectId, true);
                closeSelectionModal();
                renderCommunityProjects();
                // Show success message after action
                showAlertModal('success', 'Project successfully added to the Community Showcase!');
            });
        });
    }

    selectionModal.style.display = 'flex';
}

function closeSelectionModal() {
    selectionModal.style.display = 'none';
}

function toggleCommunityStatus(projectId, isCommunity) {
    let projects = getProjects();
    const projectIndex = projects.findIndex(p => p.id === projectId);

    if (projectIndex !== -1) {
        projects[projectIndex].isCommunityProject = isCommunity;
        // Add a placeholder image URL if not already present, for better display in community
        if (isCommunity && !projects[projectIndex].imageURL) {
            projects[projectIndex].imageURL = 'https://placehold.co/600x400/8b5cf6/ffffff?text=' + encodeURIComponent(projects[projectIndex].projectName);
        }
        setProjects(projects);
    }
}

// --- Details Modal Logic (Contribute) ---

const detailsModal = document.getElementById('project-details-modal');
const detailsModalCloseBtn = document.getElementById('details-modal-close-btn');
const requestContributeBtn = document.getElementById('request-contribute-btn');

function showProjectDetailsModal(project) {
    document.getElementById('details-project-name').textContent = project.projectName;
    document.getElementById('details-project-category').textContent = project.projectCategory;
    document.getElementById('details-project-description').textContent = project.projectDescription;
    document.getElementById('details-team-leader').textContent = project.teamLeader.name;
    document.getElementById('details-project-status').textContent = project.projectStatus;

    const memberNames = project.teamMembers.map(m => m.name).join(', ');
    document.getElementById('details-team-members').textContent = memberNames;

    // Set up contribute button action
    requestContributeBtn.onclick = () => handleContributeRequest(project);

    detailsModal.style.display = 'flex';
}

function closeDetailsModal() {
    detailsModal.style.display = 'none';
}

function handleContributeRequest(project) {
    const user = getLoggedInUser();
    closeDetailsModal(); // Close the details modal first

    if (!user) {
        // REPLACED ALERT WITH CUSTOM MODAL
        showAlertModal('error', 'You must be signed in to request to contribute.',
            () => { window.location.href = 'login.html'; },
            null,
            'Sign In');
        return;
    }

    // Check if user is already on the team
    if (project.teamMembers.some(m => m.email === user.email)) {
        // REPLACED ALERT WITH CUSTOM MODAL
        showAlertModal('info', `You are already a member of the project: ${project.projectName}!`);
    } else {
        // In a real application, this would send an email/notification to the team leader.
        // REPLACED ALERT WITH CUSTOM MODAL
        showAlertModal('success', `Request to contribute to "${project.projectName}" has been sent to the Team Leader, ${project.teamLeader.name}.`);
    }
}

// --- Alert Modal Logic ---
const alertModal = document.getElementById('alert-modal');
const alertModalCloseBtn = document.getElementById('alert-modal-close-btn');
const alertTitle = document.getElementById('alert-title');
const alertMessage = document.getElementById('alert-message');
const alertIconContainer = document.getElementById('alert-icon-container');
const alertActions = document.getElementById('alert-actions');

function closeAlertModal() {
    alertModal.style.display = 'none';
    alertActions.innerHTML = ''; // Clear buttons
}

alertModalCloseBtn.addEventListener('click', closeAlertModal);
alertModal.addEventListener('click', (e) => {
    if (e.target === alertModal) {
        closeAlertModal();
    }
});

/**
 * Shows an attractive custom alert/confirmation modal.
 * @param {string} type - 'info', 'error', 'success', or 'confirm'.
 * @param {string} message - The main message to display.
 * @param {function} [onConfirm] - Function to run if confirmed/primary action taken.
 * @param {function} [onCancel] - Function to run if cancelled/secondary action taken.
 * @param {string} [confirmText='OK'] - Text for the primary action button.
 * @param {string} [cancelText='Cancel'] - Text for the secondary action button (only for 'confirm').
 */
function showAlertModal(type, message, onConfirm = closeAlertModal, onCancel = closeAlertModal, confirmText = 'OK', cancelText = 'Cancel') {
    let title = '';
    let iconClass = '';

    // Reset state
    alertIconContainer.className = '';
    alertActions.innerHTML = '';

    switch (type) {
        case 'error':
            title = 'Action Required';
            iconClass = 'fas fa-exclamation-triangle icon-error';
            break;
        case 'info':
            title = 'Information';
            iconClass = 'fas fa-info-circle icon-info';
            break;
        case 'success':
            title = 'Success!';
            iconClass = 'fas fa-check-circle icon-success';
            break;
        case 'confirm':
            title = 'Confirm Action';
            iconClass = 'fas fa-question-circle icon-info';
            break;
        default:
            title = 'Notification';
            iconClass = 'fas fa-bell icon-info';
            break;
    }

    alertTitle.textContent = title;
    alertMessage.textContent = message;
    alertIconContainer.innerHTML = `<i class="${iconClass}"></i>`;

    const confirmBtn = document.createElement('button');
    confirmBtn.className = 'btn-confirm';
    confirmBtn.textContent = confirmText;
    confirmBtn.addEventListener('click', () => {
        closeAlertModal();
        onConfirm();
    });
    alertActions.appendChild(confirmBtn);

    if (type === 'confirm') {
        const cancelBtn = document.createElement('button');
        cancelBtn.className = 'btn-cancel';
        cancelBtn.textContent = cancelText;
        cancelBtn.addEventListener('click', () => {
            closeAlertModal();
            if (onCancel) onCancel();
        });
        // Insert cancel button before confirm button
        alertActions.insertBefore(cancelBtn, confirmBtn);
    }

    alertModal.style.display = 'flex';
}

// --- Initialization and Event Handlers ---

document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize mock data if projects key is empty
    initializeMockData();

    // 2. Initial render of community projects
    renderCommunityProjects();

    // 3. Update navbar for sign out if user is logged in
    const user = getLoggedInUser();
    const navButtons = document.getElementById('nav-buttons');
    const signInLink = document.getElementById('sign-in-link');

    if (user) {
        if (signInLink) signInLink.remove();

        // const signOutButton = document.createElement('button');
        // signOutButton.textContent = 'Sign Out';
        signOutButton.className = 'btn-secondary';
        signOutButton.style.padding = '8px 16px';
        signOutButton.style.borderRadius = '8px';
        signOutButton.style.fontWeight = '600';
        signOutButton.style.color = '#ef4444';
        signOutButton.style.border = '1px solid #ef4444';
        signOutButton.style.cursor = 'pointer';

        const getStartedLink = navButtons.querySelector('.btn-primary');
        navButtons.insertBefore(signOutButton, getStartedLink);

        signOutButton.addEventListener('click', function () {
            // This is for demonstration. For a full sign-out, you'd remove the key.
            // localStorage.removeItem(loggedInUserKey);
            window.location.reload();
        });
    }
});

// Open Selection Modal
uploadProjectBtn.addEventListener('click', (e) => {
    e.preventDefault();
    openSelectionModal();
});

// Close Selection Modal handlers
selectionModalCloseBtn.addEventListener('click', closeSelectionModal);
selectionModal.addEventListener('click', (e) => {
    if (e.target === selectionModal) {
        closeSelectionModal();
    }
});

// Close Details Modal handlers
detailsModalCloseBtn.addEventListener('click', closeDetailsModal);
detailsModal.addEventListener('click', (e) => {
    if (e.target === detailsModal) {
        closeDetailsModal();
    }
});

