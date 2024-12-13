const cds = require('@sap/cds')

//Black box testing
describe('CatalogService', () => {
  let GET, Books, service;
  ({ GET, POST, Books } =  cds.test(__dirname + '/..', '--with-mocks'));

  test('Service is initialized', async () => {
    service = await cds.connect.to('CatalogService');
    const books = await GET('/browse/Books');
    expect(books).toBeDefined();
        
  })
  test('submitOrder reduces stock if available stock suffices', async () => {
    service = await cds.connect.to('CatalogService');
    const bookId = 1;
    const initialStock = 150;
    const orderAmount = 10;

    // Mock the Books entity
    const Books = cds.entities('sap.capire.bookshop').Books;
    await cds.run(INSERT.into(Books).entries({ ID: bookId, stock: initialStock }));

    const response = await POST('/browse/submitOrder', { book: bookId, amount: orderAmount });
    expect(response.data.stock).toBe(initialStock - orderAmount);

    const updatedBook = await cds.run(SELECT.one.from(Books).where({ ID: bookId }));
    expect(updatedBook.stock).toBe(initialStock - orderAmount);
  });

  test('submitOrder returns error if stock is insufficient', async () => {
    service = await cds.connect.to('CatalogService');
    const bookId = 2;
    const initialStock = 5;
    const orderAmount = 10;

    // Mock the Books entity
    const Books = cds.entities('sap.capire.bookshop').Books;
    await cds.run(INSERT.into(Books).entries({ ID: bookId, stock: initialStock }));

    try {
      await POST('/browse/submitOrder', { book: bookId, amount: orderAmount });
    } catch (error) {
      expect(error).toBeDefined();
      expect(error.response.status).toBe(409);
      expect(error.message).toContain('409 - 10 exceeds stock for book #2');
    }
  });

  test('Books read operation adds discount for overstocked books', async () => {
    service = await cds.connect.to('CatalogService');
    const bookId = 3;
    const overstockedBook = { ID: bookId, title: 'Test Book', stock: 150 };

    // Mock the Books entity
    const Books = cds.entities('sap.capire.bookshop').Books;
    await cds.run(INSERT.into(Books).entries(overstockedBook));

    const books = await GET('/browse/Books');
    const book = books.data.value.find(b => b.ID === bookId);
    expect(book.title).toContain('-- 11% discount!');
  });
})