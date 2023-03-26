document.addEventListener("DOMContentLoaded", function() {
  captcha();
});

function login() {
  const loginForm = document.getElementById('login-form');

  fetch('api/v1/login', {
    method: 'POST',
    headers: new Headers({
      'Authorization': 'Basic '+ btoa(loginForm.email.value + ':' + loginForm.password.value), 
      'Content-Type': 'application/x-www-form-urlencoded'
    })
  })
  .then(response => {
    if (response.ok) 
      return response.json();
    return Promise.reject(response); 
  })
  .then(data => {
    alert("Test");
  })
  .catch(error => {
    error.json().then(error => {
      alert(error.message);
    });
  });
  
  return false; // prevent default form submission
}


function register() {
  const registerationForm = document.getElementById("registration-form");

  fetch("api/v1/register", {
    method: "POST",
    body: new FormData(registerationForm)
  }).then(response => {
    if (response.ok) 
      return response.json();
    return Promise.reject(response); 
  })
  .then(data => {
    alert("Test");
  })
  .catch(error => {
    error.json().then(error => {
      alert(error.message);
    });
  });
  
  return false; // prevent default form submission
}

function captcha(){
  document.getElementById("captcha-img").src = "api/v1/captcha?t=" + new Date().getTime(); 
}