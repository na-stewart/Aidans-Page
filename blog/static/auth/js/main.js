const urlParams = new URLSearchParams(window.location.search);

function addLoginFormEventListener() {
  document.getElementById('login-form').addEventListener('submit', function(event){
    event.preventDefault();
    document.getElementById("response-msg").innerHTML = "Please wait..."
    fetch('api/v1/login', {
      method: 'POST',
      headers: new Headers({
        'Authorization': 'Basic '+ btoa(this.email.value + ':' + this.password.value), 
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
        if (error.data == "UnverifiedError") {
          location.assign("/verify");
        } 
      });
    });
  });
}

function addRegisterFormEventListener() {
  document.getElementById('register-form').addEventListener('submit', function(event) {
    event.preventDefault();
    fetch('api/v1/register', {
      method: "POST",
      body: new FormData(this)
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
        if (error.data != "ChallengeError"){
          document.getElementById("captcha-img").src = "api/v1/captcha?t=" + new Date().getTime(); 
          document.getElementById("response-msg").innerHTML = error.message;
        } else 
          document.getElementById("response-msg").innerHTML = "Captcha incorrect."
      });
    });
  });
}

function addVerifyFormEventListener(event) {
  document.getElementById('verify-form').addEventListener('submit', function(event) {
    event.preventDefault();
    fetch("api/v1/verify-email", {
      method: "POST",
      body: new FormData(this)
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
        if (error.data == "MaxedOutChallengeError") 
          document.getElementById("response-msg").innerHTML = "Session expired. Please login and try again.";
        else
          document.getElementById("response-msg").innerHTML = error.message;
      });
    });
  });
}



function initRegister() {
  document.getElementById("captcha-img").src = "api/v1/captcha?t=" + new Date().getTime(); 
  if (urlParams.get("email") != null) {
    document.getElementById("email").value = urlParams.get("email");
    document.getElementById("username").value = urlParams.get("email").substring(0, urlParams.get("email").indexOf("@"));
  }
  addRegisterFormEventListener();
}

