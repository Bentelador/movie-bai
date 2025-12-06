// Settings page functionality
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    if (localStorage.getItem('isLoggedIn') !== 'true') {
        window.location.href = 'login.html';
    }

    // Load user data into profile panel
    loadUserData();
    
    // Load saved settings
    loadSavedSettings();

    // Initialize search functionality
    loadMoviesForSearch();
    
    // Initialize event listeners
    initializeEventListeners();
});

function loadUserData() {
    const userEmail = localStorage.getItem('userEmail') || 'user@email.com';
    const userFullName = localStorage.getItem('userFullName') || 'User Name';
    const userPhone = localStorage.getItem('userPhone') || '+1 (555) 123-4567';
    
    // Update profile panel
    const panelUserName = document.getElementById('panelUserName');
    const panelUserEmail = document.getElementById('panelUserEmail');
    
    if (panelUserName) panelUserName.textContent = userFullName;
    if (panelUserEmail) panelUserEmail.textContent = userEmail;
    
    // Update settings form
    const settingsEmail = document.getElementById('settingsEmail');
    const settingsPhone = document.getElementById('settingsPhone');
    
    if (settingsEmail) settingsEmail.value = userEmail;
    if (settingsPhone) settingsPhone.value = userPhone;
}

function loadSavedSettings() {
    // Load settings from localStorage
    const savedSettings = JSON.parse(localStorage.getItem('userSettings')) || getDefaultSettings();
    
    // Apply saved settings to form
    document.getElementById('emailNotifications').checked = savedSettings.emailNotifications;
    document.getElementById('autoPlay').checked = savedSettings.autoPlay;
    document.getElementById('videoQuality').value = savedSettings.videoQuality;
    document.getElementById('contentRestriction').value = savedSettings.contentRestriction;
}

function getDefaultSettings() {
    return {
        emailNotifications: true,
        autoPlay: true,
        videoQuality: 'Auto',
        contentRestriction: 'All Maturity Levels',
        savedAt: new Date().toISOString()
    };
}

function saveSettings() {
    const saveBtn = document.getElementById('saveSettingsBtn');
    const saveText = saveBtn.querySelector('.save-text');
    const saveLoader = saveBtn.querySelector('.save-loader');
    const saveCheck = saveBtn.querySelector('.save-check');
    
    // Show saving state
    saveBtn.classList.add('saving');
    saveText.style.display = 'none';
    saveLoader.style.display = 'block';
    
    // Simulate saving process
    setTimeout(() => {
        // Get current user data
        const currentEmail = document.getElementById('settingsEmail').value;
        const fullPhoneNumber = savePhoneNumber();
        const currentPhone = fullPhoneNumber || '+1 (555) 123-4567';
        
        // Update user data in localStorage
        localStorage.setItem('userEmail', currentEmail);
        localStorage.setItem('userPhone', currentPhone);
        
        // Save settings - handle null values
        const emailNotifications = document.getElementById('emailNotifications');
        const autoPlay = document.getElementById('autoPlay');
        const videoQuality = document.getElementById('videoQuality');
        const contentRestriction = document.getElementById('contentRestriction');
        
        const settings = {
            emailNotifications: emailNotifications ? emailNotifications.checked : true,
            autoPlay: autoPlay ? autoPlay.checked : true,
            videoQuality: videoQuality ? videoQuality.value : 'Auto',
            contentRestriction: contentRestriction ? contentRestriction.value : 'All Maturity Levels',
            savedAt: new Date().toISOString()
        };
        
        console.log('Saving settings:', settings);
        localStorage.setItem('userSettings', JSON.stringify(settings));
        
        // Update profile panel with new email
        const panelUserEmail = document.getElementById('panelUserEmail');
        if (panelUserEmail) panelUserEmail.textContent = currentEmail;
        
        // Show success state
        saveBtn.classList.remove('saving');
        saveBtn.classList.add('saved');
        saveLoader.style.display = 'none';
        saveCheck.style.display = 'block';
        
        // Show a success message
        showToast('Settings saved successfully!');
        
        // Reset button after 2 seconds
        setTimeout(() => {
            saveBtn.classList.remove('saved');
            saveCheck.style.display = 'none';
            saveText.style.display = 'block';
        }, 2000);
        
    }, 1500); // Simulate 1.5 second save process
}

// ===== PROFILE PANEL FUNCTIONALITY =====
function toggleProfilePanel() {
    const profilePanel = document.getElementById('profilePanel');
    const overlay = document.getElementById('overlay') || createOverlay();
    
    profilePanel.classList.toggle('active');
    overlay.classList.toggle('active');
}

function createOverlay() {
    const overlay = document.createElement('div');
    overlay.className = 'overlay';
    overlay.id = 'overlay';
    overlay.onclick = closeAllPanels;
    document.body.appendChild(overlay);
    return overlay;
}

function closeAllPanels() {
    const profilePanel = document.getElementById('profilePanel');
    const overlay = document.getElementById('overlay');
    
    if (profilePanel) profilePanel.classList.remove('active');
    if (overlay) overlay.classList.remove('active');
    hideSearchSuggestions();
}

// ===== SEARCH FUNCTIONALITY =====
let allMovies = [];
let searchTimeout;

async function loadMoviesForSearch() {
    try {
        const response = await fetch('movies.json');
        allMovies = await response.json();
    } catch (error) {
        console.error('Error loading movies for search:', error);
        allMovies = [
            { id: 1, title: "Inception", year: "2010", genre: "Action, Sci-Fi", image: "🎬" },
            { id: 2, title: "The Dark Knight", year: "2008", genre: "Action, Crime", image: "🎬" },
            { id: 3, title: "Pulp Fiction", year: "1994", genre: "Crime, Drama", image: "🎬" }
        ];
    }
}

function showSearchSuggestions(query) {
    const suggestionsContainer = document.getElementById('searchSuggestions');
    if (!suggestionsContainer) return;
    
    if (!query.trim()) {
        hideSearchSuggestions();
        return;
    }
    
    const filteredMovies = allMovies.filter(movie =>
        movie.title.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 5);
    
    if (filteredMovies.length === 0) {
        suggestionsContainer.innerHTML = `
            <div class="search-suggestion">
                <div class="suggestion-info">
                    <div class="suggestion-title">No results found</div>
                    <div class="suggestion-details">Press Enter to search for "${query}"</div>
                </div>
            </div>
        `;
    } else {
        suggestionsContainer.innerHTML = filteredMovies.map(movie => `
            <div class="search-suggestion" onclick="selectSuggestion('${movie.title}')">
                <div class="suggestion-poster">${movie.image}</div>
                <div class="suggestion-info">
                    <div class="suggestion-title">${movie.title}</div>
                    <div class="suggestion-details">${movie.year} • ${movie.genre}</div>
                </div>
            </div>
        `).join('');
    }
    
    suggestionsContainer.classList.add('active');
}

function hideSearchSuggestions() {
    const suggestionsContainer = document.getElementById('searchSuggestions');
    if (suggestionsContainer) {
        suggestionsContainer.classList.remove('active');
    }
}

function selectSuggestion(movieTitle) {
    const searchInput = document.getElementById('mainSearchInput');
    if (searchInput) {
        searchInput.value = movieTitle;
        hideSearchSuggestions();
        performSearch();
    }
}

function performSearch() {
    const searchInput = document.getElementById('mainSearchInput');
    if (!searchInput) return;
    
    const searchQuery = searchInput.value.trim();
    
    if (!searchQuery) {
        alert('Please enter a search term');
        return;
    }
    
    window.location.href = `search-results.html?q=${encodeURIComponent(searchQuery)}`;
}

// ===== EVENT LISTENERS =====
function initializeEventListeners() {
    // Save settings when save button is clicked
    const saveBtn = document.querySelector('.save-btn');
    if (saveBtn) {
        saveBtn.addEventListener('click', saveSettings);
        console.log('Save button event listener added');
    }
    
    const searchInput = document.getElementById('mainSearchInput');
    if (searchInput) {
        searchInput.addEventListener('input', function(e) {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                showSearchSuggestions(e.target.value);
            }, 300);
        });
        
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                hideSearchSuggestions();
                performSearch();
            }
        });
        
        searchInput.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                hideSearchSuggestions();
            }
        });
    }
    
    // Close suggestions when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.search-container')) {
            hideSearchSuggestions();
        }
    });
    
    // Close panels with ESC key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeAllPanels();
        }
    });
    
    // Filter option selection
    const filterOptions = document.querySelectorAll('.filter-option');
    filterOptions.forEach(option => {
        option.addEventListener('click', function() {
            filterOptions.forEach(opt => opt.classList.remove('active'));
            this.classList.add('active');
        });
    });
}

// Toast notification
function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast-notification';
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.remove();
    }, 3000);
}

// Logout function
function logout() {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userFullName');
    localStorage.removeItem('userPhone');
    localStorage.removeItem('userSettings');
    window.location.href = 'Log in.html';
}

// Password visibility toggle
function togglePasswordVisibility() {
    const passwordInput = document.getElementById('settingsPassword');
    const toggleBtn = document.querySelector('.toggle-password');
    
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        toggleBtn.textContent = 'Hide';
    } else {
        passwordInput.type = 'password';
        toggleBtn.textContent = '👁';
    }
}

function toggleModalPassword(inputId) {
    const passwordInput = document.getElementById(inputId);
    const toggleBtn = passwordInput.nextElementSibling;
    
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        toggleBtn.textContent = 'Hide';
    } else {
        passwordInput.type = 'password';
        toggleBtn.textContent = '👁';
    }
}

// Change password modal
function openChangePassword() {
    document.getElementById('passwordModal').style.display = 'flex';
}

function closeChangePassword() {
    document.getElementById('passwordModal').style.display = 'none';
    // Clear fields
    document.getElementById('currentPassword').value = '';
    document.getElementById('newPassword').value = '';
    document.getElementById('confirmPassword').value = '';
    // Reset indicators
    document.getElementById('newPasswordStrength').className = 'password-strength';
    document.getElementById('passwordMatch').className = 'password-match';
}

// Password strength checker
function checkPasswordStrength() {
    const password = document.getElementById('newPassword').value;
    const strengthBar = document.getElementById('newPasswordStrength');
    const requirements = {
        length: document.getElementById('reqLength'),
        upper: document.getElementById('reqUpper'),
        lower: document.getElementById('reqLower'),
        number: document.getElementById('reqNumber'),
        special: document.getElementById('reqSpecial')
    };
    
    // Reset requirements
    Object.values(requirements).forEach(req => {
        req.classList.remove('valid', 'invalid');
    });
    
    // Check requirements
    const hasLength = password.length >= 8;
    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    
    // Update requirement indicators
    if (hasLength) requirements.length.classList.add('valid');
    if (hasUpper) requirements.upper.classList.add('valid');
    if (hasLower) requirements.lower.classList.add('valid');
    if (hasNumber) requirements.number.classList.add('valid');
    if (hasSpecial) requirements.special.classList.add('valid');
    
    // Calculate strength
    let score = 0;
    if (hasLength) score++;
    if (hasUpper) score++;
    if (hasLower) score++;
    if (hasNumber) score++;
    if (hasSpecial) score++;
    
    // Update strength bar
    strengthBar.className = 'password-strength';
    if (score === 0) {
        strengthBar.className = 'password-strength';
    } else if (score <= 2) {
        strengthBar.classList.add('weak');
    } else if (score === 3) {
        strengthBar.classList.add('fair');
    } else if (score === 4) {
        strengthBar.classList.add('good');
    } else {
        strengthBar.classList.add('strong');
    }
    
    return score >= 3; // Minimum 3 requirements met
}

function checkPasswordMatch() {
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const matchIndicator = document.getElementById('passwordMatch');
    
    if (confirmPassword === '') {
        matchIndicator.textContent = '';
        matchIndicator.className = 'password-match';
        return false;
    }
    
    if (newPassword === confirmPassword) {
        matchIndicator.textContent = '✓ Passwords match';
        matchIndicator.className = 'password-match match';
        return true;
    } else {
        matchIndicator.textContent = '✗ Passwords do not match';
        matchIndicator.className = 'password-match mismatch';
        return false;
    }
}

function saveNewPassword() {
    const currentPassword = document.getElementById('currentPassword').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    // Basic validation
    if (!currentPassword) {
        alert('Please enter your current password');
        return;
    }
    
    if (!checkPasswordStrength()) {
        alert('Please choose a stronger password (at least 8 characters with mixed letters and numbers)');
        return;
    }
    
    if (!checkPasswordMatch()) {
        alert('Passwords do not match');
        return;
    }
    
    // In a real app, you would verify current password with server
    // For demo, we'll just save it
    localStorage.setItem('userPassword', newPassword);
    
    // Update the display password field
    document.getElementById('settingsPassword').value = '********';
    
    // Close modal
    closeChangePassword();
    
    // Show success message
    alert('Password changed successfully!');
    showToast('Password updated successfully!');
}

// Phone number formatting
function formatPhoneNumber(input) {
    let value = input.value.replace(/\D/g, '');
    
    if (value.length > 10) {
        // Format as international: +1 (555) 123-4567
        value = value.replace(/^(\d{1})(\d{3})(\d{3})(\d{4}).*/, '+$1 ($2) $3-$4');
    } else if (value.length === 10) {
        // Format as US: (555) 123-4567
        value = value.replace(/^(\d{3})(\d{3})(\d{4}).*/, '($1) $2-$3');
    } else if (value.length === 7) {
        value = value.replace(/^(\d{3})(\d{4}).*/, '$1-$2');
    }
    
    input.value = value;
}

// Close modal on overlay click
document.addEventListener('click', function(e) {
    const modal = document.getElementById('passwordModal');
    if (e.target === modal) {
        closeChangePassword();
    }
});

// Close modal with ESC key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeChangePassword();
    }
});

let currentCountryCode = '+1';

function updateCountryCode() {
    const countrySelect = document.getElementById('countryCode');
    const selectedValue = countrySelect.value;
    const customCodeContainer = document.getElementById('customCodeContainer');
    
    if (selectedValue === 'other') {
        // Show custom country code input
        if (!customCodeContainer) {
            createCustomCodeInput();
        } else {
            customCodeContainer.style.display = 'block';
        }
        currentCountryCode = '+';
    } else {
        // Hide custom input if showing
        if (customCodeContainer) {
            customCodeContainer.style.display = 'none';
        }
        currentCountryCode = selectedValue;
        // Update placeholder based on country
        updatePhonePlaceholder(selectedValue);
    }
}

function createCustomCodeInput() {
    const phoneContainer = document.querySelector('.phone-input-container');
    const customDiv = document.createElement('div');
    customDiv.id = 'customCodeContainer';
    customDiv.className = 'custom-country-code';
    customDiv.innerHTML = `
        <input type="text" id="customCountryCode" placeholder="+63 (Philippines)" 
               oninput="updateCustomCountryCode(this)" maxlength="5">
    `;
    phoneContainer.appendChild(customDiv);
}

function updateCustomCountryCode(input) {
    let value = input.value.replace(/[^\d+]/g, '');
    
    // Ensure it starts with +
    if (!value.startsWith('+')) {
        value = '+' + value.replace(/^\+/, '');
    }
    
    // Limit to reasonable length
    if (value.length > 6) {
        value = value.substring(0, 6);
    }
    
    input.value = value;
    currentCountryCode = value || '+';
}

function updatePhonePlaceholder(countryCode) {
    const phoneInput = document.getElementById('settingsPhone');
    const placeholders = {
        '+1': '555-123-4567',
        '+44': '20 7946 0958',
        '+63': '912 345 6789',
        '+61': '412 345 678',
        '+91': '98765 43210',
        '+81': '90-1234-5678',
        '+86': '131 2345 6789',
        '+33': '1 23 45 67 89',
        '+49': '171 1234567',
        '+34': '612 34 56 78',
        '+55': '11 91234-5678',
        '+7': '912 345-67-89',
        '+82': '10-1234-5678',
        '+65': '9123 4567',
        '+60': '12-345 6789',
        '+971': '50 123 4567',
        '+20': '10 1234 5678',
        '+27': '71 123 4567'
    };
    
    phoneInput.placeholder = placeholders[countryCode] || 'Phone number';
}

function formatPhoneNumber(input) {
    let value = input.value.replace(/\D/g, '');
    
    if (!value) return;
    
    // Different formatting based on country code
    if (currentCountryCode === '+1') {
        // US/Canada format: (555) 123-4567
        if (value.length > 10) value = value.substring(0, 10);
        if (value.length > 6) {
            value = value.replace(/^(\d{3})(\d{3})(\d{0,4}).*/, '($1) $2-$3');
        } else if (value.length > 3) {
            value = value.replace(/^(\d{3})(\d{0,3}).*/, '($1) $2');
        } else if (value.length > 0) {
            value = value.replace(/^(\d{0,3}).*/, '($1');
        }
    } 
    else if (currentCountryCode === '+44') {
        // UK format: 020 7946 0958
        if (value.length > 10) value = value.substring(0, 11);
        if (value.length > 6) {
            value = value.replace(/^(\d{3})(\d{3})(\d{0,4}).*/, '$1 $2 $3');
        } else if (value.length > 3) {
            value = value.replace(/^(\d{3})(\d{0,3}).*/, '$1 $2');
        }
    }
    else if (currentCountryCode === '+63') {
        // Philippines format: 912 345 6789
        if (value.length > 10) value = value.substring(0, 10);
        if (value.length > 6) {
            value = value.replace(/^(\d{3})(\d{3})(\d{0,4}).*/, '$1 $2 $3');
        } else if (value.length > 3) {
            value = value.replace(/^(\d{3})(\d{0,3}).*/, '$1 $2');
        }
    }
    else {
        // Generic international format
        if (value.length > 15) value = value.substring(0, 15);
        // Add spaces every 3 digits
        value = value.replace(/(\d{3})(?=\d)/g, '$1 ');
    }
    
    input.value = value;
}

// Save phone number with country code
function savePhoneNumber() {
    const phoneInput = document.getElementById('settingsPhone');
    const countryCode = currentCountryCode;
    const phoneNumber = phoneInput.value.replace(/\D/g, '');
    
    if (!phoneNumber) {
        return '';
    }
    
    // Return full international number
    return countryCode + phoneNumber;
}

// Load phone number on page load
function loadPhoneNumber() {
    const savedPhone = localStorage.getItem('userPhone') || '+1 (555) 123-4567';
    
    // Parse the saved phone number
    let countryCode = '+1';
    let phoneNumber = '';
    
    // Check if it starts with a country code
    if (savedPhone.startsWith('+')) {
        // Extract country code (1-4 digits after +)
        const match = savedPhone.match(/^\+(\d{1,4})/);
        if (match) {
            countryCode = '+' + match[1];
            phoneNumber = savedPhone.substring(match[0].length);
        }
    } else {
        phoneNumber = savedPhone;
    }
    
    // Clean the phone number
    phoneNumber = phoneNumber.replace(/\D/g, '');
    
    // Set country code
    const countrySelect = document.getElementById('countryCode');
    if (countrySelect) {
        countrySelect.value = countryCode;
        if (countryCode === 'other') {
            updateCountryCode();
            const customInput = document.getElementById('customCountryCode');
            if (customInput) customInput.value = countryCode;
        }
        currentCountryCode = countryCode;
        updatePhonePlaceholder(countryCode);
    }
    
    // Set phone number
    const phoneInput = document.getElementById('settingsPhone');
    if (phoneInput && phoneNumber) {
        // Format based on country code
        phoneInput.value = phoneNumber;
        formatPhoneNumber(phoneInput);
    }
}

// Update your DOMContentLoaded to call loadPhoneNumber
document.addEventListener('DOMContentLoaded', function() {
    // ... existing code ...
    
    // Load phone number with country code
    loadPhoneNumber();
    
});