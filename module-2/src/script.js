document.addEventListener('DOMContentLoaded', function() {
    // Function to hide the overlay
    window.hideWarning = function() {
        document.querySelector('.warning-overlay').style.display = 'none';
        document.querySelector('.warning-button').style.display = 'none';

        console.log('Twitter widget loaded successfully hide');

    };

    // Function to ensure the Twitter widget loads correctly
    window.onTwitterLoad = function() {
        // Force a resize event to make sure the Twitter widget adjusts to the container
        window.dispatchEvent(new Event('resize'));
        // Log that Twitter widget has loaded
        console.log('Twitter widget loaded successfully resize');
    };
});

document.getElementById("integrationForm").addEventListener("submit", function(event) {
    event.preventDefault();
    const form = event.target;
    const feedback = document.createElement('div');
    
    // Clear existing feedback
    const existingFeedback = form.querySelector('.form-feedback');
    if (existingFeedback) existingFeedback.remove();

    // Validate all required fields
    const requiredFields = [
        // Original fields
        { element: form.querySelector('input[name="relationship"]:checked'), message: 'Relationship choice required' },
        { element: form.querySelector('input[name="bimbo-consent"]'), message: 'BIMBO consent required' },
        { element: form.querySelector('input[name="conscious-recognition"]'), message: 'Conscious recognition required' },
        { element: form.querySelector('input[name="truth-agreement"]'), message: 'Truth agreement required' },
        { element: form.querySelector('input[name="guru-declaration"]'), message: 'Guru declaration required' },
        { element: form.querySelector('input[name="media-empire-consent"]'), message: 'Media Empire consent required' },
        { element: form.querySelector('input[name="content-advisory"]'), message: 'Content advisory required' },
        
        // New fields
        { element: form.querySelector('select[name="universe-identity"]'), message: 'Identity selection required', check: (el) => el.value !== "" },
        { element: form.querySelector('textarea[name="backstory"]'), message: 'Backstory required', check: (el) => el.value.trim() !== "" },
        { element: form.querySelector('input[name="calendar-acknowledgement"]'), message: 'Calendar deprecation required' }
    ];

    let isValid = true;
    let errorMessages = [];

    requiredFields.forEach(field => {
        const element = field.element;
        let valid = false;
        
        if (field.check) {
            valid = field.check(element);
        } else if (element.type === 'checkbox' || element.type === 'radio') {
            valid = element.checked;
        } else {
            valid = element.value.trim() !== '';
        }

        if (!valid) {
            isValid = false;
            errorMessages.push(field.message);
            element.closest('fieldset').classList.add('validation-error');
        } else {
            element.closest('fieldset')?.classList.remove('validation-error');
        }
    });

    // Special validation for energy selection
    const energySelected = [...form.querySelectorAll('input[name="energy[]"]:checked')].length > 0;
    if (!energySelected) {
        errorMessages.push('At least one energy type must be selected');
        isValid = false;
    }

    // Handle validation feedback
    if (!isValid) {
        feedback.innerHTML = `
            <div class="error-feedback">
                <h3>Completion Required:</h3>
                <ul>${errorMessages.map(msg => `<li>${msg}</li>`).join('')}</ul>
            </div>
        `;
    } else {
        // Prepare Netlify submission
        const formData = new FormData(form);
        
        // Add hidden date field
        const dateField = document.createElement('input');
        dateField.type = 'hidden';
        dateField.name = 'gregorian-end-date';
        dateField.value = document.getElementById('endOfGregorian').textContent;
        form.appendChild(dateField);

        // Submit to Netlify
        fetch('/', {
            method: 'POST',
            body: new URLSearchParams(formData),
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        })
        .then(() => window.location = '/success.html')
        .catch(error => {
            feedback.innerHTML = `<div class="error-feedback">Submission failed: ${error.message}</div>`;
        });
    }

    // Display feedback
    feedback.classList.add('form-feedback');
    form.parentNode.insertBefore(feedback, form.nextSibling);
});