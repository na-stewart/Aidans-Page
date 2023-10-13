const table = $('#table').DataTable({
  columns: [
    {data: 'date_created'},
    {data: 'date_updated'},
    {data: 'id'},
    {data: 'name'},
    {data: 'permissions'},
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
const accountsTable = $('#accounts-table').DataTable({
  columns: [
    {data: 'email'},
    {data: 'username'},
  ],
  scrollX: true,
});

function init() {
  initDashboard(table, 'role')
  addAccountsTableRowSelectionEventListener();
  
}


function populateAccountsTable() {
  accountsTable.clear().draw();
  fetch(`/api/v1/account/all`, {
    method: 'GET',
  }).then(response => {
    if (response.ok) 
      return response.json();
    return Promise.reject(response); 
  })
  .then(json => {
    accountsTable.rows.add(json.data).draw();
  })
  .catch(error => {
    error.json().then(error => alert(error.message));
  });  
}

//CREATE MAIN METHOD THAT HANDLES/SEPERATES FUNCTIONALITY SELECTION HIGLIGHTING - FIELD FILLING FOR INDIVIDUAL TABLES.
function addAccountsTableRowSelectionEventListener() {
  $(accountsTable.table().body()).on('click', 'tr', function () {
    if (!$(this).hasClass('selected')) {
        $(this).addClass('selected');
        var selectedRoleRow = table.row(table.row('.selected').nodes().to$());
        var selectedAccountRow = accountsTable.row(accountsTable.row('.selected').nodes().to$());
        fetch(`/api/v1/account/role-assign?role=${selectedRoleRow.data().name}&id=${selectedAccountRow.data().id}`, {
          method: 'POST',
        }).then(response => {
          if (response.ok) 
            return response.json();
          return Promise.reject(response); 
        })
        .then(json => {
          closePopup()
        })
        .catch(error => {
          error.json().then(error => alert(error.message));
        }); 
    } 
  });    
}
 

function onAssign(){
  var selectedRow = table.row(table.row('.selected').nodes().to$());
  if (selectedRow.length != 0) {
    openPopup();
    populateAccountsTable();
  } else
    alert("Please select a role to be assigned to an account.");
}

function openPopup() {
  var popup = document.getElementById("popup");
  popup.style.display = "block";
}

function closePopup() {
  var popup = document.getElementById("popup");
  popup.style.display = "none";
}

function fillFields(selectedRowData) {
  $('#name').val(selectedRowData.name);
  $('#description').val(selectedRowData.description);
  $('#permissions').val(selectedRowData.permissions);
}