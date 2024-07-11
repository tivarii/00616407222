// src/helpers.js
const axios = require('axios');

const BASE_URL = 'http://20.244.56.144/test';

async function fetchProducts(company, category, topN, minPrice, maxPrice) {
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
    const response = await axios.get(`${BASE_URL}/companies/${company}/categories/${category}/products`, {
      params: { top: topN, minPrice, maxPrice },
    },{headers});

      
    return data;
  } catch (error) {
    console.error(`Error fetching products: ${error}`);
    return [];
  }
}

module.exports = { fetchProducts };
