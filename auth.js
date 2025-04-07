/**
 * StudyStream Authentication Module
 * Handles user authentication and session management
 */

const studyStreamAuth = (function() {
  // Demo users (in a real app, this would be handled on a server)
  const demoUsers = [
    {
      id: "user-1",
      name: "John Doe",
      email: "john@example.com",
      password: "password123", // In a real app, passwords would be hashed
      avatar: "https://ui-avatars.com/api/?name=John+Doe&background=0D8ABC&color=fff",
      enrolledCourses: ["course-1", "course-2"]
    }
  ];

  // Check if user is logged in on page load
  const initAuth = () => {
    const currentUser = studyStreamData.getCurrentUser();
    updateUIForAuthState(currentUser);
    
    // Add event listeners
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', logout);
    }
    
    // Hide loader after auth check completes
    setTimeout(() => {
      document.body.classList.remove('loading');
    }, 200);
  };

  // Update UI elements based on authentication state
  const updateUIForAuthState = (user) => {
    const authButtons = document.getElementById('auth-buttons');
    const userDropdown = document.getElementById('user-dropdown');
    
    if (user) {
      // User is logged in
      if (authButtons) authButtons.classList.add('d-none');
      if (userDropdown) {
        userDropdown.classList.remove('d-none');
        document.getElementById('user-name').textContent = user.name;
        document.getElementById('user-email').textContent = user.email;
        document.getElementById('user-avatar').src = user.avatar;
      }
    } else {
      // User is logged out
      if (authButtons) authButtons.classList.remove('d-none');
      if (userDropdown) userDropdown.classList.add('d-none');
    }
    
    // Dispatch an event that other parts of the app can listen for
    const event = new CustomEvent('authStateChanged', { detail: { user } });
    document.dispatchEvent(event);
  };

  // Login function
  const login = (email, password) => {
    // For demo purposes, we'll allow login with any email that matches a demo user
    // In a real app, you would validate the password against a hashed version
    const user = demoUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
    
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (user) {
          // Store user in localStorage (in a real app, you'd store a token)
          localStorage.setItem('currentUser', JSON.stringify(user));
          updateUIForAuthState(user);
          resolve({ success: true, user });
        } else {
          reject({ success: false, message: "Invalid email or password" });
        }
      }, 800); // Simulate network delay
    });
  };

  // Sign up function
  const signup = (name, email, password) => {
    // Check if user already exists
    const existingUser = demoUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
    
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (existingUser) {
          reject({ success: false, message: "User with this email already exists" });
          return;
        }
        
        // Create new user
        const newUser = {
          id: `user-${demoUsers.length + 1}`,
          name,
          email,
          password, // In a real app, this would be hashed
          avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=0D8ABC&color=fff`,
          enrolledCourses: []
        };
        
        // Add to demo users (in a real app, this would go to a database)
        demoUsers.push(newUser);
        
        // Log in the new user
        localStorage.setItem('currentUser', JSON.stringify(newUser));
        updateUIForAuthState(newUser);
        resolve({ success: true, user: newUser });
      }, 800); // Simulate network delay
    });
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('currentUser');
    updateUIForAuthState(null);
    
    // Redirect to home if on a protected page
    const protectedPages = ['profile.html'];
    const currentPage = window.location.pathname.split('/').pop();
    
    if (protectedPages.includes(currentPage)) {
      window.location.href = 'index.html';
    }
  };

  // Update user profile
  const updateProfile = (userData) => {
    const currentUser = studyStreamData.getCurrentUser();
    if (!currentUser) return Promise.reject({ success: false, message: "Not logged in" });
    
    return new Promise((resolve) => {
      setTimeout(() => {
        // Update user data
        const updatedUser = { ...currentUser, ...userData };
        
        // Update in localStorage
        localStorage.setItem('currentUser', JSON.stringify(updatedUser));
        
        // Update demo user array (in a real app, this would update the database)
        const userIndex = demoUsers.findIndex(u => u.id === currentUser.id);
        if (userIndex !== -1) {
          demoUsers[userIndex] = updatedUser;
        }
        
        updateUIForAuthState(updatedUser);
        resolve({ success: true, user: updatedUser });
      }, 800); // Simulate network delay
    });
  };

  // Check if the auth form is present on page, and if so, set up handlers
  const setupAuthForms = () => {
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');
    const loginTab = document.getElementById('login-tab');
    const signupTab = document.getElementById('signup-tab');
    
    // Set initial active tab based on URL
    if (window.location.search.includes('type=signup') && signupTab) {
      signupTab.click();
    }
    
    // Login form submission
    if (loginForm) {
      loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        const loginButton = document.getElementById('login-button');
        const loginSpinner = document.getElementById('login-spinner');
        
        // Show loading state
        loginButton.disabled = true;
        loginSpinner.classList.remove('d-none');
        
        login(email, password)
          .then(response => {
            // Success, redirect to home or previous page
            window.location.href = 'index.html';
          })
          .catch(error => {
            // Show error
            alert(error.message);
            loginButton.disabled = false;
            loginSpinner.classList.add('d-none');
          });
      });
    }
    
    // Signup form submission
    if (signupForm) {
      signupForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const name = document.getElementById('signup-name').value;
        const email = document.getElementById('signup-email').value;
        const password = document.getElementById('signup-password').value;
        const signupButton = document.getElementById('signup-button');
        const signupSpinner = document.getElementById('signup-spinner');
        
        // Show loading state
        signupButton.disabled = true;
        signupSpinner.classList.remove('d-none');
        
        signup(name, email, password)
          .then(response => {
            // Success, redirect to home
            window.location.href = 'index.html';
          })
          .catch(error => {
            // Show error
            alert(error.message);
            signupButton.disabled = false;
            signupSpinner.classList.add('d-none');
          });
      });
    }
  };

  // Public API
  return {
    initAuth,
    login,
    signup,
    logout,
    updateProfile,
    setupAuthForms
  };
})();

// Initialize authentication on page load
document.addEventListener('DOMContentLoaded', function() {
  studyStreamAuth.initAuth();
  
  // If we're on the auth page, set up the forms
  if (window.location.pathname.includes('auth.html')) {
    studyStreamAuth.setupAuthForms();
  }
});
