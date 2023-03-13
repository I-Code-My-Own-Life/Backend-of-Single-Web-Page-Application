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
const registrationForm = document.getElementById('registration-form');
const alertBox = document.getElementById('alert');

// Add an event listener to the form submission
// registrationForm.addEventListener('submit', async (event) => {
//     // Prevent the form from submitting normally
//     event.preventDefault();

//     // Get the form data
//     const formData = new FormData(event.target);

//     // Send the data to the server
//     const response = await fetch('/', {
//         method: 'POST',
//         body: formData
//     });

//     // Parse the response
//     const responseData = await response.json();

//     // Display the response message
//     if (responseData.status === 'success') {
//         alertBox.style.backgroundColor = '#4CAF50';
//         alertBox.innerHTML = '<span class="closebtn" onclick="this.parentElement.style.display=\'none\';">&times;</span> <strong>Success!</strong> User registered.';
//         alertBox.style.display = 'block';
//     } else {
//         // Display an error message
//         alertBox.style.backgroundColor = '#f44336';
//         alertBox.innerHTML = '<span class="closebtn" onclick="this.parentElement.style.display=\'none\';">&times;</span> <strong>Error!</strong> User not registered.';
//         alertBox.style.display = 'block';
//     }

//     // Reset the form
//     event.target.reset();
// });

// Getting something : 



// Frontend code using vanilla JavaScript
// const form = document.querySelector('#registration-form');
// const alertBox = document.querySelector('#alert-box');

// form.addEventListener('submit', (event) => {
//   event.preventDefault(); // prevent default form submission

//   const formData = new FormData(form);
//   const xhr = new XMLHttpRequest();

//   xhr.onreadystatechange = function() {
//     if (this.readyState === XMLHttpRequest.DONE) {
//       if (this.status === 200) {
//         alertBox.innerHTML = '<div class="alert alert-success" role="alert">Registration successful!</div>';
//       } else {
//         alertBox.innerHTML = '<div class="alert alert-danger" role="alert">Registration failed. Please try again later.</div>';
//       }
//     }
//   };

//   xhr.open('POST', '/');
//   xhr.setRequestHeader('Content-Type', 'application/json');
//   xhr.send(JSON.stringify(Object.fromEntries(formData)));
// });


// Backend code
// app.post("/", async (req, res) => {
//     const { name, email, password, age } = req.body;
  
//     try {
//       const saltRounds = 10;
//       const salt = await bcrypt.genSalt(saltRounds);
//       const hashedPassword = await bcrypt.hash(password, salt);
  
//       connection.query(
//         'INSERT INTO information (name, email, password, age) VALUES (?, ?, ?, ?)',
//         [name, email, hashedPassword, age],
//         (error, results) => {
//           if (error) {
//             console.error(error);
//             res.status(500).json({ success: false });
//           } else {
//             res.status(200).json({ success: true });
//           }
//         }
//       );
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ success: false });
//     }
//   });
  