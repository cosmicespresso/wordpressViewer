A simple viewer that renders local as well as remote data from Wordpress API. 
Still working on rendering very nested objects.

Run with `yarn start`.

For serving local files here is the `server.js` file I'm using (you have to `npm install express` and `npm install cors`)

```
const express = require('express')
const cors = require('cors')

const app = express()
const port = 3002

app.use(cors())

const categories = require('../data/categories.json')
const comments = require('../data/comments.json')
const media = require('../data/media.json')
const posts = require('../data/posts.json')
const tags = require('../data/tags.json')

app.get('/categories', (req, res) => res.json(categories));
app.get('/comments', (req, res) => res.json(comments));
app.get('/media', (req, res) => res.json(media));
app.get('/posts', (req, res) => res.json(posts));
app.get('/tags', (req, res) => res.json(tags));

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))
```

and run with `node server.js`.