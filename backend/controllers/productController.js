import asyncHandler from '../middleware/asyncHandler.js';
import Product from '../models/productModel.js';
import User from '../models/userModel.js';

const getProducts = asyncHandler(async (req, res) => {
  const pageSize = process.env.PAGINATION_LIMIT;
  const page = Number(req.query.pageNumber) || 1;

  const keyword = req.query.keyword
    ? {
        name: {
          $regex: req.query.keyword,
          $options: 'i',
        },
      }
    : {};

  const count = await Product.countDocuments({ ...keyword });
  const products = await Product.find({ ...keyword })
    .limit(pageSize)
    .skip(pageSize * (page - 1));

  res.json({ products, page, pages: Math.ceil(count / pageSize) });
});

const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product) {
    return res.json(product);
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

const createProduct = asyncHandler(async (req, res) => {
  const product = new Product({
    name: 'Sample name',
    price: 0,
    user: req.user._id,
    image: '/images/sample.jpg',
    brand: 'Sample brand',
    category: 'Sample category',
    countInStock: 0,
    numReviews: 0,
    description: 'Sample description',
  });

  const createdProduct = await product.save();
  res.status(201).json(createdProduct);
});

const updateProduct = asyncHandler(async (req, res) => {
  const { name, price, description, image, brand, category, countInStock } = req.body;

  // Validate required fields
  if (!name || !price || !description || !image || !brand || !category) {
    res.status(400);
    throw new Error('All fields are required');
  }

  // Validate numeric fields
  if (isNaN(price) || price < 0) {
    res.status(400);
    throw new Error('Price must be a valid positive number');
  }

  if (isNaN(countInStock) || countInStock < 0) {
    res.status(400);
    throw new Error('Count in stock must be a valid positive number');
  }

  const product = await Product.findById(req.params.id);

  if (product) {
    let formattedImage = image;
    if (image && !image.startsWith('http') && !image.startsWith('/')) {
      formattedImage = `/${image}`;
    }

    product.name = name.trim();
    product.price = Number(price);
    product.description = description.trim();
    product.image = formattedImage;
    product.brand = brand.trim();
    product.category = category.trim();
    product.countInStock = Number(countInStock);

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    await Product.deleteOne({ _id: product._id });
    res.json({ message: 'Product removed' });
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

const createProductReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;

  console.log('=== REVIEW DEBUG START ===');
  console.log('req.user exists:', !!req.user);
  console.log('req.user._id:', req.user?._id);

  if (!req.user) {
    res.status(401);
    throw new Error('User not authenticated');
  }

  const product = await Product.findById(req.params.id);
  console.log('Product found:', !!product);
  console.log('Product user field:', product?.user);
  console.log('Product user field type:', typeof product?.user);

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  // FIX: Check if product.user is missing and handle it
  if (!product.user) {
    console.log('WARNING: Product is missing user field, fixing it now');
    console.log('Product data:', {
      _id: product._id,
      name: product.name,
      user: product.user,
      hasUserField: 'user' in product
    });
    
    // Get the first admin user to assign as product owner
    const adminUser = await User.findOne({ isAdmin: true });
    if (adminUser) {
      product.user = adminUser._id;
      console.log('Assigned product to admin user:', adminUser._id);
    } else {
      // Fallback: assign to current user
      product.user = req.user._id;
      console.log('No admin found, assigned to current user:', req.user._id);
    }
  }

  const alreadyReviewed = product.reviews.find(
    (r) => r.user.toString() === req.user._id.toString()
  );

  if (alreadyReviewed) {
    res.status(400);
    throw new Error('Product already reviewed');
  }

  const review = {
    name: req.user.name,
    rating: Number(rating),
    comment,
    user: req.user._id,
  };

  console.log('Review object to save:', review);

  product.reviews.push(review);
  product.numReviews = product.reviews.length;
  product.rating =
    product.reviews.reduce((acc, item) => item.rating + acc, 0) /
    product.reviews.length;

  try {
    console.log('About to save product...');
    await product.save();
    console.log('Product saved successfully!');
    res.status(201).json({ message: 'Review added' });
  } catch (saveError) {
    console.log('ERROR saving product:', saveError);
    throw saveError;
  }

  console.log('=== REVIEW DEBUG END ===');
});

const getTopProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({}).sort({ rating: -1 }).limit(3);

  res.json(products);
});

export {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  createProductReview,
  getTopProducts,
};
