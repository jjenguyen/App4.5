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

// code with mongodb implemented
// make sure to go to http://localhost:3000/posts when testing server to see json data
const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');

// create an express app
const app = express();
const port = 3000;

// enable cors
app.use(cors());

// mongodb connection string from mongodb atlas
const uri = "mongodb+srv://jn4gz:jn4gz12345@clustera4.jcqksc9.mongodb.net/cmp_sc4830_app4?retryWrites=true&w=majority";


// function to connect to MongoDB
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