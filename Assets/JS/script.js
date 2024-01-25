document.addEventListener("DOMContentLoaded", function () {
  const RENDER_EVENT = "render-todo";
  const SAVED_EVENT = "saved-book";
  const STORAGE_KEY = "BOOKS_APPS";

  const showAddBtn = document.getElementById("showBookBtn");
  const outsideKlick = document.getElementById("divOne");
  const closeModalBtn = document.getElementById("close");
  const closeModalBtnEdit = document.getElementById("closeEditBook");
  const searchButton = document.getElementById("submit-search");
  const submitForm = document.getElementById("form");
  const bookLogo = document.getElementById("book-logo");
  const deleteModal = document.getElementById("deleteModal");
  const confirmDelete = document.getElementById("ya");
  const cancelDelete = document.getElementById("tidak");
  const outsideModalDelete = document.getElementById("deleteModal");

  const books = [];

  initializeEventListeners();

  function initializeEventListeners() {
    showAddBtn.addEventListener("click", handleShowAddBtnClick);
    outsideKlick.addEventListener("click", handleOutsideKlick);
    closeModalBtn.addEventListener("click", handleCloseModalBtnClick);
    closeModalBtnEdit.addEventListener("click", handleCloseModalBtnEditClick);
    searchButton.addEventListener("click", handleSearchButtonClick);
    submitForm.addEventListener("submit", handleSubmitForm);
  }

  bookLogo.addEventListener("click", function () {
    location.reload();
  });

  function handleShowAddBtnClick() {
    var modal = document.getElementById("divOne");
    modal.style.display = "block";
    modal.style.opacity = "1";
  }

  function handleOutsideKlick(event) {
    if (event.target !== event.currentTarget) {
      return;
    }
    var modal = document.getElementById("divOne");
    closeModal(modal);
  }

  function handleCloseModalBtnClick() {
    var modal = document.getElementById("divOne");
    closeModal(modal);
  }

  function handleCloseModalBtnEditClick() {
    var modal = document.getElementById("editBookModal");
    closeModal(modal);
  }

  function closeModal(modal) {
    modal.style.display = "none";
    modal.style.opacity = "0";
    resetForm();
  }

  function resetForm() {
    document.getElementById("judul").value = "";
    document.getElementById("penulis").value = "";
    document.getElementById("tahun").value = "";
    document.getElementById("dibaca").checked = false;
  }

  function handleSearchButtonClick(event) {
    event.preventDefault();
    document.dispatchEvent(new Event(RENDER_EVENT));
  }

  function handleSubmitForm() {
    addBook();
    resetForm();
  }

  function generateBookObject(id, title, author, year, isComplete) {
    return {
      id,
      title,
      author,
      year,
      isComplete,
    };
  }

  function makeBooks(booksObject) {
    const textTitle = document.createElement("h2");
    textTitle.innerText = `Judul Buku : ${booksObject.title}`;

    const textAuthor = document.createElement("p");
    textAuthor.innerText = `Penulis : ${booksObject.author}`;

    const textYear = document.createElement("p");
    textYear.innerText = `Tahun : ${booksObject.year}`;

    const trashButton = document.createElement("button");
    trashButton.classList.add("trash-btn");

    const completedButton = document.createElement("button");
    completedButton.classList.add("completed-btn");
    completedButton.setAttribute("value", `${booksObject.id}`);

    const editButton = document.createElement("button");
    editButton.classList.add("edit-btn");
    editButton.setAttribute("value", `${booksObject.id}`);

    const reReadBtn = document.createElement("button");
    reReadBtn.classList.add("re-read-btn");
    reReadBtn.setAttribute("value", `${booksObject.id}`);

    const actionContainer = document.createElement("div");
    actionContainer.classList.add("action-container");

    const textContainer = document.createElement("div");
    textContainer.append(textTitle, textAuthor, textYear, actionContainer);
    textContainer.setAttribute("data-book-id", booksObject.id);

    if (!booksObject.isComplete) {
      const unCompletedListBookContainer =
        document.getElementById("book-belum-dibaca");
      actionContainer.append(completedButton, editButton, trashButton);
      unCompletedListBookContainer.append(textContainer);
    } else {
      const isCompletedListBookContainer =
        document.getElementById("book-sudah-dibaca");
      actionContainer.append(reReadBtn, editButton, trashButton);
      isCompletedListBookContainer.append(textContainer);
    }

    function findBookIndex(bookId) {
      return books.findIndex((book) => book.id === bookId);
    }

    function deleteBook(bookId) {
      const targetBook = findBookIndex(bookId);

      if (targetBook === -1) {
        return;
      }
      books.splice(targetBook, 1);
      document.dispatchEvent(new Event(RENDER_EVENT));
      saveBook();
    }

    trashButton.addEventListener("click", function () {
      deleteModal.style.display = "flex";

      confirmDelete.addEventListener("click", function (event) {
        deleteBook(booksObject.id);
        document.dispatchEvent(new Event(RENDER_EVENT));
        console.log(`Buku dengan ID : ${booksObject.id} berhasil dihapus!!`);
        deleteModal.style.display = "none";
        event.preventDefault();
      });

      cancelDelete.addEventListener("click", function () {
        deleteModal.style.display = "none";
      });
      outsideModalDelete.addEventListener("click", function (event) {
        if (event.target !== event.currentTarget) {
          return;
        }
        var modal = document.getElementById("deleteModal");
        modal.style.display = "none";
      });
    });

    function addCompletedBook(bookId) {
      const targetBookIndex = findBookIndex(bookId);

      if (targetBookIndex !== -1) {
        books[targetBookIndex].isComplete = true;
        document.dispatchEvent(new Event(RENDER_EVENT));
        console.log(
          `Buku dengan ID : ${booksObject.id} telah selesai dibaca!!`
        );
        saveBook();
      }
    }

    function removeCompletedBook(bookId) {
      const targetBookIndex = findBookIndex(bookId);

      if (targetBookIndex !== -1) {
        books[targetBookIndex].isComplete = false;
        document.dispatchEvent(new Event(RENDER_EVENT));
        saveBook();
      }
    }

    completedButton.addEventListener("click", function () {
      addCompletedBook(booksObject.id);
    });

    reReadBtn.addEventListener("click", function () {
      removeCompletedBook(booksObject.id);
    });

    editButton.addEventListener("click", function () {
      ShowEditBook(booksObject.id);
    });

    function ShowEditBook(bookId) {
      var modal = document.getElementById("editBookModal");
      modal.style.display = "block";
      modal.style.opacity = "1";
      const targetBookIndex = findBookIndex(bookId);
      console.log(targetBookIndex);

      const editTitle = document.getElementById("editJudul");
      const editAuthor = document.getElementById("editPenulis");
      const editYear = document.getElementById("editTahun");
      const editDibaca = document.getElementById("editDibaca");
      const editForm = document.getElementById("editForm");

      editTitle.value = books[targetBookIndex].title;
      editAuthor.value = books[targetBookIndex].author;
      editYear.value = books[targetBookIndex].year;
      editDibaca.checked = books[targetBookIndex].isComplete;

      editForm.setAttribute("data-book-id", bookId);
    }

    const editForm = document.getElementById("editForm");
    editForm.addEventListener("submit", function (event) {
      event.preventDefault();
      const bookId = editForm.getAttribute("data-book-id");
      editBook(bookId);
    });

    function editBook(bookId) {
      const targetBookIndex = findBookIndex(bookId);

      if (targetBookIndex !== -1) {
        books[targetBookIndex].title =
          document.getElementById("editJudul").value;
        books[targetBookIndex].author =
          document.getElementById("editPenulis").value;
        books[targetBookIndex].year = Number(
          document.getElementById("editTahun").value
        );
        books[targetBookIndex].isComplete =
          document.getElementById("editDibaca").checked;
      }
      document.dispatchEvent(new Event(RENDER_EVENT));
      saveBook();
      var modal = document.getElementById("editBookModal");
      closeModal(modal);
    }

    return textContainer;
  }
  document.addEventListener(RENDER_EVENT, function () {
    const unCompletedRead = document.getElementById("book-belum-dibaca");
    unCompletedRead.innerHTML = "";
    const isCompletedRead = document.getElementById("book-sudah-dibaca");
    isCompletedRead.innerHTML = "";

    const searchTerm = document.getElementById("search").value.toLowerCase();

    for (const bookItem of books) {
      if (bookItem.title.toLowerCase().includes(searchTerm)) {
        const bookElement = makeBooks(bookItem);
        if (!bookItem.isComplete) {
          unCompletedRead.append(bookElement);
        } else {
          isCompletedRead.append(bookElement);
        }
      }
    }
  });

  function addBook() {
    const title = document.getElementById("judul").value;
    const author = document.getElementById("penulis").value;
    const year = Number(document.getElementById("tahun").value);
    const isComplete = document.getElementById("dibaca").checked;
    const generatedID = `Book-${+new Date()}`;

    const booksObject = generateBookObject(
      generatedID,
      title,
      author,
      year,
      isComplete
    );

    books.push(booksObject);
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveBook();
  }

  function saveBook() {
    if (isStorageExist()) {
      const parsed = JSON.stringify(books);
      localStorage.setItem(STORAGE_KEY, parsed);
      document.dispatchEvent(new Event(SAVED_EVENT));
    }
  }

  document.addEventListener(SAVED_EVENT, function () {
    console.log(localStorage.getItem(STORAGE_KEY));
  });

  function loadLocalStorage() {
    const serializedData = localStorage.getItem(STORAGE_KEY);
    let data = JSON.parse(serializedData);

    if (data != null) {
      for (const book of data) {
        books.push(book);
      }
    }
    document.dispatchEvent(new Event(RENDER_EVENT));
  }

  function isStorageExist() {
    if (typeof Storage === undefined) {
      alert("Browser kamu tidak mendukung local storage");
      return false;
    }
    return true;
  }

  if (isStorageExist()) {
    loadLocalStorage();
  }
});
