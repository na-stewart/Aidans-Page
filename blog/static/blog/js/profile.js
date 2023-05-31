
function init(){
  addProfileFormEventListener();
  getProfile();
}

function getProfile(){
  fetch(`api/v1/account/profile`, {
    method: 'GET',
  })
  .then(response => {
    if (response.ok) 
      return response.json();
    return Promise.reject(response); 
  })
  .then(json => {
    document.getElementById("email").value = json.data.account.email;
    document.getElementById("username").value = json.data.account.username;
    document.getElementById("subscribed").checked = json.data.profile.subscribed;
  })
  .catch(error => {
    location.assign("/login");
  });
}

function addProfileFormEventListener(){
  document.getElementById('profile-form').addEventListener('submit', function(event) {
    event.preventDefault();
    switch(event.submitter.value) {
      case 'Update':
        fetch('api/v1/account/profile', {
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
        fetch(`api/v1/account/profile`, {
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
        fetch(`api/v1/logout`, {
          method: 'POST',
        })
        .then(response => {
          if (response.ok) 
            return response.json();
          return Promise.reject(response); 
        })
        .then(json => {
          location.assign("/login");
        })
        .catch(error => {
          error.json().then(error => document.getElementById("response-msg").innerHTML = error.message);
        }); 
    }  
  });
}

