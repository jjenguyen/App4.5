// // code from assignment 4 app, before implementing mongodb
// // make sure to go to http://localhost:3000/posts when testing server to see json data

// const express = require('express');
// const cors = require('cors');

// const app = express();
// const port = 3000;

// app.use(cors());

// // hardcoded data
// const posts = [
//     {title: 'Post 1', content: 'This is my Assignment 4 post!'},
//     {title: 'Post 2', content: 'My pawprint is jn4gz.'},
//     {title: 'Post 3', content: "This is from the hardcoded data."}
// ]

// // route to send post data to the frontend
// app.get('/posts', (req, res) => {
//     res.json(posts);
// });

// // start server
// app.listen(port, () => {
//     console.log(`Server is running on http://localhost:${port}`);
// });

// code with mongodb implemented, login and auth, register new user
// make sure to go to http://localhost:3000/posts when testing server to see json data
const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');
const bcrypt = require('bcrypt');

// create an express app
const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());

// mongodb connection string from mongodb atlas
const uri = "mongodb+srv://jn4gz:jn4gz12345@clustera4.jcqksc9.mongodb.net/cmp_sc4830_app4?retryWrites=true&w=majority";

// function to connect to mongodb
async function connectToMongoDB() {
    try {
        const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
        await client.connect();
        console.log('Successfully connected to MongoDB Atlas!');
        return client.db(); // return the database instance
    } catch (error) {
        console.error('Error connecting to MongoDB Atlas:', error);
        throw error;
    }
}

// 1. db hashing: function to check if a password is hashed, call in user login auth
function isPasswordHashed(password) {
    // check if password starts with the bcrypt hash identifier
    return password.startsWith('$2b$');
}

// 2. user login auth
app.post('/login', async (req, res) => {
    try {
        console.log('Login request received:', req.body);
        
        const db = await connectToMongoDB();
        const usersCollection = db.collection('users');
        const user = await usersCollection.findOne({ email: req.body.email });

        if (!user) {
            console.log('User not found');
            return res.status(401).json({ message: 'User not found. Please try again or register an account.' });
        }

        console.log('Mongodb User:', user);

        // check if password stored in db is already hashed
        if (!isPasswordHashed(user.password)) {
            console.log('Database password is not hashed. Hashing now...');
            // if password is not hashed, hash it and update the database
            const hashedPassword = await bcrypt.hash(user.password, 10);
            console.log('Hashed Password:', hashedPassword);
            await usersCollection.updateOne(
                { email: req.body.email },
                { $set: { password: hashedPassword } }
            );

            // update the user object with the hashed password
            user.password = hashedPassword;
        } else {
            console.log('Database password is already hashed.');
        }

        // compare the user input password with the hashed password retrieved from the database
        const passwordMatch = await bcrypt.compare(req.body.password, user.password);
        if (!passwordMatch) {
            console.log('Incorrect password');
            return res.status(401).json({ message: 'Incorrect password. Please try again.' });
        }

        console.log('Login successful!');
        res.status(200).json({ message: 'Login successful!' });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// 3. register new user and insert new document into mongodb
app.post('/register', async (req, res) => {
    try {
        const db = await connectToMongoDB();
        const usersCollection = db.collection('users');
        const existingUser = await usersCollection.findOne({ email: req.body.email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists. Please go to the login page to log in.' });
        }
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        await usersCollection.insertOne({
            email: req.body.email,
            password: hashedPassword
        });
        console.log('User registered successfully!');
        return res.status(201).json({ message: 'Account successfully created! Please go to the login page to log in.' });
    } catch (error) {
        console.error('Error during registration:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// route to fetch posts from db
app.get('/posts', async (req, res) => {
    try {
        // connect to mongo
        const db = await connectToMongoDB();
        
        // get the posts collection
        const postsCollection = db.collection('posts');
        
        // fetch all posts from the collection
        const posts = await postsCollection.find({}).toArray();
        
        // send the posts as JSON response
        res.json(posts);
    } catch (error) {
        console.error('Error fetching posts from MongoDB:', error);

        // note: make sure ip address is updated in atlas if you are gettng internal server error
        res.status(500).json({ error: 'Internal server error' });
    }
});

// start server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});