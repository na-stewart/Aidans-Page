const table = $('#table').DataTable({
  columns: [
    {data: 'date_created'},
    {data: 'date_updated'},
    {data: 'id'},
    {data: 'email'},
    {data: 'username'},
    {data: 'verified'},
    {data: 'disabled'}
  ],
  columnDefs: [
    {
      targets: [0, 1],
      render: function (data, type, row, meta) {
        return parseDateTime(data)
      }
    }
  ]
});
var selectedRow;


function initDashboard() {
  populateDashboardTable();
  addDashboardFormEventListener();
  addTableRowSelectionEventListener();
}

function addDashboardFormEventListener() { 
  const form = document.getElementById('account-form');
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    switch(event.submitter.value) {
      case 'post':
        onPost(form);
      case 'update':
        onUpdate(form);
        break;
      case 'delete':
        onDelete();
    }
  });
}

function addTableRowSelectionEventListener() {
  $('#table tbody').on('click', 'tr', function () {
    if ($(this).hasClass('selected')) {
        $(this).removeClass('selected');
        clearDashboardFields();
    } 
    else {
        table.$('tr.selected').removeClass('selected');
        $(this).addClass('selected');
        selectedRow = table.row(this);
        var selectedRowData = selectedRow.data();
        $('#username').val(selectedRowData.username);
        $('#email').val(selectedRowData.email);
        $('#verified').prop('checked', selectedRowData.verified);
        $('#disabled').prop('checked', selectedRowData.disabled);
    }
  });    
}

function onPost(form) {
  fetch('api/v1/account', {
    method: 'POST',
    body: new FormData(form)
  }).then(response => {
    if (response.ok) 
      return response.json();
    return Promise.reject(response); 
  })
  .then(json => {
    table.row.add(json.data).draw();
    clearDashboardFields();
  })
  .catch(error => alert(error.message));
}

function onUpdate(form) {
  fetch('api/v1/account?id=' + selectedRow.data().id, {
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

function onDelete() {
  fetch('api/v1/account?id=' + selectedRow.data().id, {
    method: 'DELETE',
  }).then(response => {
    if (response.ok) 
      return response.json();
    return Promise.reject(response); 
  })
  .then(json => {
    selectedRow.remove().draw();
    clearDashboardFields();
  })
  .catch(error => alert(error.message));
}

function populateDashboardTable() {
  fetch('api/v1/account/all', {
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

function clearDashboardFields() {
  $('#username').val(null);
  $('#email').val(null);
  $('#verified').prop('checked', false);
  $('#disabled').prop('checked', false);
}