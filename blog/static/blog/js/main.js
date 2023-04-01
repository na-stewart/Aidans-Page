function pagination(forward) {
  const pageElement = document.getElementById("page");
  pageElement.value = forward ? pageElement.value++ : pageElement.value--;
  if (pageElement.value > document.getElementById("total-pages").innerHTML)
    pageElement.value--;
  else if (pageElement.value < 1)
    pageElement.value++;
  else
    getEntries(`page=${pageElement.value}`);
}

function getEntries(args) {
  fetch(`api/v1/entry/all/published?${args}`, {
    method: 'GET',
  })
  .then(response => {
    if (response.ok) 
      return response.json();
    return Promise.reject(response); 
  })
  .then(json => {
    document.getElementById("total-pages").innerHTML = json.data.total_pages;
    if (json.data.entries.length <= 0) 
      alert("No entries available on this page.")
    else {
      document.getElementById("entries-container").innerHTML = "";
      json.data.entries.forEach(entry => {
        document.getElementById("entries-container").innerHTML +=
          `<div class="blog-post">
            <div class="blog-post__image">
              <a href="/entry?id=${entry.id}"><img src="${entry.thumbnail_url}" alt="Thumbnail"></a>
            </div>
            <div class="blog-post__title">
              <h2><a href="/entry?id=${entry.id}">${entry.title}</a></h2>
            </div>
            <div class="blog-post__info">
              <span>By ${entry.author.username}</span>
              <span>
                ${new Date(entry.date_created).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </span>
              <span><a href="#">0 Comments</a></span>
            </div>
            <div class="blog-post__content">
              <p>${entry.summary}</p>
            </div>
            <div class="blog-post__footer">
              <a class="blog-post__footer-link" href="/entry?id=${entry.id}">Read more</a>
            </div>
          </div>`;
      });
    }
  })
  .catch(error => {
    alert(error.message);
  });
}

function getEntry() {
  const urlParams = new URLSearchParams(window.location.search);
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
    document.getElementById("author").innerHTML =  `Written by ${json.data.author.username}`;
  })
  .catch(error => {
    alert(error.message);
  });
}
