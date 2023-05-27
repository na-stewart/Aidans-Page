
function initIndex(){
  getProfile();
  getEntries();
  addSearchFormEventListener();
}

function addSearchFormEventListener(){
  document.getElementById('search-form').addEventListener('submit', function(event) {
    event.preventDefault();
    document.getElementById('page').value = 1;
    getEntries();  
    $(this).closest('.search-popup').removeClass('search-popup--active'); //From script.js
  });
}

function pagination(forward) {
  const pageElement = document.getElementById('page');
  pageElement.value = forward ? parseInt(pageElement.value) + 1 : parseInt(pageElement.value) - 1;
  if (pageElement.value > document.getElementById('total-pages').innerHTML)
    pageElement.value--;
  else if (pageElement.value < 1)
    pageElement.value++;
  else
    getEntries();
}

function parseDateTime(date){
  return new Date(date).toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric'
  })
}

function getEntries() {
  fetch(`api/v1/entry/all/published?page=${document.getElementById('page').value}&search=${document.getElementById('search').value}`, {
    method: 'GET',
  })
  .then(response => {
    if (response.ok) 
      return response.json();
    return Promise.reject(response); 
  })
  .then(json => {
    document.getElementById('total-pages').innerHTML = json.data.total_pages;
    if (json.data.entries.length <= 0) 
      alert('No entries available!')
    else {
      document.getElementById('entries-container').innerHTML = '';
      json.data.entries.forEach(entry => {
        document.getElementById('entries-container').innerHTML +=
          `<div class='blog-post'>
            <div class='blog-post__image'>
              <a href='/entry?id=${entry.id}'><img src='${entry.thumbnail_url}' alt='Thumbnail'></a>
            </div>
            <div class='blog-post__title'>
              <h2><a href='/entry?id=${entry.id}'>${entry.title}</a></h2>
            </div>
            <div class='blog-post__info'>
              <span>
                ${parseDateTime(entry.date_created)}
              </span>
            </div>
            <div class='blog-post__content'>
              <p>${entry.summary}</p>
            </div>
            <div class='blog-post__footer'>
              <a class='blog-post__footer-link' href='/entry?id=${entry.id}'>Read more</a>
            </div>
          </div>`;
      });
    }
  })
  .catch(error => {
    alert("No entries available!");
  });
}

function getEntry() {
  const urlParams = new URLSearchParams(window.location.search);
  fetch(`api/v1/entry/published?id=${urlParams.get('id')}`, {
    method: 'GET',
  })
  .then(response => {
    if (response.ok) 
      return response.json();
    return Promise.reject(response); 
  })
  .then(json => {
    document.getElementById('entry-date').innerHTML = parseDateTime(json.data.date_created);
    document.getElementById('entry-thumbnail').src = json.data.thumbnail_url;
    document.getElementById('entry-title').innerHTML = json.data.title;
    document.getElementById('entry-content').innerHTML = json.data.content;
  })
  .catch(error => {
    alert("Entry not available.");
  });
}

function initContact() {
  getProfile();
  document.getElementById("captcha-img").src = "api/v1/captcha?t=" + new Date().getTime(); 
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
          document.getElementById("captcha-img").src = "api/v1/captcha?t=" + new Date().getTime(); 
          document.getElementById("response-msg").innerHTML = error.message;
        } else 
          document.getElementById("response-msg").innerHTML = "Captcha incorrect."
      });
    });
  });
}

function initProfile(){
  addProfileFormEventListener();
  getProfile();
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
        fetch(`api/v1/account`, {
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
    document.getElementById("email").value = json.data.email;
    document.getElementById("username").value = json.data.username;
  })
  .catch(error => {
    if (window.location.pathname == '/profile')
      window.location.href = '/login';
  });
}