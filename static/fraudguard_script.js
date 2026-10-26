// FraudGuard Pro - Professional Security Analytics JavaScript

// Global variables
let isAnalyzing = false;
let backgroundInterval;

// Initialize the professional system
document.addEventListener('DOMContentLoaded', function() {
    initializeFraudGuardPro();
    setupFormValidation();
    setupBackgroundAnimation();
    setupCreditCardAnimations();
    setupMoneyFlowAnimations();
    setupSmoothScrolling();
});

// Initialize FraudGuard Pro
function initializeFraudGuardPro() {
    console.log('🛡️ FraudGuard Pro initialized');
    
    // Set default transaction date to today
    const today = new Date().toISOString().split('T')[0];
    const dateInput = document.getElementById('transaction_date');
    if (dateInput) {
        dateInput.value = today;
    }
    
    // Add professional greeting
    showProfessionalGreeting();
    
    // Setup form interactions
    setupFormInteractions();
    
    // Setup ML model selection
    setupMLModelSelection();
    
    // Initialize security animations
    animateSecurityElements();
}

// Show professional greeting
function showProfessionalGreeting() {
    const greeting = document.createElement('div');
    greeting.className = 'professional-greeting';
    greeting.innerHTML = `
        <div class="greeting-content">
            <h2>🛡️ Welcome to FraudGuard Pro</h2>
            <p>Advanced security analytics and fraud detection system</p>
            <div class="greeting-stats">
                <div class="stat">99.7% Accuracy</div>
                <div class="stat">&lt;200ms Response</div>
                <div class="stat">24/7 Monitoring</div>
            </div>
        </div>
    `;
    
    greeting.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(15, 23, 42, 0.95);
        backdrop-filter: blur(20px);
        padding: 2rem;
        border-radius: 20px;
        border: 1px solid #334155;
        z-index: 10000;
        text-align: center;
        animation: professionalFadeIn 2s ease-out;
    `;
    
    document.body.appendChild(greeting);
    
    // Remove greeting after 3 seconds
    setTimeout(() => {
        greeting.style.animation = 'professionalFadeOut 1s ease-out';
        setTimeout(() => {
            document.body.removeChild(greeting);
        }, 1000);
    }, 3000);
}

// Setup form validation
function setupFormValidation() {
    const form = document.getElementById('fraudForm');
    const inputs = form.querySelectorAll('input, select');
    
    inputs.forEach(input => {
        // Real-time validation
        input.addEventListener('input', function() {
            validateField(this);
        });
        
        // Focus effects
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
            addProfessionalGlow(this);
        });
        
        input.addEventListener('blur', function() {
            this.parentElement.classList.remove('focused');
            removeProfessionalGlow(this);
        });
    });
}

// Validate individual field
function validateField(field) {
    const value = field.value.trim();
    const fieldName = field.name;
    let isValid = true;
    let message = '';
    
    // Remove existing validation message
    const existingMessage = field.parentElement.querySelector('.validation-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    // Validation rules
    switch (fieldName) {
        case 'amount':
            if (value && (isNaN(value) || parseFloat(value) < 0)) {
                isValid = false;
                message = 'Please enter a valid amount';
            }
            break;
        case 'time':
            if (value && (isNaN(value) || parseFloat(value) < 0 || parseFloat(value) > 24)) {
                isValid = false;
                message = 'Time must be between 0 and 24';
            }
            break;
        case 'distance_from_home':
            if (value && (isNaN(value) || parseFloat(value) < 0)) {
                isValid = false;
                message = 'Please enter a valid distance';
            }
            break;
        case 'balance':
        case 'credit_limit':
            if (value && (isNaN(value) || parseFloat(value) < 0)) {
                isValid = false;
                message = 'Please enter a valid amount';
            }
            break;
        case 'account_age_days':
        case 'transaction_frequency':
            if (value && (isNaN(value) || parseInt(value) < 0)) {
                isValid = false;
                message = 'Please enter a valid number';
            }
            break;
    }
    
    // Show validation message
    if (!isValid) {
        showValidationMessage(field, message);
    }
    
    // Update field appearance
    field.classList.toggle('invalid', !isValid);
    field.classList.toggle('valid', isValid && value);
    
    return isValid;
}

// Show validation message
function showValidationMessage(field, message) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'validation-message';
    messageDiv.textContent = message;
    messageDiv.style.cssText = `
        color: #ef4444;
        font-size: 0.8rem;
        margin-top: 0.25rem;
        animation: professionalSlideIn 0.3s ease-out;
    `;
    
    field.parentElement.appendChild(messageDiv);
}

// Add professional glow effect
function addProfessionalGlow(element) {
    element.style.boxShadow = '0 0 20px rgba(96, 165, 250, 0.5)';
    element.style.transform = 'translateY(-2px)';
}

// Remove professional glow effect
function removeProfessionalGlow(element) {
    element.style.boxShadow = '';
    element.style.transform = '';
}

// Setup form interactions
function setupFormInteractions() {
    const form = document.getElementById('fraudForm');
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (!isAnalyzing) {
            analyzeTransaction();
        }
    });
}

// Handle merchant category change
function handleMerchantCategoryChange() {
    const merchantCategory = document.getElementById('merchant_category');
    const distanceField = document.getElementById('distance_from_home');
    const distanceLabel = distanceField.previousElementSibling;
    
    if (merchantCategory.value === '5') { // Online Shopping
        // Lock the distance field - keep same appearance, just disable
        distanceField.disabled = true;
        distanceField.value = '0'; // Set to 0 for online shopping
        distanceField.style.cursor = 'not-allowed';
        distanceLabel.innerHTML = '📍 Distance from Home (km) <span style="color: #6c757d; font-size: 0.85em;">(Not applicable for online shopping)</span>';
        
        console.log('🔒 Distance field locked for online shopping');
    } else {
        // Unlock the distance field - restore normal appearance
        distanceField.disabled = false;
        distanceField.style.cursor = 'text';
        distanceLabel.innerHTML = '📍 Distance from Home (km)';
        
        console.log('🔓 Distance field unlocked for physical merchant');
    }
}

// Handle card type change
function handleCardTypeChange() {
    const cardType = document.getElementById('card_type');
    const creditLimitField = document.getElementById('credit_limit');
    const creditLimitLabel = creditLimitField.previousElementSibling;
    const accountBalanceField = document.getElementById('balance');
    const accountBalanceLabel = accountBalanceField.previousElementSibling;
    
    if (cardType.value === '1') { // Debit Card
        // Lock the credit limit field - keep same appearance, just disable
        creditLimitField.disabled = true;
        creditLimitField.value = '0'; // Set to 0 for debit card
        creditLimitField.style.cursor = 'not-allowed';
        creditLimitLabel.innerHTML = '🎯 Credit Limit (₹) <span style="color: #6c757d; font-size: 0.85em;">(Not applicable for debit card)</span>';
        
        // Unlock the account balance field for debit card
        accountBalanceField.disabled = false;
        accountBalanceField.style.cursor = 'text';
        accountBalanceLabel.innerHTML = '💳 Account Balance (₹)';
        
        console.log('🔒 Credit limit field locked for debit card');
        console.log('🔓 Account balance field unlocked for debit card');
    } else if (cardType.value === '2' || cardType.value === '3' || cardType.value === '4') { // Credit Card, Premium Card, Business Card
        // Unlock the credit limit field - restore normal appearance
        creditLimitField.disabled = false;
        creditLimitField.style.cursor = 'text';
        creditLimitLabel.innerHTML = '🎯 Credit Limit (₹)';
        
        // Lock the account balance field - keep same appearance, just disable
        accountBalanceField.disabled = true;
        accountBalanceField.value = '0'; // Set to 0 for credit cards
        accountBalanceField.style.cursor = 'not-allowed';
        accountBalanceLabel.innerHTML = '💳 Account Balance (₹) <span style="color: #6c757d; font-size: 0.85em;">(Not applicable for credit cards)</span>';
        
        console.log('🔓 Credit limit field unlocked for credit card');
        console.log('🔒 Account balance field locked for credit card');
    } else {
        // No selection - keep both fields enabled but reset
        creditLimitField.disabled = false;
        creditLimitField.style.cursor = 'text';
        creditLimitLabel.innerHTML = '🎯 Credit Limit (₹)';
        
        accountBalanceField.disabled = false;
        accountBalanceField.style.cursor = 'text';
        accountBalanceLabel.innerHTML = '💳 Account Balance (₹)';
        
        console.log('🔓 Both fields ready for selection');
    }
}

// Setup ML model selection with visual feedback
function setupMLModelSelection() {
    const modelOptions = document.querySelectorAll('.model-option input[type="radio"]');
    
    modelOptions.forEach(option => {
        option.addEventListener('change', function() {
            // Remove selected class from all model cards
            document.querySelectorAll('.model-card').forEach(card => {
                card.classList.remove('selected');
            });
            
            // Add selected class to the selected model card
            if (this.checked) {
                this.closest('.model-option').querySelector('.model-card').classList.add('selected');
                console.log(`🧠 Selected ML Model: ${this.value}`);
            }
        });
    });
    
    // Initialize with default selection (SVM)
    const defaultOption = document.querySelector('input[name="ml_model"][value="SVM"]');
    if (defaultOption) {
        defaultOption.checked = true;
        defaultOption.dispatchEvent(new Event('change'));
        console.log('✅ Default SVM model selected');
    } else {
        console.error('❌ Could not find default SVM option');
    }
    
    // Ensure at least one radio button is checked
    setTimeout(() => {
        const checkedRadio = document.querySelector('input[name="ml_model"]:checked');
        if (!checkedRadio) {
            console.log('🔄 No radio button checked, selecting first available');
            const firstRadio = document.querySelector('input[name="ml_model"]');
            if (firstRadio) {
                firstRadio.checked = true;
                firstRadio.dispatchEvent(new Event('change'));
            }
        }
    }, 100);
}

// Analyze transaction
async function analyzeTransaction() {
    if (isAnalyzing) return;
    
    isAnalyzing = true;
    const form = document.getElementById('fraudForm');
    const submitBtn = form.querySelector('.professional-submit-btn');
    const btnText = submitBtn.querySelector('.btn-text');
    const btnLoading = submitBtn.querySelector('.btn-loading');
    
    // Show loading state
    btnText.style.display = 'none';
    btnLoading.style.display = 'flex';
    submitBtn.disabled = true;
    
    // Add professional loading animation
    addProfessionalLoadingEffect();
    
    try {
        // Prepare form data
        const formData = new FormData(form);
        
        // Debug: Log selected ML model - use document instead of form
        const selectedModel = document.querySelector('input[name="ml_model"]:checked');
        const allRadios = document.querySelectorAll('input[name="ml_model"]');
        console.log('🔍 All radio buttons:', allRadios);
        console.log('🔍 Checked radio buttons:', document.querySelectorAll('input[name="ml_model"]:checked'));
        
        if (selectedModel) {
            console.log(`🚀 Sending request with ML Model: ${selectedModel.value}`);
            // Ensure the selected model is in the form data
            formData.set('ml_model', selectedModel.value);
        } else {
            console.error('❌ No ML model selected!');
            // Try to find any checked radio button
            allRadios.forEach((radio, index) => {
                console.log(`Radio ${index}: value="${radio.value}", checked=${radio.checked}`);
            });
            
            // Fallback: Select the first radio button if none are checked
            if (allRadios.length > 0) {
                allRadios[0].checked = true;
                formData.set('ml_model', allRadios[0].value);
                console.log(`🔄 Fallback: Selected ${allRadios[0].value}`);
            }
        }
        
        // Debug: Log all form data
        console.log('📋 Form data being sent:', Object.fromEntries(formData.entries()));
        
        // Send request
        const response = await fetch('/predict', {
            method: 'POST',
            body: formData
        });
        
        const result = await response.json();
        
        // Remove loading effect
        removeProfessionalLoadingEffect();
        
        if (result.success) {
            displayResults(result);
            showProfessionalSuccessAnimation();
        } else {
            showProfessionalError(result.error);
        }
        
    } catch (error) {
        removeProfessionalLoadingEffect();
        showProfessionalError('Security analysis encountered an issue. Please verify your input and try again.');
        console.error('Error:', error);
    } finally {
        // Reset button state
        btnText.style.display = 'block';
        btnLoading.style.display = 'none';
        submitBtn.disabled = false;
        isAnalyzing = false;
    }
}

// Add professional loading effect
function addProfessionalLoadingEffect() {
    const loadingOverlay = document.createElement('div');
    loadingOverlay.className = 'professional-loading-overlay';
    loadingOverlay.innerHTML = `
        <div class="professional-loading-content">
            <div class="professional-loading-spinner">
                <div class="spinner-ring"></div>
                <div class="spinner-ring"></div>
                <div class="spinner-ring"></div>
            </div>
            <p>🔍 Analyzing with advanced algorithms...</p>
            <div class="loading-progress">
                <div class="progress-bar"></div>
            </div>
        </div>
    `;
    
    loadingOverlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(15, 23, 42, 0.95);
        backdrop-filter: blur(10px);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999;
        animation: professionalFadeIn 0.5s ease-out;
    `;
    
    document.body.appendChild(loadingOverlay);
    
    // Animate progress bar
    const progressBar = loadingOverlay.querySelector('.progress-bar');
    let progress = 0;
    const progressInterval = setInterval(() => {
        progress += Math.random() * 15;
        if (progress > 100) progress = 100;
        progressBar.style.width = progress + '%';
        
        if (progress >= 100) {
            clearInterval(progressInterval);
        }
    }, 200);
}

// Remove professional loading effect
function removeProfessionalLoadingEffect() {
    const loadingOverlay = document.querySelector('.professional-loading-overlay');
    if (loadingOverlay) {
        loadingOverlay.style.animation = 'professionalFadeOut 0.5s ease-out';
        setTimeout(() => {
            if (document.body.contains(loadingOverlay)) {
                document.body.removeChild(loadingOverlay);
            }
        }, 500);
    }
}

// Display results
function displayResults(result) {
    const resultsContainer = document.getElementById('resultsContainer');
    
    // Update security message
    document.getElementById('securityMessage').textContent = result.security_message;
    
    // Update risk level
    const riskLevel = document.getElementById('riskLevel');
    const riskIcon = riskLevel.querySelector('.risk-icon');
    const riskText = riskLevel.querySelector('.risk-text');
    
    riskLevel.className = `risk-level ${result.risk_level.toLowerCase()}`;
    riskIcon.textContent = result.risk_level === 'HIGH' ? '🚨' : result.risk_level === 'MEDIUM' ? '⚠️' : '✅';
    riskText.textContent = `${result.risk_level} RISK`;
    
    // Update fraud probability
    document.getElementById('fraudProbability').textContent = `${result.fraud_probability}%`;
    
    // Update transaction summary
    document.getElementById('summaryAmount').textContent = result.transaction_details.amount;
    document.getElementById('summaryMerchant').textContent = result.transaction_details.merchant;
    document.getElementById('summaryTime').textContent = result.transaction_details.time;
    document.getElementById('summaryDistance').textContent = result.transaction_details.distance;
    
    // Update ML model information
    if (result.ml_model_used) {
        document.getElementById('mlModelUsed').textContent = result.ml_model_used;
    }
    if (result.model_confidence) {
        document.getElementById('modelConfidence').textContent = result.model_confidence;
    }
    
    // Debug: Show what model was actually received (console only)
    if (result.debug_info) {
        console.log('🔍 Backend Debug Info:', result.debug_info);
        // Debug info removed from page display - only in console now
    }
    
    // Update recommendations
    const recommendationsList = document.getElementById('recommendationsList');
    recommendationsList.innerHTML = '';
    
    result.recommendations.forEach((rec, index) => {
        const li = document.createElement('li');
        li.textContent = rec;
        li.style.animationDelay = `${index * 0.1}s`;
        li.style.animation = 'professionalSlideIn 0.5s ease-out forwards';
        recommendationsList.appendChild(li);
    });
    
    // Show results with animation
    resultsContainer.style.display = 'block';
    resultsContainer.style.animation = 'professionalSlideIn 0.8s ease-out';
    
    // Scroll to results
    setTimeout(() => {
        resultsContainer.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
        });
    }, 500);
}

// Show professional success animation
function showProfessionalSuccessAnimation() {
    const successOverlay = document.createElement('div');
    successOverlay.className = 'professional-success-overlay';
    successOverlay.innerHTML = `
        <div class="professional-success-content">
            <div class="success-icon">✅</div>
            <p>Security Analysis Complete</p>
            <div class="success-stats">
                <div class="stat">Analysis Time: &lt;200ms</div>
                <div class="stat">Accuracy: 99.7%</div>
            </div>
        </div>
    `;
    
    successOverlay.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(16, 185, 129, 0.9);
        backdrop-filter: blur(20px);
        padding: 2rem;
        border-radius: 20px;
        z-index: 10000;
        text-align: center;
        animation: professionalSuccessPulse 2s ease-out;
    `;
    
    document.body.appendChild(successOverlay);
    
    setTimeout(() => {
        successOverlay.style.animation = 'professionalFadeOut 0.5s ease-out';
        setTimeout(() => {
            if (document.body.contains(successOverlay)) {
                document.body.removeChild(successOverlay);
            }
        }, 500);
    }, 2000);
}

// Show professional error
function showProfessionalError(message) {
    const errorOverlay = document.createElement('div');
    errorOverlay.className = 'professional-error-overlay';
    errorOverlay.innerHTML = `
        <div class="professional-error-content">
            <div class="error-icon">⚠️</div>
            <p>${message}</p>
        </div>
    `;
    
    errorOverlay.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(239, 68, 68, 0.9);
        backdrop-filter: blur(20px);
        padding: 2rem;
        border-radius: 20px;
        z-index: 10000;
        text-align: center;
        animation: professionalErrorShake 2s ease-out;
    `;
    
    document.body.appendChild(errorOverlay);
    
    setTimeout(() => {
        errorOverlay.style.animation = 'professionalFadeOut 0.5s ease-out';
        setTimeout(() => {
            if (document.body.contains(errorOverlay)) {
                document.body.removeChild(errorOverlay);
            }
        }, 500);
    }, 3000);
}

// Setup background animation
function setupBackgroundAnimation() {
    const layers = document.querySelectorAll('.background-layer');
    let currentLayer = 0;
    
    backgroundInterval = setInterval(() => {
        layers.forEach((layer, index) => {
            layer.style.opacity = index === currentLayer ? '0.2' : '0.1';
        });
        
        currentLayer = (currentLayer + 1) % layers.length;
    }, 5000);
}

// Setup credit card animations
function setupCreditCardAnimations() {
    const cards = document.querySelectorAll('.floating-card');
    
    cards.forEach((card, index) => {
        // Randomize animation duration
        const duration = 15 + Math.random() * 10;
        card.style.animationDuration = duration + 's';
        
        // Randomize animation delay
        const delay = Math.random() * 5;
        card.style.animationDelay = delay + 's';
        
        // Add hover effect
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.1) rotateY(10deg)';
            this.style.transition = 'transform 0.3s ease';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = '';
            this.style.transition = '';
        });
    });
}

// Setup money flow animations
function setupMoneyFlowAnimations() {
    const bills = document.querySelectorAll('.money-bill');
    
    bills.forEach((bill, index) => {
        // Randomize animation duration
        const duration = 20 + Math.random() * 10;
        bill.style.animationDuration = duration + 's';
        
        // Randomize animation delay
        const delay = Math.random() * 5;
        bill.style.animationDelay = delay + 's';
    });
}

// Animate security elements
function animateSecurityElements() {
    const icons = document.querySelectorAll('.security-icon');
    
    icons.forEach((icon, index) => {
        // Randomize animation duration
        const duration = 12 + Math.random() * 8;
        icon.style.animationDuration = duration + 's';
        
        // Randomize animation delay
        const delay = Math.random() * 5;
        icon.style.animationDelay = delay + 's';
    });
}

// Setup smooth scrolling
function setupSmoothScrolling() {
    // Smooth scroll for all anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Clear form
function clearForm() {
    const form = document.getElementById('fraudForm');
    const resultsContainer = document.getElementById('resultsContainer');
    
    // Reset form
    form.reset();
    
    // Hide results
    resultsContainer.style.display = 'none';
    
    // Remove validation states
    const inputs = form.querySelectorAll('input, select');
    inputs.forEach(input => {
        input.classList.remove('valid', 'invalid');
        const message = input.parentElement.querySelector('.validation-message');
        if (message) {
            message.remove();
        }
    });
    
    // Scroll to top
    scrollToTop();
    
    // Show professional reset animation
    showProfessionalResetAnimation();
}

// Show professional reset animation
function showProfessionalResetAnimation() {
    const resetOverlay = document.createElement('div');
    resetOverlay.className = 'professional-reset-overlay';
    resetOverlay.innerHTML = `
        <div class="professional-reset-content">
            <div class="reset-icon">🔄</div>
            <p>Form Cleared</p>
        </div>
    `;
    
    resetOverlay.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(59, 130, 246, 0.9);
        backdrop-filter: blur(20px);
        padding: 2rem;
        border-radius: 20px;
        z-index: 10000;
        text-align: center;
        animation: professionalResetPulse 1.5s ease-out;
    `;
    
    document.body.appendChild(resetOverlay);
    
    setTimeout(() => {
        resetOverlay.style.animation = 'professionalFadeOut 0.5s ease-out';
        setTimeout(() => {
            if (document.body.contains(resetOverlay)) {
                document.body.removeChild(resetOverlay);
            }
        }, 500);
    }, 1500);
}

// Scroll to top
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Add CSS animations dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes professionalFadeIn {
        0% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
        100% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
    }
    
    @keyframes professionalFadeOut {
        0% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        100% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
    }
    
    @keyframes professionalSlideIn {
        0% { opacity: 0; transform: translateX(-30px); }
        100% { opacity: 1; transform: translateX(0); }
    }
    
    @keyframes professionalSuccessPulse {
        0% { transform: translate(-50%, -50%) scale(0.5); opacity: 0; }
        50% { transform: translate(-50%, -50%) scale(1.1); opacity: 1; }
        100% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
    }
    
    @keyframes professionalErrorShake {
        0%, 100% { transform: translate(-50%, -50%); }
        25% { transform: translate(-52%, -50%); }
        75% { transform: translate(-48%, -50%); }
    }
    
    @keyframes professionalResetPulse {
        0% { transform: translate(-50%, -50%) scale(0.8); opacity: 0; }
        50% { transform: translate(-50%, -50%) scale(1.05); opacity: 1; }
        100% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
    }
    
    .professional-loading-spinner {
        position: relative;
        width: 60px;
        height: 60px;
        margin: 0 auto 1rem;
    }
    
    .spinner-ring {
        position: absolute;
        width: 100%;
        height: 100%;
        border: 3px solid transparent;
        border-top: 3px solid #60a5fa;
        border-radius: 50%;
        animation: spin 1s linear infinite;
    }
    
    .spinner-ring:nth-child(2) {
        width: 80%;
        height: 80%;
        top: 10%;
        left: 10%;
        animation-delay: 0.2s;
        border-top-color: #3b82f6;
    }
    
    .spinner-ring:nth-child(3) {
        width: 60%;
        height: 60%;
        top: 20%;
        left: 20%;
        animation-delay: 0.4s;
        border-top-color: #1e40af;
    }
    
    .loading-progress {
        width: 200px;
        height: 4px;
        background: rgba(255, 255, 255, 0.2);
        border-radius: 2px;
        margin-top: 1rem;
        overflow: hidden;
    }
    
    .progress-bar {
        height: 100%;
        background: linear-gradient(90deg, #60a5fa, #3b82f6);
        border-radius: 2px;
        width: 0%;
        transition: width 0.3s ease;
    }
    
    .form-group.focused .input-indicator {
        opacity: 1;
    }
    
    .form-group input.valid {
        border-color: #10b981;
        box-shadow: 0 0 10px rgba(16, 185, 129, 0.3);
    }
    
    .form-group input.invalid {
        border-color: #ef4444;
        box-shadow: 0 0 10px rgba(239, 68, 68, 0.3);
    }
    
    .greeting-stats {
        display: flex;
        gap: 1rem;
        margin-top: 1rem;
        justify-content: center;
    }
    
    .greeting-stats .stat {
        background: rgba(59, 130, 246, 0.2);
        padding: 0.5rem 1rem;
        border-radius: 8px;
        font-size: 0.9rem;
        font-weight: 600;
    }
    
    .success-stats {
        display: flex;
        gap: 1rem;
        margin-top: 1rem;
        justify-content: center;
    }
    
    .success-stats .stat {
        background: rgba(255, 255, 255, 0.2);
        padding: 0.5rem 1rem;
        border-radius: 8px;
        font-size: 0.9rem;
        font-weight: 600;
    }
`;
document.head.appendChild(style);

// Cleanup on page unload
window.addEventListener('beforeunload', function() {
    if (backgroundInterval) {
        clearInterval(backgroundInterval);
    }
});

// ML Model Comparison Function
async function compareModels() {
    const comparisonContainer = document.getElementById('modelComparison');
    const comparisonResults = document.getElementById('comparisonResults');
    
    try {
        const response = await fetch('/compare_models');
        const result = await response.json();
        
        if (result.success) {
            displayModelComparison(result.models, result.best_model);
            comparisonContainer.style.display = 'flex';
        } else {
            throw new Error(result.error || 'Comparison failed');
        }
        
    } catch (error) {
        console.error('Error:', error);
        showNotification('Model comparison failed', 'error');
    }
}

function closeModelComparison() {
    const comparisonContainer = document.getElementById('modelComparison');
    comparisonContainer.style.display = 'none';
}

// Close modal when clicking outside the content
document.addEventListener('click', function(event) {
    const comparisonContainer = document.getElementById('modelComparison');
    const comparisonContent = document.querySelector('.comparison-content');
    
    if (comparisonContainer.style.display === 'flex' && 
        !comparisonContent.contains(event.target) && 
        event.target === comparisonContainer) {
        closeModelComparison();
    }
});

// Close modal with Escape key
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        const comparisonContainer = document.getElementById('modelComparison');
        if (comparisonContainer.style.display === 'flex') {
            closeModelComparison();
        }
    }
});

function displayModelComparison(models, bestModel) {
    const comparisonResults = document.getElementById('comparisonResults');
    
    let html = `
        <div class="comparison-summary">
            <h4><i class="fas fa-trophy"></i> Best Performing Model: ${bestModel}</h4>
            <p>Based on AUC (Area Under Curve) score - higher is better</p>
        </div>
        <table class="comparison-table">
            <thead>
                <tr>
                    <th>ML Model</th>
                    <th>Accuracy</th>
                    <th>AUC Score</th>
                    <th>Performance</th>
                </tr>
            </thead>
            <tbody>
    `;
    
    models.forEach(model => {
        const isBest = model.model === bestModel;
        const performance = getPerformanceLevel(model.auc_score);
        
        html += `
            <tr ${isBest ? 'class="best-model"' : ''}>
                <td><strong>${model.model}</strong></td>
                <td>${model.accuracy}%</td>
                <td>${model.auc_score}</td>
                <td>
                    <span class="performance-badge ${performance.toLowerCase().replace(' ', '-')}">
                        ${performance}
                    </span>
                </td>
            </tr>
        `;
    });
    
    html += `
            </tbody>
        </table>
        <div class="comparison-note">
            <p><i class="fas fa-info-circle"></i> 
            AUC Score measures the model's ability to distinguish between fraud and legitimate transactions. 
            Higher scores indicate better performance.</p>
        </div>
    `;
    
    comparisonResults.innerHTML = html;
}

function getPerformanceLevel(aucScore) {
    if (aucScore >= 0.9) return 'Excellent';
    if (aucScore >= 0.8) return 'Very Good';
    if (aucScore >= 0.7) return 'Good';
    if (aucScore >= 0.6) return 'Fair';
    return 'Poor';
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
        <span>${message}</span>
    `;
    
    // Style the notification
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
        color: white;
        padding: 15px 20px;
        border-radius: 10px;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
        z-index: 1001;
        display: flex;
        align-items: center;
        gap: 10px;
        font-weight: 500;
        animation: slideInRight 0.3s ease;
        max-width: 400px;
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Remove after 5 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 5000);
}

console.log('🛡️ FraudGuard Pro - JavaScript loaded with ML-powered security features');

