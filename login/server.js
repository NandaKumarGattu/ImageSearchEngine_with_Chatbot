const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const path = require('path');
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// MongoDB Connection - without port specification (uses default 27017)
mongoose.connect('mongodb://localhost/user-login', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to MongoDB');
}).catch(err => {
    console.error('MongoDB connection error:', err);
});

// User Schema
const UserSchema = new mongoose.Schema({
    username: { 
        type: String, 
        required: true, 
        unique: true,
        trim: true,
        minlength: 3
    },
    email: { 
        type: String, 
        required: true, 
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email address']
    },
    password: { 
        type: String, 
        required: true,
        minlength: 6
    },
    createdAt: { 
        type: Date, 
        default: Date.now 
    }
});

// Hash password before saving
UserSchema.pre('save', async function(next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});

// Model
const User = mongoose.model('User', UserSchema);

// Helper function to generate JWT token
const generateToken = (user) => {
    return jwt.sign(
        { id: user._id, username: user.username },
        process.env.JWT_SECRET || 'your_jwt_secret',
        { expiresIn: '1d' }
    );
};

// Middleware for authentication
const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '');
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');
        const user = await User.findById(decoded.id);
        
        if (!user) {
            throw new Error();
        }
        
        req.user = user;
        next();
    } catch (error) {
        res.status(401).send({ error: 'Please authenticate.' });
    }
};

// Routes

// Register a new user
app.post('/api/users/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;
        
        // Validation
        if (!username || !email || !password) {
            return res.status(400).send({ error: 'All fields are required' });
        }
        
        if (password.length < 6) {
            return res.status(400).send({ error: 'Password must be at least 6 characters long' });
        }
        
        // Create and save user
        const user = new User({ username, email, password });
        await user.save();
        
        // Generate token
        const token = generateToken(user);
        
        // Send response
        res.status(201).send({ 
            user: { 
                id: user._id, 
                username, 
                email,
                createdAt: user.createdAt
            }, 
            token 
        });
    } catch (error) {
        if (error.code === 11000) {
            // Duplicate key error
            if (error.keyPattern.username) {
                return res.status(400).send({ error: 'Username already exists' });
            }
            if (error.keyPattern.email) {
                return res.status(400).send({ error: 'Email already exists' });
            }
            return res.status(400).send({ error: 'Account already exists' });
        }
        res.status(400).send({ error: error.message });
    }
});

// Login user
app.post('/api/users/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        
        if (!username || !password) {
            return res.status(400).send({ error: 'Username and password are required' });
        }
        
        // Find user
        const user = await User.findOne({ username });
        
        if (!user) {
            return res.status(400).send({ error: 'Invalid credentials' });
        }
        
        // Verify password
        const isMatch = await bcrypt.compare(password, user.password);
        
        if (!isMatch) {
            return res.status(400).send({ error: 'Invalid credentials' });
        }
        
        // Generate token
        const token = generateToken(user);
        
        // Send response
        res.send({ 
            user: { 
                id: user._id, 
                username: user.username, 
                email: user.email,
                createdAt: user.createdAt
            }, 
            token 
            
        });
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
});

// Get user profile (protected route)
app.get('/api/users/profile', auth, async (req, res) => {
    try {
        // User is already attached to req by auth middleware
        res.send({ 
            user: { 
                id: req.user._id, 
                username: req.user.username, 
                email: req.user.email,
                createdAt: req.user.createdAt
            } 
        });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

// Serve the frontend
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/old-page', (req, res) => {
    res.redirect('imagechatbot.html'); // Redirecting to an HTML file
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});