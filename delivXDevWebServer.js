const express = require('express');
const next = require('next');
const cors = require('cors');


var cookieParser = require('cookie-parser');
const { version } = require("./package.json");

// const port = parseInt(process.env.PORT, 10) || 3000
const port = 3535
const dev = false // uncomment this line for production build and comment below line 
// const dev = process.env.NODE_ENV !== 'production' // uncomment this line for development build and comment above line
const app = next({ dev })
const handle = app.getRequestHandler();


function checkCookies(req, res, cb) {
  // if (!req.cookies.version) {
  //   res.cookie('version', version);
  //   return cb(null, true);
  // }
  // if (req.cookies.version != version) {
  //   Object.keys(req.cookies).map((key) => {
  //     res.clearCookie(key);
  //   });
  //   res.cookie('version', version);
  //   // res.cookie('redirect', true);
  //   res.redirect('/');
  // }
  return cb(null, true);
}

app.prepare()
  .then(() => {
    const server = express();
    server.use(cookieParser());

    server.get('/stores/:name', (req, res) => {
      checkCookies(req, res, (err, result) => {
        if (result) {
          const actualPage = '/stores'
          const queryParams = { title: req.params.name }
          app.render(req, res, actualPage, queryParams);
        }
      })
    })


    server.get('/category/:name', (req, res) => {
      checkCookies(req, res, (err, result) => {
        if (result) {
          const actualPage = '/categories'
          const queryParams = { title: req.params.name }
          app.render(req, res, actualPage, queryParams)
        }
      });
    })

    server.get('/:storeName/:categoryName/:subCategoryName', (req, res) => {
      const actualPage = '/subcategories'
      const queryParams = { title0: req.params.storeName, title1: req.params.categoryName, title2: req.params.subCategoryName }
      app.render(req, res, actualPage, queryParams)
    })

    server.get('/search/:name', (req, res) => {
      checkCookies(req, res, (err, result) => {
        if (result) {
          const actualPage = '/search'
          const queryParams = { title: req.params.name }
          app.render(req, res, actualPage, queryParams)
        }
      });
    })

    // server.get('/product/:name', (req, res) => {
    server.get('/details/:cityName/:areaName/:storeName/:productName', (req, res) => {
      checkCookies(req, res, (err, result) => {
        if (result) {
          const actualPage = '/details'
          const queryParams = { title: req.params.name, id: req.query.id }
          app.render(req, res, actualPage, queryParams)
        }
      });
    })

    server.get('/brands/:name', (req, res) => {
      checkCookies(req, res, (err, result) => {
        if (result) {
          const actualPage = '/brands'
          const queryParams = { title: req.params.name }
          app.render(req, res, actualPage, queryParams)
        }
      });
    })

    server.get('/offers/:name', (req, res) => {
      checkCookies(req, res, (err, result) => {
        if (result) {
          const actualPage = '/offers'
          const queryParams = { title: req.params.name }
          app.render(req, res, actualPage, queryParams)
        }
      });
    })

    server.get('/:cityName/:categoryType', (req, res) => {
      checkCookies(req, res, (err, result) => {
        if (result) {
          const actualPage = '/mainPage'
          const queryParams = { title: req.params.name }
          app.render(req, res, actualPage, queryParams);
        }
      })
    })

    server.get('*', (req, res) => {
      return handle(req, res)
    })

    server.listen(port, (err) => {
      if (err) throw err
      console.log(`> Ready on http://localhost:${port}`)
    })
  })
