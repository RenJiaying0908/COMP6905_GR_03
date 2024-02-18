const express = require('express');
const path = require('path');
const app = express();

port = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, '..', 'build')));

//the entrance of App is 'index.html' in 'build' folder
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'build', 'index.html'));
});

app.listen(port, () => {
    console.log(`App listening on port ${port}!`);
});

//Run app, then load http://localhost:port in a browser to see the output.
