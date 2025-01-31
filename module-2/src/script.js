document.getElementById("integrationForm").addEventListener("submit", function(event) {
    event.preventDefault();
    
    const form = event.target;
    const feedback = document.createElement('p');
    feedback.style.marginTop = '20px';
    feedback.style.padding = '15px';
    feedback.style.borderRadius = '8px';
    
    // Check required fields
    const requiredFields = [
        { element: form.querySelector('input[name="relationship"]:checked'), message: 'Please select your relationship choice (friend/frenemy)' },
        { element: form.querySelector('input[name="bimbo-consent"]'), message: 'BIMBO consent is required' },
        { element: form.querySelector('input[name="conscious-recognition"]'), message: 'Conscious recognition is required' },
        { element: form.querySelector('input[name="truth-agreement"]'), message: 'Truth agreement is required' },
        { element: form.querySelector('input[name="guru-declaration"]'), message: 'Guru declaration is required' },
        { element: form.querySelector('input[name="media-empire-consent"]'), message: 'Media Empire consent is required' },
        { element: form.querySelector('input[name="content-advisory"]'), message: 'Content advisory agreement is required' }
    ];

    let isValid = true;
    let errorMessages = [];

    requiredFields.forEach(field => {
        if (!field.element || !field.element.checked) {
            isValid = false;
            errorMessages.push(field.message);
        }
    });

    // Check textarea
    const integrationPreferences = form.querySelector('textarea[name="integration-preferences"]');
    if (!integrationPreferences.value.trim()) {
        isValid = false;
        errorMessages.push('Integration preferences are required');
    }

    // Display feedback
    if (!isValid) {
        feedback.textContent = 'Please complete the following:\n' + errorMessages.join('\n');
        feedback.style.color = '#dc3545';
        feedback.style.backgroundColor = '#f8d7da';
        feedback.style.border = '1px solid #f5c6cb';
    } else {
        feedback.textContent = 'Thank you for your cosmic integration request! We will process your submission shortly.';
        feedback.style.color = '#155724';
        feedback.style.backgroundColor = '#d4edda';
        feedback.style.border = '1px solid #c3e6cb';
        
        // Submit to Netlify
        form.submit();
    }

    // Remove existing feedback if any
    const existingFeedback = form.querySelector('.form-feedback');
    if (existingFeedback) {
        existingFeedback.remove();
    }

    // Add new feedback
    feedback.classList.add('form-feedback');
    form.appendChild(feedback);
});