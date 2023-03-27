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

// When someone clicks on the sign up button on frontend page then switch the page to login and register : 
const btnForSignUp = document.getElementById("btnForSignUp");
btnForSignUp.addEventListener("click", () => {
    Switch_page(4);
    window.scrollTo(0, 0);
})
// Registration alert box : 
const alertBox = document.querySelector('.alert');
// Login alert box : 
const alertBoxLogin = document.querySelector('.alertLogin');
// Account info edit alert : 
const alertAccountEdit = document.getElementById("alertAccountEdit");
// Function to close the alert
function closeAlert() {
    alert.style.display = 'none';
}

// Get the registration form 
const form = document.querySelector('#registration-form');

// Adding event listener to registration form : 
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

// Get the login form 
const loginForm = document.querySelector('#login-form');

// Adding event listener to login form : 
loginForm.addEventListener('submit', (event) => {
    event.preventDefault(); // prevent default form submission
    const formData = new FormData(loginForm);

    const xhr = new XMLHttpRequest();
    xhr.open('POST', '/');
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onload = () => {
        if (xhr.status === 200) {
            console.log(xhr.responseText);
            const response = JSON.parse(xhr.responseText);
            if (response.status === 'success') {
                alertBoxLogin.style.display = "block";
                alertBoxLogin.style.backgroundColor = '#f44336';
                alertBoxLogin.innerHTML = '<span class="closebtn" onclick="this.parentElement.style.display=\'none\';">&times;</span> <strong>Success!</strong> User logged in.';
                event.target.reset();
                setTimeout(() => {
                    location.reload();
                }, 1000)
            } else if (response.status === 'wrong_password') {
                alertBoxLogin.style.display = "block";
                alertBoxLogin.style.backgroundColor = '#f44336';
                alertBoxLogin.innerHTML = '<span class="closebtn" onclick="this.parentElement.style.display=\'none\';">&times;</span><strong>Error occured!</strong> Wrong password';
            }
            else if (response.status === 'error') {
                alertBoxLogin.style.display = "block";
                alertBoxLogin.style.backgroundColor = '#f44336';
                alertBoxLogin.innerHTML = '<span class="closebtn" onclick="this.parentElement.style.display=\'none\';">&times;</span><strong>Error occured !</strong> Please try again.';
            } else if (response.status === 'email_does_not_exist') {
                alertBoxLogin.style.display = "block";
                alertBoxLogin.style.backgroundColor = '#f44336';
                alertBoxLogin.innerHTML = '<span class="closebtn" onclick="this.parentElement.style.display=\'none\';">&times;</span><strong>Error!</strong> Email does not exist.';
            }
        } else {
            console.log(xhr.status);
            alertBoxLogin.style.display = "block";
            alertBoxLogin.style.backgroundColor = '#f44336';
            alertBoxLogin.innerHTML = '<span class="closebtn" onclick="this.parentElement.style.display=\'none\';">&times;</span><strong>Error!</strong> Invalid Credentials.';
        }
    };
    xhr.send(JSON.stringify(Object.fromEntries(formData)));
});

// Getting account_info form : 
const account_info_form = document.getElementById("account_info_form");
let updateData = true;
let taskDoneFetched = false;
// Adding event listener to account info edit form : 
account_info_form.addEventListener("submit", (event) => {
    event.preventDefault();
    let formData = new FormData(account_info_form);
    let obj = Object.fromEntries(formData);
    for (const key in obj) {
        if (obj[key] == "") {
            updateData = false;
        }
        else {
            updateData = true;
            break;
        }
    }
    formData = new FormData(account_info_form);
    if (updateData) {
        const xhr = new XMLHttpRequest();
        xhr.open('POST', '/');
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.onload = () => {
            if (xhr.status === 200) {
                const response = JSON.parse(xhr.responseText);
                if (response.status === 'success') {
                    alertAccountEdit.style.display = "block";
                    alertAccountEdit.style.backgroundColor = '#f44336';
                    alertAccountEdit.innerHTML = '<span class="closebtn" onclick="this.parentElement.style.display=\'none\';">&times;</span> <strong>Changes successful!</strong> Please log out and sign in again .';
                    event.target.reset();
                } else if (response.status === 'error') {
                    alertAccountEdit.style.display = "block";
                    alertAccountEdit.style.backgroundColor = '#f44336';
                    alertAccountEdit.innerHTML = '<span class="closebtn" onclick="this.parentElement.style.display=\'none\';">&times;</span> <strong>Email already exists! </strong>Choose another one ';
                } else if (response.status === 'email_already_exists') {
                    alertAccountEdit.style.display = "block";
                    alertAccountEdit.style.backgroundColor = '#f44336';
                    alertAccountEdit.innerHTML = '<span class="closebtn" onclick="this.parentElement.style.display=\'none\';">&times;</span> <strong>Email already exists! </strong>Choose another one ';
                }
            }
            else {
                alertBoxLogin.style.display = "block";
                alertBoxLogin.style.backgroundColor = '#f44336';
                alertBoxLogin.innerHTML = '<span class="closebtn" onclick="this.parentElement.style.display=\'none\';">&times;</span><strong>Error!</strong> Invalid Credentials.';
            }
        };
        obj = Object.fromEntries(formData);
        for (const key in obj) {
            if (obj[key] == "") {
                let inp = document.getElementById(key);
                obj[key] = inp.placeholder;
            }

        }
        xhr.send(JSON.stringify(obj));
    }
    else {
        alertAccountEdit.style.display = "block";
        alertAccountEdit.style.backgroundColor = '#f44336';
        alertAccountEdit.innerHTML = '<span class="closebtn" onclick="this.parentElement.style.display=\'none\';">&times;</span> <strong>Enter the details that you want to change. </strong>';
    }
})

// Handling the task storing management :
// Getting the button to add task in the dashboard page in the home column : 
const addTaskBtnHome = document.getElementById('addTaskBtnHome');
// Getting the button to add task in the dashboard page in the coursework column : 
const addTaskBtnCourse = document.getElementById('addTaskBtnCourse');
// Getting the button to add task in the dashboard page in the exams column : 
const addTaskBtnExam = document.getElementById('addTaskBtnExam');
// Getting the homework task column : 
const homework = document.getElementById("homework");
// Getting the form that stores task description in the database :
const addTaskDBForm = document.getElementById('addTaskDBForm');
// Get the modal element
let modal = document.getElementById("alert-modal");
// Second modal : 
let modal2 = document.getElementById("alert-modal2");
// Get the <span> element that closes the modal
let span = document.getElementsByClassName("close")[0];

let type = "homeTask";
let typeForSavingTaskDone = "homeTask";

let inputTags = document.querySelectorAll('.tasks input');
let inputArray = Array.from(inputTags);

for (let i = 0; i < inputArray.length; i++) {
    let bool;
    if (inputArray[i].name == "1") {
        bool = true;
    }
    else {
        bool = false;
    }
    inputArray[i].checked = bool;
}
// Adding event listeners to open the modal : 
addTaskBtnHome.addEventListener("click", () => {
    type = 'homeTask';
    modal.style.display = "block";
})
addTaskBtnCourse.addEventListener("click", () => {
    type = "courseTask";
    modal.style.display = "block";
})
addTaskBtnExam.addEventListener("click", () => {
    type = "examTask";
    modal.style.display = "block";
})

// Event listener to close the modal : 
span.addEventListener("click", () => {
    // Animation to close the modal : 
    closeModal();
})

// When the user clicks anywhere outside of the modal, close it
window.addEventListener("click", (event) => {
    // Animation to close the modal : 
    if (event.target == modal) {
        closeModal();
    }
})

// Now adding task in the database : 
addTaskDBForm.addEventListener("submit", (event) => {
    event.preventDefault();
    let formData = new FormData(addTaskDBForm);
    let obj = Object.fromEntries(formData);
    obj['type'] = type;
    const xhr = new XMLHttpRequest();
    xhr.open('POST', '/');
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onload = () => {
        if (xhr.status === 200) {
            const response = JSON.parse(xhr.responseText);
            if (response.status === 'success') {
                event.target.reset();
                // Closing the modal : 
                closeModal();
                setTimeout(() => {
                    location.reload();
                }, 500)
            }
            else if (response.status === 'wrong_password') {
                window.alert("There was an error");
            }
        }
        else {
            window.alert("There was an error");
        }
    };
    xhr.send(JSON.stringify(obj));
});

// Function to close the modal : 
function closeModal() {
    modal.classList.remove("fade-in");
    modal.classList.add("fade-out");
    setTimeout(function () {
        modal.style.display = "none";
        modal.classList.remove("fade-out");
    }, 300);
}

function addTask() {
    // First creating the div that will have the label and input tags :
    let div = document.createElement("div");
    div.classList.add("task-elements");
    // Then creating the label and input tags :
    // Label tag :
    let label = document.createElement("label");
    label.innerText = obj.taskDescription;
    // Input tag :
    let input = document.createElement("input");
    input.type = "checkbox";
    // Appending them to the div tag :
    div.appendChild(label);
    div.appendChild(input);
    // Appending the div to the document : 
    homework.appendChild(div);
}

// Now here we are going to save the checkbox input in the database :

const saveTaskDone = document.getElementById("saveTaskDone");

saveTaskDone.addEventListener('click', () => {
    // Displaying the alert : 
    modal2.style.display = "block";
    // Closing the alert after 2 seconds : 
    setTimeout(() => {
        modal2.classList.remove("fade-in");
        modal2.classList.add("fade-out");
        setTimeout(function () {
            modal2.style.display = "none";
            modal2.classList.remove("fade-out");
        }, 300);
    }, 1100)
    // Making alert animation :
    let inputTags = document.querySelectorAll('.tasks input');
    let inputArray = Array.from(inputTags);
    for (let i = 0; i < inputArray.length; i++) {
        inputArray[i] = { id: inputArray[i].value, checked: inputArray[i].checked };
        taskDoneFetched = true;
    }
    let obj = { taskDoneArr: inputArray };
    const xhr = new XMLHttpRequest();
    xhr.open('POST', '/');
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onload = () => {
        if (xhr.status === 200) {
            const response = JSON.parse(xhr.responseText);
            if (response.status === 'success') {
                console.log("Success. The task done variable was inserted successfully.");
            }
            else if (response.status === 'wrong_password') {
                window.alert("There was an error");
            }
        }
        else {
            window.alert("There was an error");
        }
    };
    xhr.send(JSON.stringify(obj));
})

// Grade calculator page javascript : 
// Getting the button to calculate the grade : 
const calculateGrade = document.getElementById('calculateGrade');
let percentage = 0;
let totalMarksObtained = 0
let m = 200;
// Based on the number of test the user inputs, we are going to append more inputs tags of tests in the second question to take input from the user about those tests : 

const numOfSubs = document.getElementById('numOfSubs');
let numOfTestMarks = 0;

numOfSubs.addEventListener("input", (event) => {
    numOfTestMarks = 0;
    calculateGrade.style.bottom = `-${55 + 35}%`
    let quest = document.getElementsByClassName('question')[0];
    quest.style.marginTop = `50px`;
    let numberOfTests = event.target.value;
    let secondQuestion = document.getElementById('secondQuestion');
    let divToAppendto = secondQuestion.lastElementChild;
    divToAppendto.innerHTML = "";
    // We are going to be appending divs according to the number of tests input : 
    for (let i = 0; i < numberOfTests; i++) {
        let divToAppend = document.createElement('div');
        divToAppend.classList.add('testInfo');
        // First child element : 
        let heading1 = document.createElement('h2');
        let pre1 = document.createElement('pre');
        pre1.innerText = ` Test ${i + 1}  --  `;
        heading1.appendChild(pre1);
        // Second child element : 
        let input1 = document.createElement('input');
        input1.classList.add("testInputs");
        input1.type = "text";
        input1.placeholder = "Percent";
        // Third child element : 
        let heading2 = document.createElement('h2');
        let pre2 = document.createElement('pre');
        pre2.innerText = " --  ";
        heading2.appendChild(pre2);
        // Fourth child element : 
        let input2 = document.createElement('input');
        input2.classList.add("testInputs");
        input2.type = "text";
        input2.placeholder = "Marks";
        let arr = [heading1, input1, heading2, input2];
        // Appending all these child in the divToAppend : 
        for (let i = 0; i < arr.length; i++) {
            divToAppend.appendChild(arr[i]);
        }
        divToAppendto.appendChild(divToAppend);
    }

    // Now have to do the same thing for the third question : 
    let thirdQuestion = document.getElementById('thirdQuestion');
    let seconddivToAppendto = thirdQuestion.lastElementChild;
    seconddivToAppendto.innerHTML = "";
    // We are going to be appending divs according to the number of tests input : 
    for (let i = 0; i < numberOfTests; i++) {
        numOfTestMarks++;
        let divToAppend = document.createElement('div');
        divToAppend.classList.add('testInfo');
        // First child element : 
        let heading1 = document.createElement('h2');
        let pre1 = document.createElement('pre');
        pre1.innerText = ` Test ${i + 1}  --  `;
        heading1.appendChild(pre1);
        // Second child element : 
        let input1 = document.createElement('input');
        input1.classList.add("testInputs");
        input1.type = "text";
        input1.placeholder = "Marks";
        let arr = [heading1, input1];
        // Appending all these child in the divToAppend : 
        for (let i = 0; i < arr.length; i++) {
            divToAppend.appendChild(arr[i]);
        }
        seconddivToAppendto.appendChild(divToAppend);
    }
    if (numOfTestMarks <= 5) {
        calculateGrade.style.bottom = `-${60}%`
    }
})

// Getting the alert : 
let modal3 = document.getElementById("alert-modal3");
let modal4 = document.getElementById("alert-modal4");
// Showing the alert when calculating the grade : 
calculateGrade.addEventListener('click', (event) => {
    // Animation to show the alert : 
    modal3.style.display = "block";
    setTimeout(() => {
        modal3.classList.remove("fade-in");
        modal3.classList.add("fade-out");
        setTimeout(function () {
            modal3.style.display = "none";
            modal3.classList.remove("fade-out");
        }, 300);
    }, 1100);
    // Main task (Calculating the grade) :
    percentage = 0;
    totalMarksObtained = 0;
    // Let's first get the obtained marks of the student :
    const marksObtainedInp = document.querySelectorAll('#thirdQuestion input[placeholder="Marks"]');
    for (let i = 0; i < marksObtainedInp.length; i++) {
        totalMarksObtained += Number(marksObtainedInp[i].value);
    }
    // Now, let's get the worth (in percent) of all the tests : 
    const percentInputs = document.querySelectorAll('#secondQuestion input[placeholder="Percent"]');
    for (let i = 0; i < percentInputs.length; i++) {
        percentage += Number(percentInputs[i].value);
    }
    let numberOfTests = Number(numOfSubs.value);
    // At last, let's calcuate the overall grade of the student :
    let overallGradePercent = totalMarksObtained / (percentage * numberOfTests) * 100;
    let grade = "";
    let span = document.getElementById('spanclose');
    span.addEventListener("click", () => {
        modal4.classList.remove("fade-in");
        modal4.classList.add("fade-out");
        setTimeout(function () {
            modal4.style.display = "none";
            modal4.classList.remove("fade-out");
        }, 300);
    })
    setTimeout(() => {
        let h2 = document.querySelector("#alert-modal4 h2");
        let h3 = document.querySelector("#alert-modal4 h3");
        if (overallGradePercent >= 91) {
            modal4.style.display = "block";
            grade = "A+";
        } else if (overallGradePercent >= 90) {
            modal4.style.display = "block";
            grade = "A";
        }
        else if (overallGradePercent >= 80) {
            h2.innerText = "Great !"
            modal4.style.display = "block";
            grade = "B";
        } else if (overallGradePercent >= 70) {
            h2.innerText = "Awesome !"
            modal4.style.display = "block";
            grade = "C";
        } else if (overallGradePercent >= 60) {
            h2.innerText = "That's good !"
            modal4.style.display = "block";
            grade = "D";
        } else {
            h2.innerText = "You need to improve !"
            modal4.style.display = "block";
            grade = "F";
        }
        h3.innerText = `Your grade is ${grade}`;
    }, 1150);
    console.log(overallGradePercent)
})
