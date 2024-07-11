// src/routes.js
const express = require('express');
const { fetchProducts } = require('./helpers');

const router = express.Router();

const companies = ['AMZ', 'FLP', 'SNP', 'MYN', 'AZO'];

router.get('/categories/:categoryname/products', async (req, res) => {
  const { categoryname } = req.params;
  const { top = 10, minPrice, maxPrice, sort, order, page = 1 } = req.query;
  const topN = parseInt(top, 10);
  const pageNum = parseInt(page, 10);

  try {
    const allProductsPromises = companies.map(company =>
      fetchProducts(company, categoryname, topN, minPrice, maxPrice)
    );

    const allProductsArrays = await Promise.all(allProductsPromises);
    let allProducts = allProductsArrays.flat();

    // Apply sorting if necessary
    if (sort) {
      allProducts.sort((a, b) => {
        const sortOrder = order === 'desc' ? -1 : 1;
        return sortOrder * (a[sort] - b[sort]);
      });
    }

    // Generate unique IDs for products
    allProducts = allProducts.map((product, index) => ({
      ...product,
      id: `${categoryname}-${index}`,
    }));

    // Pagination
    const startIndex = (pageNum - 1) * topN;
    const paginatedResults = allProducts.slice(startIndex, startIndex + topN);

    res.json(paginatedResults);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/categories/:categoryname/products/:productid', async (req, res) => {
  const { categoryname, productid } = req.params;

  // Simulated retrieval of specific product details
  const productDetails = {
    id: productid,
    name: `Product ${productid}`,
    // Add more product details here
  };

  res.json(productDetails);
});

module.exports = router;
