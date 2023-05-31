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