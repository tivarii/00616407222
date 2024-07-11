const express = require('express');
const axios = require('axios');
const {timeout,TimeoutError} =require('promise-timeout');
const dotenv = require('dotenv');
dotenv.config();
const app = express();
const port = 9876;

// In-memory storage for numbers
let numbersWindow = [];
const windowSize = 10;

// Third-party server URL 
const THIRD_PARTY_URL = "http://20.244.56.144/test";

const fetchNumbersFromServer = async (numberId) => {
    // let headers = { 'Authorization': `Bearer ${process.env.accessToken}` }
    // // let headers={
    // //     "token_type": "Bearer",
    // //     "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiZXhwIjoxNzIwNzAzOTAxLCJpYXQiOjE3MjA3MDM2MDEsImlzcyI6IkFmZm9yZG1lZCIsImp0aSI6ImY5MTE3MjRlLTdjMDUtNGY5MC05MzUwLTYyNjNiY2IyNmEyZiIsInN1YiI6ImFkYXJzaHRpd2F0aTM1NzZAZ21haWwuY29tIn0sImNvbXBhbnlOYW1lIjoiYW5uYWRhdGEiLCJjbGllbnRJRCI6ImY5MTE3MjRlLTdjMDUtNGY5MC05MzUwLTYyNjNiY2IyNmEyZiIsImNsaWVudFNlY3JldCI6Ik1XcWh6V1pDYnRuUmhWQnciLCJvd25lck5hbWUiOiJBZGFyc2ggVGl3YXJpIiwib3duZXJFbWFpbCI6ImFkYXJzaHRpd2F0aTM1NzZAZ21haWwuY29tIiwicm9sbE5vIjoiMDA2MTY0MDcyMjIifQ.J3GuYOakEmceziKzSPRARvc12A7WsPRyiIIHaDkhhdY",
    // //     "expires_in": 1720703901
    // // }

    let bodyData = {
        "companyName": "annadata",
        "clientID": "f911724e-7c05-4f90-9350-6263bcb26a2f",
        "clientSecret": "MWqhzWZCbtnRhVBw",
        "ownerName": "Adarsh Tiwari",
        "ownerEmail": "adarshtiwati3576@gmail.com",
        "rollNo": "00616407222"
    }

    const res=await axios.post('http://20.244.56.144/test/auth', bodyData);
        
    const accessToken=res.data.access_token

    let headers = { 'Authorization': "Bearer " + accessToken }
    try {
        const response = await timeout((await axios.get(`${THIRD_PARTY_URL}/${numberId}`,{headers})),500);
        console.log(response);
        if (response.status === 200) {
            return response.data.numbers || [];
        }
    } catch (error) {
        if (error instanceof TimeoutError) {
            console.error('Request to server timeout');
        }
        console.error('Error fetching numbers:', error.message);
    }
    // return [3,3,4,54,34];
};

const updateNumbersWindow = (newNumbers) => {
    newNumbers.forEach(number => {
        if (!numbersWindow.includes(number)) {
            if (numbersWindow.length >= windowSize) {
                numbersWindow.shift();
            }
            numbersWindow.push(number);
        }
    });
};

const calculateAverage = () => {
    if (numbersWindow.length === 0) {
        return 0.0;
    }
    const sum = numbersWindow.reduce((a, b) => a + b, 0);
    return parseFloat((sum / numbersWindow.length).toFixed(2));
};

app.get("/",(req,res)=>{
    res.json({msg:"I am worskin"});
})
app.get('/numbers/:numberId', async (req, res) => {
    // res.json({msg:"in the /number"})
    let numberId = req.params.numberId;
    const numberIDs={"p":"primes","e":"even","r":"rand","f":"fibo"};
    if (!['p', 'f', 'e', 'r'].includes(numberId)) {
        return res.status(400).json({ detail: "Invalid number ID" });
    }
    numberId=numberIDs[numberId];
    const windowPrevState = [...numbersWindow];
    let newNumbers = await fetchNumbersFromServer(numberId);
    newNumbers=Array.isArray(newNumbers)?newNumbers:[newNumbers];

    if (newNumbers.length > 0) {
        updateNumbersWindow(newNumbers);
    }

    const avg = calculateAverage();
    const response = {
        numbers: newNumbers,
        windowPrevState: windowPrevState,
        windowCurrState: numbersWindow,
        avg: avg
    };

    res.json(response);
});





app.listen(port, () => {
    console.log(`Microservice running on http://localhost:${port}`);
});
