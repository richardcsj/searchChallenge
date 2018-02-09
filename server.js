const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 3100

express()
 	.use(express.static(path.join(__dirname, 'dist')))
	.use(function(req, res, next) {
	  res.header("Access-Control-Allow-Origin", "*");
	  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
	  next();
	})
  .get('*', function (req, res) {
  res.sendFile(path.join(__dirname, 'dist/index.html'));
})
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))