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

document.getElementById('search-form').addEventListener('submit', function(event) {
  event.preventDefault();
  document.getElementById('page').value = 1;
  getEntries();  
  $(this).closest('.search-popup').removeClass('search-popup--active'); //From script.js
  return false;
});

function getEntries(args) {
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
                ${new Date(entry.date_created).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </span>
              <span><a href='#'>0 Comments</a></span>
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
    document.getElementById('entry-date').innerHTML = new Date(json.data.date_created).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
    document.getElementById('entry-thumbnail').src = json.data.thumbnail_url
    document.getElementById('entry-title').innerHTML = json.data.title
    document.getElementById('entry-content').innerHTML = json.data.content;
  })
  .catch(error => {
    alert("Entry not available.");
  });
}

function getProfile(){
  fetch(`api/v1/profile`, {
    method: 'GET',
  })
  .then(response => {
    if (response.ok) 
      return response.json();
    return Promise.reject(response); 
  })
  .then(json => {
    
  })
  .catch(error => {
    window.location.href = '/login';
  });

}