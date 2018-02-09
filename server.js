const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 3100

express()
  .use(express.static(path.join(__dirname, 'dist')))
 app.get('*', function (req, res) {
  res.sendFile(path.join(__dirname, 'dist/index.html'));
})
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))