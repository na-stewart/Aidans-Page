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
  .then(json => {
    location.assign("/");
  })
  .catch(error => {
    error.json().then(error => {
      document.getElementById("response-msg").innerHTML = error.message;
    });
  });
  
  return false; // prevent default form submission
}


function register() {
  fetch("api/v1/register", {
    method: "POST",
    body: new FormData(document.getElementById("registration-form"))
  }).then(response => {
    if (response.ok) 
      return response.json();
    return Promise.reject(response); 
  })
  .then(json => {
    location.assign("/verify");
  })
  .catch(error => {
    error.json().then(error => {
      document.getElementById("response-msg").innerHTML = error.message;
    });
    captcha();
  });
  
  return false; // prevent default form submission
}

function captcha(){
  document.getElementById("captcha-img").src = "api/v1/captcha?t=" + new Date().getTime(); 
}

function verify() {
  fetch("api/v1/verify-email", {
    method: "POST",
    body: new FormData(document.getElementById("verify-form"))
  }).then(response => {
    if (response.ok) 
      return response.json();
    return Promise.reject(response); 
  })
  .then(json => {
    location.assign("/login");
  })
  .catch(error => {
    error.json().then(error => {
      document.getElementById("response-msg").innerHTML = error.message;
    });
  });
  return false; // prevent default form submission
}

