# Redditto

This is my take on the popular website Reddit, which is a full stack project featuring many of its core features.

## Tech used

Front end: React, Redux, styled-components
Back end: Node.js, Express, MySQL

## Why? What did I learn?

After going through [Full stack open](https://fullstackopen.com/en/), I felt confident that I could build any website I wanted. Since I was also very familiar with Reddit, I challenged myself to cloning as many of Reddit's features as I could for my first serious full stack project. 

I learned a lot about how both the front end and the back end work together to make a dynamic site. Because a lot of the website's data was relational (e.g. users relate to comments, groups relate to posts), I also had to learn how to utilize SQL joins to get the data I needed.

One decision I made early on was to use Redux to store all the website's data, including posts and comments. Later on I realized this wasn't a smart idea, because hypothetically speaking, if the website scaled to have thousands of posts/comments, the user would be loading a lot of unnecessary data. The smarter solution I went for was to let the component fetch the data it needs as it renders and as its state changes. I also implemented pagination as I was considering scalability.

## Features

* User authentication
* Group (i.e. subreddit) creation
* Users can post to groups
* Users can comment on posts
* Nested comments
* Voting system for comments and posts
* Messaging system
  * Users get a message whenever someone comments on their post or replies to their comment
  * Users can message each other
* Pagination
