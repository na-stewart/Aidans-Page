const table = $('#table').DataTable({
  columns: [
    {data: 'date_created'},
    {data: 'date_updated'},
    {data: 'id'},
    {data: 'content'},
    {data: 'account'},
    {data: 'entry'},
    {data: 'approved'},
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
  initDashboard(table, 'comment')
}

function fillFields(selectedRowData) {
  $('#title').val(selectedRowData.title);
  $('#summary').val(selectedRowData.summary);
  tinymce.get('content').setContent(selectedRowData.content);
  $('#thumbnail-url').val(selectedRowData.thumbnail_url);
  $('#published').prop('checked', selectedRowData.published);
}