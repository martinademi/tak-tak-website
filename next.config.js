
const withSass = require('@zeit/next-sass')

module.exports =  withSass({
  exportPathMap: function () {
    return {
      '/': { page: '/' },
      '/:cityName/:categoryType' : {page: '/mainPage'},
      '/stores/:name': { page: '/stores' },
      '/about': { page: '/about' },
      '/contact': { page: '/contact' },
      '/profile': { page: '/profile' },
      '/payment-redirect': { page: '/payment-redirect' },
      '/restaurant/:name': { page: '/restofront' },
      '/checkout': { page: '/checkout' },
      '/productList': { page: '/productList' },
      '/category/:name' : {page: '/categories'},
      '/categories/:subCategoryName' : {page: '/subcategories'},
      '/storeList/:categoryName' : {page: '/storeList'},
      '/store/:storeName/:categoryName/:subCategoryName' : {page: '/subcategories'},
      '/search/:name' : {page: '/search'},
      '/brands/:name' : {page: '/brands'},
      // '/product/:name' : {page: '/details'},
      '/details/:cityName/:areaName/:storeName/:productName' : {page: '/details'},
      '/offers/:name' : {page: '/offers'}
    }
  }
})
