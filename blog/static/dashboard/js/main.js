function parseDateTime(date){
  return new Date(date).toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric'
  })
}

function initDashboard(table, fetchEndpoint) {
  const form = document.getElementById('dashboard-form');
  addTableRowSelectionEventListener(table, form)
  addFormEventListener(form, table, fetchEndpoint)
  populateTable(table, fetchEndpoint);
}

function addTableRowSelectionEventListener(table, form) {
  $(table.table().body()).on('click', 'tr', function () {
    if ($(this).hasClass('selected')) {
        $(this).removeClass('selected');
        form.reset();
    } 
    else {
        table.$('tr.selected').removeClass('selected');
        $(this).addClass('selected');
        fillFields(table.row(this).data());
    }
  });    
}

function addFormEventListener(form, table, writeMethodsEndpoint) {
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    switch(event.submitter.value) {
      case 'post':
        onPost(table, form, writeMethodsEndpoint);
      case 'update':
        onUpdate(table, form, writeMethodsEndpoint);
        break;
      case 'delete':
        onDelete(table, form, writeMethodsEndpoint);
    }
  });
}

function populateTable(table, getMethodEndpoint) {
  fetch(`/api/v1/${getMethodEndpoint}`, {
    method: 'GET',
  }).then(response => {
    if (response.ok) 
      return response.json();
    return Promise.reject(response); 
  })
  .then(json => {
    table.rows.add(json.data).draw();
  })
  .catch(error => {
    error.json().then(error => alert(error.message));
  });  
}

function onPost(table, form, postEndpoint) {
  fetch(`/api/v1/${postEndpoint}`, {
    method: 'POST',
    body: new FormData(form)
  }).then(response => {
    if (response.ok) 
      return response.json();
    return Promise.reject(response); 
  })
  .then(json => {
    table.row.add(json.data).draw();
    form.reset();
  })
  .catch(error => alert(error.message));
}

function onUpdate(table, form, updateEndpoint) {
  var selectedRow = table.row(table.row('.selected').nodes().to$());
  fetch(`/api/v1/${updateEndpoint}?id=${selectedRow.data().id}`, {
    method: 'PUT',
    body: new FormData(form)
  }).then(response => {
    if (response.ok) 
      return response.json();
    return Promise.reject(response); 
  })
  .then(json => {
    selectedRow.data(json.data).draw();
  })
  .catch(error => alert(error.message));
}

function onDelete(table, form, deleteEndpoint) {
  var selectedRow = table.row(table.row('.selected').nodes().to$());
  fetch(`/api/v1/${deleteEndpoint}?id=${selectedRow.data().id}`, {
    method: 'DELETE',
  }).then(response => {
    if (response.ok) 
      return response.json();
    return Promise.reject(response); 
  })
  .then(json => {
    selectedRow.remove().draw();
    form.reset();
  })
  .catch(error => alert(error.message));
}