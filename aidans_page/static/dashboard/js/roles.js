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

function assign(){
  openPopup();
}

function openPopup() {
  var popup = document.getElementById("popup");
  var overlay = document.getElementById("overlay");
  popup.style.display = "block";
  overlay.style.display = "block";
}

function closePopup() {
  var popup = document.getElementById("popup");
  var overlay = document.getElementById("overlay");
  popup.style.display = "none";
  overlay.style.display = "none";
}

function fillFields(selectedRowData) {
  $('#name').val(selectedRowData.name);
  $('#description').val(selectedRowData.description);
  $('#permissions').val(selectedRowData.permissions);
}