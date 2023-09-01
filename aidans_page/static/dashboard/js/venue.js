const table = $('#table').DataTable({
  
  columns: [
    {data: 'date_created'},
    {data: 'date_updated'},
    {data: 'id'},
    {data: 'name'},
    {data: 'reception'},
    {data: 'seated'},
    {data: 'capacity'},
    {data: 'neighborhood'},
    {data: 'type'},
  ],
  columnDefs: [
    {
      targets: [0, 1],
      render: function (data, type, row, meta) {
        return parseDateTime(data)
      }
    }
  ],
  scrollX: true,
});
var selectedRow;

function init() {
  initDashboard(table, 'venue')
}

function fillFields(selectedRowData) {
  $('#name').val(selectedRowData.name);
  $('#summary').val(selectedRowData.summary);
  $('#reception').val(selectedRowData.reception);
  $('#seated').val(selectedRowData.seated);
  $('#capacity').val(selectedRowData.capacity);
  $('#neighborhood').val(selectedRowData.neighborhood);
  $('#type').val(selectedRowData.type);
  $('#coordinates').val(selectedRowData.coordinates);
  $('#thumbnail-url').val(selectedRowData.thumbnail_url);
  $('#redirect-url').val(selectedRowData.redirect_url);
}