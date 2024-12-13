const cds = require('@sap/cds')
const { Books } = cds.entities ('sap.capire.bookshop')
const helper = require('./helper')

class CatalogService extends cds.ApplicationService { async init(){

  // Reduce stock of ordered books if available stock suffices
  this.on ('submitOrder', async req => {
    const {book,amount} = req.data, tx = cds.tx(req)
    let {stock} = await tx.read('stock').from(Books,book)
    if (stock >= amount) {
      await tx.update (Books,book).with ({ stock: stock -= amount })
      this.emit ('OrderedBook', { book, amount, buyer:req.user.id })
      return { stock }
    }
    else return req.error (409,`${amount} exceeds stock for book #${book}`)
  })

  // Add some discount for overstocked books
  this.after ('READ','Books', each => {
    helper.calculateDiscount(each);
  })

  return super.init()
}}

module.exports = { CatalogService }
