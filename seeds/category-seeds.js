const { Category } = require('../models');

const categoryData = [
  {
    category_name: 'Clothing',
  },
  {
    category_name: 'Electronics',
  },
  {
    category_name: 'Furniture',
  }
];

const seedCategories = () => Category.bulkCreate(categoryData);

module.exports = seedCategories;
