function init() {
  getAccount();
  document.getElementById("captcha-img").src = `api/v1/captcha?t=${new Date().getTime()}`
  addContractFormEventListener();
}

function addContractFormEventListener(){
  document.getElementById("contact-form").addEventListener('submit', function(event) {
    event.preventDefault();
    fetch('api/v1/inquiry', {
      method: 'POST',
      body: new FormData(this)
    })
    .then(response => {
      if (response.ok) 
        return response.json();
      return Promise.reject(response); 
    })
    .then(json => {
      document.getElementById("response-msg").innerHTML = json.message;
      this.reset();
    })
    .catch(error => {
      error.json().then(error => {
        if (error.data != "ChallengeError"){
          document.getElementById("captcha-img").src = `api/v1/captcha?t=${new Date().getTime()}`
          document.getElementById("response-msg").innerHTML = error.message;
        } else 
          document.getElementById("response-msg").innerHTML = "Captcha incorrect."
      });
    });
  });
}