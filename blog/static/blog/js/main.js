
const url = window.location.search;
const urlParams = new URLSearchParams(url);

function getEntry() {
  fetch(`api/v1/entry/published?id=${urlParams.get("id")}`, {
    method: 'GET',
  })
  .then(response => {
    if (response.ok) 
      return response.json();
    return Promise.reject(response); 
  })
  .then(json => {
    document.getElementById("entry-date").innerHTML = new Date(json.data.date_created).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
    document.getElementById("entry-thumbnail").src = json.data.thumbnail_url
    document.getElementById("entry-title").innerHTML = json.data.title
    document.getElementById("entry-content").innerHTML = json.data.content;
    document.getElementById("author").innerHTML =  `Written by ${json.data.author}`;
  })
  .catch(error => {
    alert(error.message);
  });
}


function getEntries() {
  localStorage.clear();
  fetch(`api/v1/entry/all/published?page=${urlParams.get("page")}`, {
    method: 'GET',
  })
  .then(response => {
    if (response.ok) 
      return response.json();
    return Promise.reject(response); 
  })
  .then(json => {
    json.data.entries.forEach(entry => {
      const dateCreated = new Date(entry.date_created).toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
      document.getElementById("entries-container").innerHTML +=
        `<div class="blog-post">
          <div class="blog-post__image">
            <a href="/entry/published?id=${entry.id}"><img src="${entry.thumbnail_url}" alt="Thumbnail"></a>
          </div>
          <div class="blog-post__title">
            <h2><a href="/entry/published?id=${entry.id}">${entry.title}</a></h2>
          </div>
          <div class="blog-post__info">
            <span>By ${entry.author}</span>
            <span>
              ${dateCreated}
            </span>
            <span><a href="#">0 Comments</a></span>
          </div>
          <div class="blog-post__content">
            <p>${entry.summary}</p>
          </div>
          <div class="blog-post__footer">
            <a class="blog-post__footer-link" href="/entry/published?id=${entry.id}">Read more</a>
          </div>
        </div>`;
    });
  })
  .catch(error => {
    alert(error.message);
  });
}
