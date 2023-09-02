function parseDateTime(date){
  return new Date(date).toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric'
  })
}

function pagination(forward, func) {
  const pageElement = document.getElementById('page');
  pageElement.value = forward ? parseInt(pageElement.value) + 1 : parseInt(pageElement.value) - 1;
  if (pageElement.value > document.getElementById('total-pages').innerHTML)
    pageElement.value--;
  else if (pageElement.value < 1)
    pageElement.value++;
  else
    func();
}

function fillAccountInfo(){
  fetch(`/api/v1/account`, {
    method: 'GET',
  })
  .then(response => {
    if (response.ok) 
      return response.json();
    return Promise.reject(response); 
  })
  .then(json => {
    document.getElementById("email").value = json.data.email;
    document.getElementById("username").value = json.data.username;
  })
  .catch(error => {
    error.json().then(error => {
      if (isAuthTokenInvalid(error) && window.location.pathname == '/profile')
        location.assign("/login?redirect=" + window.location.pathname);
    });
  });
}

function isAuthTokenInvalid(error) {
  return error.data == "JWTDecodeError" || error.data == "ExpiredError" || error.data == "DeactivatedError"
}

fetch(`/test`, {
  method: 'GET',
})
.then(response => {
  if (response.ok) 
    return response.text();
  return Promise.reject(response); 
})
.then(version => {
  document.getElementById('build').innerHTML = `Build: v${version}`;
})