function StringBuilder(value) {
    this.strings = new Array("");
    this.append(value);
}
StringBuilder.prototype.append = function (value) {
    if (value) {
        this.strings.push(value);
    }
};
StringBuilder.prototype.clear = function () {
    this.strings.length = 1;
};
StringBuilder.prototype.toString = function () {
    return this.strings.join("");
};

function getSlotDetails() {
    var date = new Date();
    var dd = String(date.getDate()).padStart(2, '0');
    var mm = String(date.getMonth() + 1).padStart(2, '0'); //January is 0!	
    var yyyy = date.getFullYear();
    date = dd + '-' + mm + '-' + yyyy;
    var sb = new StringBuilder();
    sb.append(`<div class="table-responsive">	
<table class="table  table-bordered table-striped table-hover">	
<thead >
    <tr>
       <th>#</th>
       <th>Pincode</th>
       <th>Center Name</th>
       <th>Fee</th>
       <th>Slots</th>
       <th>Age</th>
       <th>Vaccine</th>
     </tr>
   </thead>
   <tbody>`);
    // file = 'responseNoSlots.json';
    // fetch(file)
    //     .then(response => response.json())
    //     .then(jsonResponse => {
    //         var data = jsonResponse.centers;
    
    return axios({
        "method": "GET",
        "url": `https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/calendarByDistrict?district_id=371&date=${date}`,
        "headers": {
            "content-type": "application/json",
            "accept": "application/json"
        }
    })
        .then((response) => {
            var data = response.data.centers;
            console.log(data);
            var chk = 0;
            if (data) {
                for (var i = 0; i < data.length; i++) {
                    var serial = '<tr> <th scope="row">' + i + 1 + '</th>';
                    var name = '<td>' + data[i].name + '</td>';
                    var pincode = '<td>' + data[i].pincode + '</td>';
                    var fee_type = '<td>' + data[i].fee_type + '</td>';
                    var fee = 0;
                    var timings = '<td>' + data[i].from + ' - ' + data[i].to + '</td>';
                    for (var j = 0; j < data[i].sessions.length; j++) {
                        if (data[i].sessions[j].available_capacity > 0) {
                            var availability = '<td>' + data[i].sessions[j].available_capacity + '</td>';
                            var min_age = '<td>' + data[i].sessions[j].min_age_limit + '+</td>';
                            var vaccine = '<td>' + data[i].sessions[j].vaccine + '</td></tr>';
                            // if (data[i].fee_type == 'Paid') {
                            //     fee = '<td>' + data[i].vaccine_fees[0].fee + '</td>';
                            //     sb.append(serial + name + address + fee_type + fee + timings + availability + min_age + vaccine);
                            // }
                            // else {
                            sb.append(serial + pincode + name + fee_type + availability + min_age + vaccine);
                            //}
                            chk = 1;
                        }
                    }
                }
            }
            sb.append('</tbody> </table > </div >');
            if (chk === 0) {
                sb.clear();
                sb.append('<center><em><h4>No Slots are available. Please check again later.</h4></em></center>');
            }
            console.log(sb.toString());
            //sb.clear();            
            //document.write(sb.toString());
            document.getElementById("table").innerHTML = sb.toString();
        })
}
getSlotDetails();