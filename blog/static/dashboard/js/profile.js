const table = $('#table').DataTable({
  columns: [
    {data: 'date_created'},
    {data: 'date_updated'},
    {data: 'id'},
    {data: 'parent'},
    {data: 'subscribed'}
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
  initDashboard(table, 'profile')
}

function fillFields(selectedRowData) {
  $('#parent').val(selectedRowData.parent);
  $('#subscribed').prop('checked', selectedRowData.subscribed);
}