const {nanoid} = require('nanoid');
const bookshelf = require('./bookshelf');

const addBookHandler = (request, h) => {
  const {name, year, author,
    summary, publisher, pageCount, readPage, reading} = request.payload;

  const id = nanoid(16);
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;
  const finished = pageCount === readPage ? true : false;

  const newBook = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    pageCount,
    readPage,
    finished,
    reading,
    insertedAt,
    updatedAt,
  };

  if (name === undefined || name === '') {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  }
  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }

  bookshelf.push(newBook);

  const isSuccess = bookshelf.filter((book) => book.id === id).length > 0;

  if (isSuccess) {
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id,
      },
    });
    response.code(201);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku gagal ditambahkan',
  });
  response.code(500);
  return response;
};


const getAllBookHandler = (request, h) => {
  const {name, reading, finished} = request.query;
  let tmpFiltered = bookshelf;

  if (reading !== undefined) {
    tmpFiltered = tmpFiltered.filter((r) => r.reading == reading);
  }

  if (finished !== undefined) {
    tmpFiltered = tmpFiltered.filter((f) => f.finished == finished);
  }

  if (name !== undefined) {
    tmpFiltered = tmpFiltered.filter((n) => n.name.toLowerCase().includes(name.toLowerCase()));
  }

  tmpFiltered= tmpFiltered.map((book) => {
    const {id, name, publisher} = book;
    return {id, name, publisher};
  });
  const response = h.response({
    status: 'success',
    data: {
      books: tmpFiltered,
    },
  });
  response.code(200);
  return response;
};

const getBookByIdHandler = (request, h) => {
  const {id} = request.params;

  const book = bookshelf.filter((n) => n.id === id)[0];

  if (book !== undefined) {
    return {
      status: 'success',
      data: {
        book,
      },
    };
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan',
  });
  response.code(404);
  return response;
};

const editBookByIdHandler = (request, h) => {
  const {id} = request.params;

  const {name, year, author, summary, publisher, pageCount, readPage, reading} = request.payload;
  const updatedAt = new Date().toISOString();

  const index = bookshelf.findIndex((book) => book.id === id);

  if (name === undefined) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  }

  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }

  if (index !== -1) {
    bookshelf[index] = {
      ...bookshelf[index],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
      updatedAt,
    };

    const response = h.response({
      status: 'success',
      message: 'Buku berhasil diperbarui',
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Gagal memperbarui buku. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

const deleteBookByIdHandler = (request, h) => {
  const {id} = request.params;

  const index = bookshelf.findIndex((book) => book.id === id);

  if (index !== -1) {
    bookshelf.splice(index, 1);
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil dihapus',
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};


module.exports = {addBookHandler, getAllBookHandler, getBookByIdHandler, editBookByIdHandler, deleteBookByIdHandler};
