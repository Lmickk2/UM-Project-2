const router = require('express').Router();
const { Category, Product, User } = require('../models');
const withAuth = require('../utils/auth');
const Sequelize = require('sequelize');

router.get('/', async (req, res) =>
{
    try {
        const products = await Product.findAll({ order: Sequelize.literal('rand()'), limit: 5 })
        const productsList = products.map(p => p.get({plain:true}))
        res.render('homepage', {
            items: productsList,
            loggedIn: req.session.logged_in,
        })
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});

router.get('/product/:id', async (req, res) =>
{
    try {
        const productData = await Product.findByPk(req.params.id, {
            include: [
                {
                    model: User,
                    attributes: ['name'],
                },
            ],
        });

        const product= productData.get({ plain: true });

        res.render('product', {
            ...product,
            logged_in: req.session.logged_in
        });
    } catch (err) {
        res.status(500).json(err);
    }
});

// Use withAuth middleware to prevent access to route
router.get('/profile', withAuth, async (req, res) =>
{
    try {
        // Find the logged in user based on the session ID
        const userData = await User.findByPk(req.session.user_id, {
            attributes: { exclude: ['password'] },
            include: [{ model: User }],
        });

        const user = userData.get({ plain: true });

        res.render('profile', {
            ...user,
            logged_in: true
        });
    } catch (err) {
        res.status(500).json(err);
    }
});

router.get('/login', (req, res) =>
{
    // If the user is already logged in, redirect the request to another route
    if (req.session.logged_in) {
        res.redirect('/');
        return;
    }

    res.render('login');
});
router.get('/logout', (req, res) =>
{
    // If the user is already logged in, redirect the request to another route
    res.render('logout');
});

router.get('/shop', async (req, res) =>
{
    // If the user is already logged in, redirect the request to another route
    if (!req.session.logged_in) {
        res.redirect('/login');
        return;
    }
    try {
        const products = await Product.findAll()
        const productsList = products.map(p => p.get({plain:true}))
        res.render('shop', {
            items: productsList,
            loggedIn: req.session.logged_in,
        })
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});

router.get('/checkout', (req, res) =>
{
    if (!req.session.logged_in) {
        res.redirect('/login');
        return;
    }

    res.render('checkout');
});

router.get('/product', (req, res) =>
{
    if (req.session.logged_in) {
        res.redirect('/product');
        return;
    }

    res.render('product');
});



module.exports = router;
