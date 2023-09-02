function init() {
  getEntry();
  getComments();
  addCommentFormEventListener();
}

function getEntry() {
  const urlParams = new URLSearchParams(window.location.search);
  fetch(`/api/v1/entry/published?id=${urlParams.get('id')}`, {
    method: 'GET',
  })
  .then(response => {
    if (response.ok) 
      return response.json();
    return Promise.reject(response); 
  })
  .then(json => {
    document.title = json.data.title;
    document.getElementById('entry-date').innerHTML = parseDateTime(json.data.date_created);
    document.getElementById('entry-thumbnail').src = json.data.thumbnail_url;
    document.getElementById('entry-title').innerHTML = json.data.title;
    document.getElementById('entry-content').innerHTML = json.data.content;
  })
  .catch(error => {
    alert("Entry not available.");
  });
}

function appendCommentElement(comment) {
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
        <p style="word-wrap: break-word;">${comment.content}</p>
      </div>
    </div>
  </div>
</li>
`;

}

function getComments() {
    const urlParams = new URLSearchParams(window.location.search);
    fetch(`/api/v1/comment/all/approved?entry=${urlParams.get('id')}&page=${document.getElementById('page').value}`, {
      method: 'GET',
    })
    .then(response => {
      if (response.ok) 
        return response.json();
      return Promise.reject(response); 
    })
    .then(json => {
      document.getElementById('total-comments').innerHTML = `${json.data.total_comments} Comment(s)`
      if (json.data.total_pages < 0)
        document.getElementById('total-pages').innerHTML = json.data.total_pages;
      if (json.data.comments.length > 0) {
        document.getElementById('comments-container').innerHTML = '';
        json.data.comments.forEach(comment => {
          appendCommentElement(comment);
        });
      }
    })
}


function addCommentFormEventListener(){
  const urlParams = new URLSearchParams(window.location.search);
  document.getElementById("comment-form").addEventListener('submit', function(event) {
    event.preventDefault();
    fetch(`/api/v1/comment/publish?entry=${urlParams.get("id")}`, {
      method: 'POST',
      body: new FormData(this),
    })
    .then(response => {
      if (response.ok) 
        return response.json();
      return Promise.reject(response); 
    })
    .then(json => {
      appendCommentElement(json.data);
      this.reset();
    })
    .catch(error => {
      error.json().then(error => {
        if (isAuthTokenInvalid(error))
          window.location.href = '/login';
        else
          document.getElementById('response-msg').innerHTML = error.message;
      });
    });
  });
}