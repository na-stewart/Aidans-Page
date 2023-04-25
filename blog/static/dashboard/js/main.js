function parseDateTime(date){
  return new Date(date).toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric'
  })
}

function addAccountFormEventListener(){ 
  document.getElementById('account-form').addEventListener('submit', function(event) {
    event.preventDefault();
    switch( event.submitter.value) {
      case 'Post':
        // code to handle button 1
        break;
      case 'Update':
        // code to handle button 2
        break;
      case 'Delete':
        // code to handle button 2
        break;
    }

  });
}

function populateAccountsTable(){
  var table = $('#table').DataTable({
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
    fetch("api/v1/account/all", {
        method: "GET",
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
          var selectedRowData = table.row(this).data();
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