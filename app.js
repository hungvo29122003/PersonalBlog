const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const path = require('path');
const cors = require('cors');
const dotenv = require('dotenv');
const fileUpload = require('express-fileupload');
const session = require('express-session');
const flash = require('connect-flash');
dotenv.config();
const port = process.env.PORT || 3000;
const app = express();
app.use(cors());
const auth = require('./src/utils/auth');
const morgan = require('morgan');
app.use(morgan('combined'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

// Session và Flash message middleware
app.use(session({
  secret: process.env.SESSION_SECRET || 'blog-secret-key',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // set to true if your using https
}));
app.use(flash());

// File upload middleware
app.use(fileUpload({
  useTempFiles: true,
  tempFileDir: path.join(__dirname, 'tmp'),
  createParentPath: true,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  abortOnLimit: true,
  debug: true
}));

const router = express.Router();
app.set('view engine', 'pug');
app.set('views', './src/views');

// Method override middleware for PUT/DELETE in forms
const methodOverride = require('method-override');
app.use(methodOverride('_method'));

// Add the user to res.locals if authenticated
app.use(function (req, res, next) {
    const token = req.cookies.accessToken;
    const checkUser = auth.verifyAccsessToken(token);
    if (checkUser) {
        res.locals.user = checkUser;
        // Add classes to body for JS to detect logged in state and role
        let bodyClass = 'user-logged-in';
        if (checkUser.role) {
            bodyClass += ` role-${checkUser.role}`;
        }
        res.locals.bodyClass = bodyClass;
    } else {
        res.locals.bodyClass = 'user-logged-out';
    }
    // Set default title
    res.locals.title = 'Personal Blog';
    
    // Make flash messages available to all views
    res.locals.messages = {
      success: req.flash('success'),
      error: req.flash('error'),
      info: req.flash('info')
    };
    
    next();
});

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Configure routes
const authRouter = require('./src/routes/authRoute');
const postRouter = require('./src/routes/postRoute');
const commentRouter = require('./src/routes/commentRoute');
const userRouter = require('./src/routes/userRoute');
const adminRouter = require('./src/routes/adminRoute');
const likeRouter = require('./src/routes/likeRoute');

// Mount route handlers
app.use('/auth', authRouter);
app.use('/post', postRouter);
app.use('/comment', commentRouter);
app.use('/user', userRouter);
app.use('/admin', adminRouter);
app.use('/like', likeRouter);

// Main routes
app.get('/', (req, res) => {
    return res.render('index', { title: 'Welcome to Personal Blog' });
});

app.get('/home', (req, res) => {
    // In a real implementation, you would fetch featured posts from the database
    const featuredPosts = [];
    return res.render('home', { 
        title: 'Home - Personal Blog',
        featuredPosts
    });
});

app.get('/about', (req, res) => {
    return res.render('info/about', { title: 'About - Personal Blog' });
});

app.get('/user/profile', (req, res) => {
    // Check authentication
    if (!res.locals.user) {
        return res.redirect('/auth/login');
    }
    // In a real implementation, you would fetch user posts and comments
    const userPosts = [];
    const userComments = [];
    return res.render('user/profile', { 
        title: 'My Profile - Personal Blog',
        userPosts,
        userComments
    });
});
app.get('/posts', (req, res) => {
    return res.render('post/posts', { title: 'Posts - Personal Blog' });
});
app.get('/post/create', (req, res) => {
    return res.render('post/edit-post', { title: 'Create Post - Personal Blog' });
});
app.get('/posts/details/:post_id', (req, res) => {
    return res.render('post/post-details', { title: 'Post Details - Personal Blog' });
});

app.get('/admin/dashboard', (req, res) => {
    // Check authentication and admin role
    if (!res.locals.user || res.locals.user.role !== 'admin') {
        return res.redirect('/auth/login');
    }
    // In a real implementation, you would fetch stats and data
    const stats = {
        totalUsers: 0,
        totalPosts: 0,
        totalComments: 0,
        totalLikes: 0
    };
    const recentUsers = [];
    const recentPosts = [];
    const moderationItems = [];
    return res.render('admin/dashboard', { 
        title: 'Admin Dashboard - Personal Blog',
        stats,
        recentUsers,
        recentPosts,
        moderationItems
    });
});

app.get('/auth/login', (req, res) => {
    if (res.locals.user) {
        return res.redirect('/');
    }
    return res.render('auth/login', { title: 'Login - Personal Blog' });
});

app.get('/auth/register', (req, res) => {
    if (res.locals.user) {
        return res.redirect('/');
    }
    return res.render('auth/register', { title: 'Register - Personal Blog' });
});

app.get('/auth/logout', (req, res) => {
    res.clearCookie('accessToken');
    return res.redirect('/');
});
app.get('/post/edit/:post_id', (req, res) => {
    return res.render('post/edit-posts', { title: 'Edit Post - Personal Blog' });
}); 

// Middleware for 404 errors: When no route matches
app.use((req, res, next) => {
    console.log('404 middleware hit');
    res.status(404).render('error404', { title: 'Page Not Found' });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).render('error500', { 
        title: 'Server Error',
        error: process.env.NODE_ENV === 'development' ? err : {}
    });
});

app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
});