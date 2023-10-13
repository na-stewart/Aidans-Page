const table = $('#table').DataTable({
  columns: [
    {data: 'date_created'},
    {data: 'date_updated'},
    {data: 'id'},
    {data: 'email'},
    {data: 'username'}
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

function init() {
  initDashboard(table, 'inquiry')
}

function fillFields(selectedRowData) {
  $('#username').val(selectedRowData.username);
  $('#email').val(selectedRowData.email);
  $('#content').val(selectedRowData.content);
}