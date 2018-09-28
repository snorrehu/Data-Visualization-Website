var fileInput = document.getElementById("csv");
let csvInput;

    readFile = function () {
        var reader = new FileReader();
        reader.onload = function () {
           
          csvCall(reader.result);
        };
        // start reading the file. When it is done, calls the onload event defined above.
        reader.readAsDataURL(fileInput.files[0]);
        
    };

fileInput.addEventListener('change', readFile); 



function csvCall(csvInput) {

d3.csv(csvInput,function (data) {
// CSV section
    var body = d3.select('body');
    var headers = d3.keys(data[0]);

    let selectData = [];

    headers.forEach(function(headers, index) {
        selectData[index] = {"text": headers }
    });

  