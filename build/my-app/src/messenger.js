import axios from 'axios';

const url = "http://localhost:3001/submit-data";

const postData = (data, callback) => {
    console.log("posting data to server...");
    axios.post(url, data)
    .then(response => {
        console.log(response.data);
        callback(null, response.data);
    })
    .catch(error => {
        console.error('Error: unknown error happened!');
        callback(error);
    });
};

export default postData;
