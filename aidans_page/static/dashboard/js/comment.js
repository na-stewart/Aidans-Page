const table = $('#table').DataTable({
  columns: [
    {data: 'date_created'},
    {data: 'date_updated'},
    {data: 'id'},
    {data: 'entry'},
    {data: 'author'},
    {data: 'approved'},
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
  initDashboard(table, 'comment')
}

function fillFields(selectedRowData) {
  $('#entry').val(selectedRowData.entry);
  $('#content').val(selectedRowData.content);
  $('#approved').prop('checked', selectedRowData.approved);
}