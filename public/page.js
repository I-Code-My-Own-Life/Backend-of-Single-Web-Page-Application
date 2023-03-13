const tab_swichers = document.querySelectorAll("[data-switcher]");

for (let i = 0; i < tab_swichers.length; i++) {
    const tab_switcher = tab_swichers[i];
    const page_id = tab_switcher.dataset.tab;
    tab_switcher.addEventListener("click", () => {
        const tab = document.querySelector(".tabs .tab.is-active");
        tab.classList.remove("is-active");
        tab_switcher.parentNode.classList.add("is-active");
        Switch_page(page_id);
    })
}

function Switch_page(id) {
    const currentPage = document.querySelector(".pages .page.is-active");
    currentPage.classList.remove("is-active");
    const nextPage = document.querySelector(`.pages .page[data-page="${id}"]`);
    nextPage.classList.add("is-active");
}

// Get the alert element
const alert = document.querySelector('.alert');

// Function to close the alert
function closeAlert() {
    alert.style.display = 'none';
}

// Get the registration form and alert box
const form = document.querySelector('#registration-form');
const alertBox = document.querySelector('.alert');

// Adding event listener to form : 
// Does work : 

// form.addEventListener('submit', async (event) => {
//     event.preventDefault(); // prevent default form submission

//     const formData = new FormData(form);
//     const xhr = new XMLHttpRequest();

//     xhr.open('POST', '/');
//     xhr.setRequestHeader('Content-Type', 'application/json');
//     xhr.send(JSON.stringify(Object.fromEntries(formData)));

//     xhr.onreadystatechange = function () {
//         if (this.readyState === XMLHttpRequest.DONE) {
//             if (this.status === 200) {
// alertBox.style.display = "block";
// alertBox.style.backgroundColor = '#f44336';
// alertBox.innerHTML = '<span class="closebtn" onclick="this.parentElement.style.display=\'none\';">&times;</span> <strong>Success!</strong> User registered.';
//             } else {
//                 alertBox.style.display = "block";
//                 alertBox.style.backgroundColor = '#f44336';
//                 alertBox.innerHTML = '<span class="closebtn" onclick="this.parentElement.style.display=\'none\';">&times;</span> <strong>Error!</strong> User not registered.';
//             }
//         }
//     };

//     event.target.reset();
// });


// Does not work : 
// form.addEventListener('submit', async (event) => {
//     event.preventDefault();
//     const formData = new FormData(form);
//     const responseData = await fetch('/', {
//         method: 'POST',
//         body: formData
//     });
//     const responseText = await responseData.text();
//     if (responseText === 'Registration successful') {
//         // Display success alert
// alertBox.style.display = "block";
// alertBox.style.backgroundColor = '#f44336';
// alertBox.innerHTML = '<span class="closebtn" onclick="this.parentElement.style.display=\'none\';">&times;</span> <strong>Success!</strong> User registered.';
//         // Reset the form
//         event.target.reset();
//         registerForm.reset();
//     } else if (responseText === 'Email already registered') {
//         alertBox.style.display = "block";
//         alertBox.style.backgroundColor = '#f44336';
//         alertBox.innerHTML = '<span class="closebtn" onclick="this.parentElement.style.display=\'none\';">&times;</span> <strong>Error!</strong> Username already exists.';
//         // Display error alert
//     } else {
//         // Display generic error alert
//         alertBox.style.display = "block";
//         alertBox.style.backgroundColor = '#f44336';
//         alertBox.innerHTML = '<span class="closebtn" onclick="this.parentElement.style.display=\'none\';">&times;</span> <strong>Error occured !</strong>Please try again.';
//     }
// });



form.addEventListener('submit', (event) => {
    event.preventDefault(); // prevent default form submission
    const formData = new FormData(form);

    const xhr = new XMLHttpRequest();
    xhr.open('POST', '/');
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onload = () => {
        if (xhr.status === 200) {
            const response = JSON.parse(xhr.responseText);
            if (response.status === 'success') {
                alertBox.style.display = "block";
                alertBox.style.backgroundColor = '#f44336';
                alertBox.innerHTML = '<span class="closebtn" onclick="this.parentElement.style.display=\'none\';">&times;</span> <strong>Success!</strong> User registered.';
                event.target.reset();
            } else if (response.status === 'error') {
                alertBox.style.display = "block";
                alertBox.style.backgroundColor = '#f44336';
                alertBox.innerHTML = '<span class="closebtn" onclick="this.parentElement.style.display=\'none\';">&times;</span><strong>Error occured!</strong>Please try again.';
            } else if (response.status === 'username_taken') {
                alertBox.style.display = "block";
                alertBox.style.backgroundColor = '#f44336';
                alertBox.innerHTML = '<span class="closebtn" onclick="this.parentElement.style.display=\'none\';">&times;</span><strong>Error!</strong> Email already exists.';
            }
        } else {
            window.alert('Request failed. Please try again.');
        }
    };
    xhr.send(JSON.stringify(Object.fromEntries(formData)));
});
