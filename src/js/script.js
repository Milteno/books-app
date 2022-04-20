/* global Handlebars, utils, dataSource */ // eslint-disable-line no-unused-vars

{
  'use strict';

  const select = {
    books: {
      booksPanel: '.books-panel',
      bookList: '.books-list',
      bookImageAttrib: 'data-id',
      cardOfBook: '.book',
      bookImage: '.book__image',
    },
    templateOf: {
      bookTemplate: '#template-book',
    },
    form: {
      formName: '.filters',
    }
  };
  const templates = {
    bookCard: Handlebars.compile(document.querySelector(select.templateOf.bookTemplate).innerHTML),
  };

  class BooksList {
    constructor() {
      const thisBook = this;
      thisBook.render();
      thisBook.initActions();
    }

    determineRatingBgc(rating) {
      let background = '';
      if (rating < 6) {
        background = 'linear-gradient(to bottom,  #fefcea 0%, #f1da36 100%)';
      } else if (rating > 6 && rating <= 8) {
        background = 'linear-gradient(to bottom, #b4df5b 0%,#b4df5b 100%)';
      } else if (rating > 8 && rating <= 9) {
        background = 'linear-gradient(to bottom, #299a0b 0%, #299a0b 100%)';
      } else if (rating > 9) {
        background = 'linear-gradient(to bottom, #ff0084 0%,#ff0084 100%)';
      }
      return background;
    }
    render() {
      const thisBook = this;
      for (const book of dataSource.books) {
        book.ratingBgc = thisBook.determineRatingBgc(book.rating);
        book.ratingWidth = book.rating * 10;
        const generatedHTML = templates.bookCard(book);
        const element = utils.createDOMFromHTML(generatedHTML);
        thisBook.listOfBooks.appendChild(element);
      }
    }
    getElements() {
      const thisBook = this;
      thisBook.listOfBooks = document.querySelector(select.books.bookList);
      thisBook.refToBooks = document.querySelector(select.books.bookList);
      thisBook.form = document.querySelector(select.form.formName);
    }

    initActions() {
      const thisBook = this;
      const favoriteBooks = [];
      thisBook.filters = [];

      thisBook.refToBooks.addEventListener('dblclick', function(event){
        event.preventDefault();
        const targetedElement = event.target.offsetParent;
        const bookId = targetedElement.getAttribute(select.books.bookImageAttrib);
        if(!targetedElement.classList.contains('favorite')) {
          targetedElement.classList.add('favorite');
          favoriteBooks.push(bookId);
          console.log(favoriteBooks);
        }
        else {
          targetedElement.classList.remove('favorite');
          const index = favoriteBooks.indexOf(bookId);
          favoriteBooks.splice(index, 1);
          console.log(favoriteBooks);
        }
      });
      thisBook.form.addEventListener('click', function(event){
        if(event.target.type == 'checkbox') {
          const value = event.target.value;
          const isChecked = event.target.checked;
          if(isChecked) {
            thisBook.filters.push(value);
          }
          else {
            thisBook.filters.splice(thisBook.filters.indexOf(value), 1);
          }
        }
        thisBook.filterBooks();
      });

    }
    filterBooks() {
      const thisBook = this;
      for(let book of dataSource.books) {
        const dataId = document.querySelector(select.books.bookImage + '[data-id = "' + book.id + '"]');
        let shouldBeHidden = false;
        for(let filter of thisBook.filters) {
          if(!book.details[filter]) {
            shouldBeHidden = true;
            break;
          }
        }
        if (shouldBeHidden) {
          dataId.classList.add('hidden');
        } else {
          dataId.classList.remove('hidden');
        }

      }
    }
  }
  new BooksList();
}
