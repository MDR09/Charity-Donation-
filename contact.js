function sendEmail() {
    const name = document.getElementById('name').value;
    const phone = document.getElementById('phone').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;

    // Create a mailto link
    const mailtoLink = `mailto:ngocontact108@gmail.com?subject=Contact Form Submission&body=Name: ${encodeURIComponent(name)}%0D%0APhone: ${encodeURIComponent(phone)}%0D%0AEmail: ${encodeURIComponent(email)}%0D%0AMessage: ${encodeURIComponent(message)}`;

    // Open the default email client
    window.location.href = mailtoLink;

    // Prevent the form from submitting normally
    return false;
}
