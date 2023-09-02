
function init(){
  addProfileFormEventListener();
  fillAccountInfo();
}

function addProfileFormEventListener(){
  document.getElementById('profile-form').addEventListener('submit', function(event) {
    event.preventDefault();
    switch(event.submitter.value) {
      case 'Update':
        fetch('/api/v1/account/my', {
          method: 'PUT',
          body: new FormData(this)
        })
        .then(response => {
          if (response.ok) 
            return response.json();
          return Promise.reject(response); 
        })
        .then(json => {
          document.getElementById("response-msg").innerHTML = json.message;
        })
        .catch(error => {
          error.json().then(error => document.getElementById("response-msg").innerHTML = error.message);
        });
      break;
      case 'Delete Account':
        fetch(`/api/v1/account/my`, {
          method: 'DELETE',
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
          error.json().then(error => document.getElementById("response-msg").innerHTML = error.message);
        });
      break;
      default:
        fetch(`/api/v1/logout`, {
          method: 'POST',
        })
        .then(response => {
          if (response.ok) 
            return response.json();
          return Promise.reject(response); 
        })
        .then(json => {
          location.assign("/login?redirect=" + window.location.pathname);
        })
        .catch(error => {
          error.json().then(error => document.getElementById("response-msg").innerHTML = error.message);
        }); 
    }  
  });
}

