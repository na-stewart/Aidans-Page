function init(){
  getEntries();
  addSearchFormEventListener();
  addSubscribeFormEventListener();
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

function addSubscribeFormEventListener(){
  document.getElementById('subscribe-form').addEventListener('submit', function(event) {
    event.preventDefault();
    window.location.href = `/register?email=${document.getElementById("email").value}`
  });

}