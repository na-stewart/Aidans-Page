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

      
}