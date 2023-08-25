const express = require('express');
const app = express();
const { v4 } = require('uuid');

app.use(express.static('public'))

const whitelist = [
  '*'
];

app.use((req, res, next) => {
  const origin = req.get('referer');
  const isWhitelisted = whitelist.find((w) => origin && origin.includes(w));
  if (isWhitelisted) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,Content-Type,Authorization');
    res.setHeader('Access-Control-Allow-Credentials', true);
  }
  // Pass to next layer of middleware
  if (req.method === 'OPTIONS') res.sendStatus(200);
  else next();
});

app.get('/api', (req, res) => {
  const path = `/api/item/${v4()}`;
  res.setHeader('Content-Type', 'text/html');
  res.setHeader('Cache-Control', 's-max-age=1, stale-while-revalidate');
  // res.status(200).end(`Hello! Go to item: <a href="${path}">${path}</a>`);
  // res.send(JSON.stringify({ "test": true }))
  res.status(200).json({
    "message": `Hello! Go to item: <a href="${path}">${path}</a>`
  });

});

app.get('/api/item/:slug', (req, res) => {
  const { slug } = req.params;
  res.status(200).end(`Item: ${slug}`);
});

app.get('/', (req, res) => {
  res.sendFile('index.html', {root: path.join(__dirname, 'public')});
})

module.exports = app;
