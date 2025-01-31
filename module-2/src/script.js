document.getElementById("worthyForm").addEventListener("submit", function(event) {
    event.preventDefault();
    
    let name = document.getElementById("name").value;
    let role = document.querySelector('input[name="role"]:checked');
    
    if (!name || !role) {
        document.getElementById("feedback").textContent = "Please fill in all required fields!";
        document.getElementById("feedback").style.color = "red";
    } else {
        document.getElementById("feedback").textContent = `Thanks, ${name}! We'll review your application.`;
        document.getElementById("feedback").style.color = "green";
    }
});
