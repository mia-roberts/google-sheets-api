const express = require('express')
const {google} = require('googleapis');
const keys = require('./keys.json')

//initialize express
const app = express()
app.use(express.urlencoded({ extended: true }));

//set up template engine to render html files
app.set('view engine', 'html');
app.engine('html', require('ejs').renderFile);

//index route
app.get('/',  async (request, response) =>{
    const auth = new google.auth.GoogleAuth({
        keyFile: "keys.json", //the key file
        //url to spreadsheets API
        scopes: "https://www.googleapis.com/auth/spreadsheets", 
    });

    //Auth client Object
    const authClientObject = await auth.getClient();
    
    //Google sheets instance
    const googleSheetsInstance = google.sheets({ version: "v4", auth: authClientObject });

    // spreadsheet id
    const spreadsheetId = "1KruSc8yjSjbd5Z0NHeFOjfXgMP9oqHWrLpfVv4o40Xg";

    // Get metadata about spreadsheet
    const sheetInfo = await googleSheetsInstance.spreadsheets.get({
        auth,
        spreadsheetId,
    });

    //Read from the spreadsheet
    const readData = await googleSheetsInstance.spreadsheets.values.get({
        auth, //auth object
        spreadsheetId, // spreadsheet id
        range: "Sheet1!A:A", //range of cells to read from.
    })

    //write data into the google sheets
    await googleSheetsInstance.spreadsheets.values.append({
        auth, //auth object
        spreadsheetId, //spreadsheet id
        range: "Sheet1!A:B", //sheet name and range of cells
        valueInputOption: "USER_ENTERED", // The information will be passed according to what the usere passes in as date, number or text
        resource: {
            values: [["Git followers tutorial", "Mia Roberts"]],
        },
    });
      
});


const PORT = 5000;

//start server
const server = app.listen(PORT, () =>{
    console.log(`Server started on port ${PORT}`);
});