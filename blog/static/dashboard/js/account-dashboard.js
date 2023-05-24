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


function initAccountDashboard() {
  populateAccountsTable();
  addAccountFormEventListener();
}

function addAccountFormEventListener(){ 
  const form = document.getElementById('account-form');
  document.getElementById('account-form').addEventListener('submit', (event) => {
    event.preventDefault();
    switch(event.submitter.value) {
      case 'post':
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
          clearAccountFields();
        })
        .catch(error => alert(error.message));
        break;
      case 'update':
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
        break;
      case 'delete':
        fetch('api/v1/account?id=' + selectedRow.data().id, {
          method: 'DELETE',
        }).then(response => {
          if (response.ok) 
            return response.json();
          return Promise.reject(response); 
        })
        .then(json => {
          selectedRow.remove().draw();
        })
        .catch(error => alert(error.message));
        break;
    }

  });
}

function populateAccountsTable(){
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
        error.json().then(error => {        
      });
    });  
    $('#table tbody').on('click', 'tr', function () {
      if ($(this).hasClass('selected')) {
          $(this).removeClass('selected');
          clearAccountFields();
      } else {
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

function clearAccountFields() {
  $('#username').val(null);
  $('#email').val(null);
  $('#verified').prop('checked', false);
  $('#disabled').prop('checked', false);
}