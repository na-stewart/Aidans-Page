function parseDateTime(date){
  return new Date(date).toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric'
  })
}

function getAccount(){
  fetch(`api/v1/account`, {
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
    if (window.location.pathname == '/profile')
      window.location.href = '/login';
  });
}