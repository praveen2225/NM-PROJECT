const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");

const app = express();

// MongoDB connection
mongoose.connect("mongodb://localhost:27017/blogDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Middleware
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

// Mongoose Schema
const blogSchema = new mongoose.Schema({
  title: String,
  image: String,
  content: String,
  created: { type: Date, default: Date.now },
});

const Blog = mongoose.model("Blog", blogSchema);

// Routes

// Home route - show all blogs
app.get("/", async (req, res) => {
  const blogs = await Blog.find().sort({ created: -1 });
  res.render("index", { blogs });
});

// New blog form
app.get("/blogs/new", (req, res) => {
  res.render("new");
});

// Create new blog
app.post("/blogs", async (req, res) => {
  await Blog.create(req.body.blog);
  res.redirect("/");
});

// Show one blog
app.get("/blogs/:id", async (req, res) => {
  const blog = await Blog.findById(req.params.id);
  res.render("show", { blog });
});

// Edit form
app.get("/blogs/:id/edit", async (req, res) => {
  const blog = await Blog.findById(req.params.id);
  res.render("edit", { blog });
});

// Update blog
app.put("/blogs/:id", async (req, res) => {
  await Blog.findByIdAndUpdate(req.params.id, req.body.blog);
  res.redirect(`/blogs/${req.params.id}`);
});

// Delete blog
app.delete("/blogs/:id", async (req, res) => {
  await Blog.findByIdAndDelete(req.params.id);
  res.redirect("/");
});

// Start server
app.listen(3000, () => {
  console.log("Blog server started on http://localhost:3000");
});
