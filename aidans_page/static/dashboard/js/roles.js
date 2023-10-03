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
var selectedRow;

function init() {
  initDashboard(table, 'role')
}

function fillFields(selectedRowData) {
  $('#name').val(selectedRowData.name);
  $('#description').val(selectedRowData.description);
  $('#permissions').val(selectedRowData.permissions);
}