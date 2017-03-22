/**
 * Copyright  2017 Harshit Pant
 * license : MIT
 */

// Bringing express in setiing up the express router
const express = require('express');
const router = express.Router();


// Bringing in our model
const Post = require('../models/posts');

// Getting our secret token from environment variables
const token = process.env.SECRET_TOKEN;

// Setting up our router to use our custom token based authentication middleware
router.all('*', (req, res, next) => {
    // If the query contains the vaild token we will call next
    if (req.query.token == token)
        next();
    else
        // Else just simply reply 404 as to pretend that resource not exist
        res.status(404).render('fourntfour');
})

// Just rendering the root view not big stuff LOL
router.get('/', (req, res) => {
    res.render('admin', {
        secret: token, // Passing the secret token along for use in ejs
        title: "Site Administration | Harshit's Code Blogs"
    });
})

// Rendering create_new view
router.get('/create_new', (req, res) => {
    res.render('create_new', {
        title: "Create new | Site Administration | Harshit's Code Blogs",
        secret: token
    });
});

// Handling the post request from the create new form
router.post('/create_new', (req, res) => {
    // Since I have installed body-parser request contains a body with ll form data
    let title = req.body.title; // Extrating title and others
    let content = req.body.content;
    let preview = req.body.preview;

    // Validation | if a field is left empty
    if (title == "" || content == "" || preview == "") {
        res.send(`<h1>Oops you have not filled all the fields</h1><a href="?token=${token}">Back</a>`)
    }
    else {
        // Using sequelize model function to create a new post
        // SQL QUERY: INSERT INTO blogs (*colums in which vals are being inserted*) VALUES (*values*);
        Post.create({
            title,
            content,
            preview
        }).then((new_post) => { // It return a promise with the new post
            res.redirect(`/blog/${new_post.id}`) // After creation redirecting to the post itself.
        })
    }
});

// Rendering edit post view
router.get('/edit_posts', (req, res) => {
    res.render('edit_posts', {
        title: "Edit Post | Site Administration | Harshit's Blog Posts",
        secret: token
    })
})

// Edit posts fetch api. I have fetch them in the view using jQuery
// I might have used axios but I have to include $ for bootstrap so I used $.ajax 
router.get('/edit_posts/fetch', (req, res) => {
    // Return all post from our database using sequelize model function 
    // SQL QUERY :   SELECT * FROM blogs;
    Post.findAll().then((postsreq) => { // Returns a promise with all the posts
        let posts = ``; // initalizing posts variable
        for (let i = postsreq.length - 1; i >= 0; i--) { // if dont use for let as i want to get the
            let post = postsreq[i];                      // latest posts first so reverse loop
            //  used es6 templeting literals to form the markup
            let textPost = `
            <div class="panel panel-default">
                <div class="panel-heading">
                    <div class="panel-title">
                        ${post.title}
                         <a href="/admin/edit_post/delete?id=${post.id}&token=${token}" class="delete pull-right">
                            <i class="fa fa-trash fa-2x"></i>
                        </a>
                        <a href="/admin/edit_post/${post.id}?token=${token}" class="pull-right">
                            <i class="fa fa-pencil-square-o fa-2x"></i>
                        </a>
                    </div>
                </div>
            </div>
            `;
            posts += textPost; // concatinating each post to posts
        }
        res.send(posts); // Sending em out
    })
});

// Handling post request for edit_post form
router.post('/edit_post/update', (req, res) => {
    // as done above extracting data from req.body and setting them in a object
    newPost = {
        title: req.body.title,
        content: req.body.content,
        preview: req.body.preview
    }

    // Updating then with the new values using sequelize model function
    // SQL QUERY: UPDATE blogs SET *values here* WHERE id=*req.query.id*
    Post.update(newPost, {
        where: {
            id: req.query.id
        }
    }).then(() => {
        res.redirect('/blog/' + req.query.id) //redirecting to the updated blog it self
    })
})

// Handling delete
router.get('/edit_post/delete', (req, res) => {
    // SQL QUERY: DELETE FROM blogs WHERE id=*req.query.id*
    Post.destroy({
        where: {
            id: req.query.id
        }
    }).then(() => {
        res.redirect('back') // Redirecting to the previous page
    })
})

// Handling to view ehich renders the posts editing form
router.get('/edit_post/:id', (req, res) => {
    // SQL QUERY: SELECT * FROM blogs WHERE id=*req.query.id* LIMIT 1;
    Post.findOne({
        where: {
            id: req.params.id
        }
    }).then((post) => {
        res.render("edit_post", {
            title: `Edit ${post.title} | Site Administration | Harshit's Blog`,
            post, // Sending the post along to render
            secret: token
        })
    })
})

// Exporting our express router
module.exports = router;
