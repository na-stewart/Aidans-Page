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

function init() {
  initDashboard(table, 'account')
}

function fillFields(selectedRowData) {
  $('#username').val(selectedRowData.username);
  $('#email').val(selectedRowData.email);
  $('#verified').prop('checked', selectedRowData.verified);
  $('#disabled').prop('checked', selectedRowData.disabled);
}