function init() {
  getEntry();
  getComments();
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

function getComments() {
    fetch(`api/v1/comment/all/approved?page=${document.getElementById('page').value}}`, {
      method: 'GET',
    })
    .then(response => {
      if (response.ok) 
        return response.json();
      return Promise.reject(response); 
    })
    .then(json => {
      document.getElementById('total-pages').innerHTML = json.data.total_pages;
      if (json.data.comments.length > 0) {
        document.getElementById('comments-container').innerHTML = '';
        json.data.comments.forEach(comment => {
          document.getElementById('comments-container').innerHTML +=
            `<li class="single-post__comments-item">
              <div class="single-post__comments-item-body">
              <div class="single-post__comments-item">
                <div class="single-post__comments-item-info">
                  <div class="single-post__comments-item-info-author">
                    <span>
                      <h5>${comment.author}</h5>
                    </span>
                  </div>
                  <div class="single-post__comments-item-info-date">
                    <span>
                      <h6>${parseDateTime(comment.date_created)}</h6>
                    </span>
                  </div>
                </div>
                <div class="single-post__comments-item-post">
                  <p>${comment.content}</p>
                </div>
              </div>
            </div>
          </li>`;
        });
      }
    })
}
