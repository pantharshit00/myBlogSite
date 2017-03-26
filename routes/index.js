const express = require('express');
const axios = require('axios');
const Remarkable = require('remarkable');
const md = new Remarkable({
  html: true
})

const Post = require('../models/posts');
const router = express.Router();

router.get('/', (req, res) => {
  res.render('index', { title: "Home | Harshit's Code Blogs" });
});

router.get('/blog/:id', (req, res) => {
  Post.findOne({
    where: {
      id: req.params.id
    }
  }).then((post) => {
    let blog = post;
    blog.content = md.render(blog.content)
    if (post == null)
      res.status(404).render('fourntfour');
    else
      res.render('blogpost', { blog, title: post.title + " | Harshit's Code Blogs" });
  })
})

let host = (process.env.NODE_ENV !== "production") ? 'http://localhost:8080' : "http://138.197.74.123:8080";
console.log(host);

router.get('/blogs', (req, res) => {

  // Getting page requested from query
  let page = req.query.page ? parseInt(req.query.page) : 1;

  // Making xhr to /get_blog api using axios
  axios.get(host + "/get_blogs?page=" + page).then((result) => {

    // Finding max no of articles
    Post.max('id').then((max_id) => {

      // Pagination Bar making logics
      let paginationUl = (page - 1 != 0) ? `<li><a href="/blogs?page=${page - 1}">&laquo;</a></li>` : ``;

      for (let i = 1; i <= Math.ceil(max_id / 10); i++) {
        if (i == page) { // Active class making logic
          paginationUl += `
            <li class="active"><a href="/blogs?page=${i}">${i}</a></li>
        `;
        }
        else {
          paginationUl += `
            <li><a href="/blogs?page=${i}">${i}</a></li>
        `;
        }
      }

      paginationUl += (Math.ceil(max_id / 10) != page) ? `<li><a href="/blogs?page=${page + 1}">&raquo;</a></li>` : ``;

      let pagination = `
      <nav>
        <ul class="pagination pagination-sm">
          ${paginationUl}
        </ul>
      </nav>
      `;

      // Templationg posts by using data from xhr

      let postsJSON = result.data;
      let posts = ``;


      // Logic to render only 10 posts per page
      // Checking if it is the last page and rendering according to it

      if (Math.ceil(max_id / 10) !== page) {
        for (let i = (page * 10) - 1; i >= (page * 10) - 10; i--) {
          let currentPost = postsJSON[i];
          if (currentPost == undefined)
            continue;
          currentPost.preview = md.render(currentPost.preview);
          posts += `<div class="panel panel-primary">
                      <div class="panel-heading">
                        <a href="/blog/${currentPost.id}"><h4>${currentPost.title}</h4></a>
                      </div>
                      <div class="panel-body">
                        ${currentPost.preview}<a href="/blog/${currentPost.id}" class="btn btn-primary">Read More</a>
                      </div>
                      <div class="panel-footer">
                        <h5>${new Date(currentPost.updatedAt).toLocaleString()}</h5>
                      </div>
                    </div>`
        }
      }
      else {
        for (let i = max_id - 1; i >= (page * 10) - 10; i--) {
          let currentPost = postsJSON[i];
          if (currentPost == undefined)
            continue;
          posts += `<div class="panel panel-primary">
                      <div class="panel-heading">
                        <a href="/blog/${currentPost.id}"><h4>${currentPost.title}</h4></a>
                      </div>
                      <div class="panel-body">
                        ${currentPost.preview}<a href="/blog/${currentPost.id}" class="btn btn-primary">Read More</a>
                      </div>
                      <div class="panel-footer">
                      <h5>${new Date(currentPost.updatedAt).toLocaleString()}</h5>
                      </div>
                    </div>`
        }
      }
      posts += pagination;
      res.render('blogs', {
        title: "All Posts | Harshit's Code Blogs",
        posts
      })
    })
  }).catch((err) => { console.log(err); if (err.response.status == 404) res.status(404).render('fourntfour') })
});

router.get('/get_blogs', (req, res) => {
  let page = req.query.page ? req.query.page : 1;
  Post.findAll({ limit: page * 10 }).then((posts) => {
    if (posts == null)
      res.json({ err: "Not Found" })
    else {
      let blogs = [];
      for (let post of posts) {
        post.preview = md.render(post.preview);
        blogs.push(post);
      }
      res.json(blogs);
    }
  })
})

router.get('/search', (req, res) => {
  res.render('search', {
    title: "Search | hpcodeblogs"
  })
})

router.get('/about',(req,res)=>{
  res.render('about',{
    title: "About Page | Harshit's Code Blogs"
  })
});

router.get("*", (req, res) => {
  res.status(404).render('fourntfour');
})

module.exports = router;
