const table = $('#table').DataTable({
  columns: [
    {data: 'date_created'},
    {data: 'date_updated'},
    {data: 'id'},
    {data: 'title'},
    {data: 'published'},
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
  tinymce.init({
    selector: '#content',
    plugins: 'code fullscreen anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks',
    toolbar: 'code fullscreen | undo redo | bold italic underline align | link image | numlist bullist',
    tinycomments_mode: 'embedded',
  });
  initDashboard(table, 'entry')
}

function fillFields(selectedRowData) {
  $('#title').val(selectedRowData.title);
  $('#summary').val(selectedRowData.summary);
  tinymce.get('content').setContent(selectedRowData.content);
  $('#thumbnail-url').val(selectedRowData.thumbnail_url);
  $('#published').prop('checked', selectedRowData.published);
}