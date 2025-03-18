// Get current date in yyyy-MM-dd format
function getCurrentDate() {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0');
    var yyyy = today.getFullYear();

    return yyyy + '-' + mm + '-' + dd;
}

// Set current date as the value of the feePaidDate field
document.getElementById('feepaiddate').value = getCurrentDate();

// Enable submit button only when all fields are filled
const form = document.querySelector('.form-container');
const submitBtn = document.getElementById('submit-btn');
const inputs = form.querySelectorAll('input[type=text], input[type=number], input[type=date], select');
const dateInput = document.getElementById('feepaiddate');
const classSelect = document.getElementById('class');

inputs.forEach(input => {
    input.addEventListener('input', () => {
        let allFilled = true;
        inputs.forEach(i => {
            if (i.value === '') {
                allFilled = false;
            }
        });
        submitBtn.disabled = !allFilled;
    });
});

// Clear form fields but keep the current date
function clearForm() {
    inputs.forEach(input => {
        if (input !== dateInput) {
            input.value = '';
        }
    });
    dateInput.value = getCurrentDate(); // Reset the date field to current date
    classSelect.selectedIndex = 0; // Keep the class field selected
    submitBtn.disabled = true;
}

// Logging form data before submission
form.addEventListener('submit', (e) => {
    e.preventDefault(); // Prevent default form submission

    // Create FormData object from form
    const formData = new FormData(form);

    // Get the student's first name
    const firstName = formData.get('firstname');

    // Convert FormData to URL-encoded string
    const formDataString = new URLSearchParams(formData).toString();

    // Send form data using Fetch API
    fetch(FORM_ACTION_URL, {
        method: 'POST',
        body: formDataString,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    })
    .then(response => response.text())
    .then(result => {
        // Show alert upon successful submission with the student's first name
        alert(`Form submitted successfully for ${firstName}!`);

        // Clear form fields but keep the current date
        //clearForm();
    })
    .catch(error => {
        console.error('Error submitting form:', error);
    });
});

// Download form data as PDF
function downloadPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    doc.text("ASTRA PRESCHOOL", 10, 10);
    doc.text("5th Cross, Ganesh Temple Road, Sadashiv Nagar", 10, 20);
    doc.text("Tumkur - 572101", 10, 30);
    doc.text("Phone - 9008887230", 10, 40);

    let y = 50;
    inputs.forEach(input => {
        doc.text(`${input.previousElementSibling.textContent}: ${input.value}`, 10, y);
        y += 10;
    });

    doc.save('form-data.pdf');
}
