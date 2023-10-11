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
  ],
  order: [[0, "desc"]],
  scrollX: true,
});
const rolesTable = $('#roles-table').DataTable({
  columns: [
    {data: 'name'},
    {data: 'permissions'},
  ],
  scrollX: true,
});

function init() {
  initDashboard(table, 'account')
  $(table.table().body()).on('click', 'tr', function () {
    populateRolesTable();
  });    
  addRolesTableRowSelectionEventListener();
}

function populateRolesTable() {
  rolesTable.clear().draw();
  var selectedRow = table.row(table.row('.selected').nodes().to$());
  fetch(`/api/v1/account/roles?id=${selectedRow.data().id}`, {
    method: 'GET',
  }).then(response => {
    if (response.ok) 
      return response.json();
    return Promise.reject(response); 
  })
  .then(json => {
    rolesTable.rows.add(json.data).draw();
  })
  .catch(error => {
    error.json().then(error => alert(error.message));
  });  
}


//CREATE MAIN METHOD THAT HANDLES/SEPERATES FUNCTIONALITY SELECTION HIGLIGHTING - FIELD FILLING FOR INDIVIDUAL TABLES.
function addRolesTableRowSelectionEventListener() {
  $(rolesTable.table().body()).on('click', 'tr', function () {
    if ($(this).hasClass('selected')) {
        $(this).removeClass('selected');
    } 
    else {
        rolesTable.$('tr.selected').removeClass('selected');
        $(this).addClass('selected');
    }
  });    
}

function removeAccountRole() {
  var selectedRow = table.row(table.row('.selected').nodes().to$());
  var selectedRoleRow = rolesTable.row(table.row('.selected').nodes().to$());
  fetch(`/api/v1/account/role-remove?role=${selectedRoleRow.data().name}&id=${selectedRow.data().id}`, {
    method: 'DELETE',
  }).then(response => {
    if (response.ok) 
      return response.json();
    return Promise.reject(response); 
  })
  .then(json => {
    selectedRow.remove().draw();
  })
  .catch(error => {
    error.json().then(error => alert(error.message));
  }); 
}


function fillFields(selectedRowData) {
  $('#username').val(selectedRowData.username);
  $('#email').val(selectedRowData.email);
  $('#verified').prop('checked', selectedRowData.verified);
  $('#disabled').prop('checked', selectedRowData.disabled);
}