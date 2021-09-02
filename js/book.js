// global variable and initialization
const userInputField = document.getElementById('user-input-field');
const totalResults = document.getElementById('total-result-found');

const getElement = (id) => {
	return document.getElementById(id);
};

// getting user input value from input field
const userInput = () => {
	let userInputValue = userInputField.value;
	loadBooksData(userInputValue);
	userInputField.value = '';
};

//Keyboard enter implementation
userInputField.addEventListener('keyup', (event) => {
	if (event.keyCode === 13 || event.keyCode === 'Enter') {
		userInput();
	}
});

// calling the openlibrary api to load the data
const loadBooksData = async (userInput) => {
	try {
		showSpinner('spinner');
		const booksContainer = getElement('books-container');
		booksContainer.textContent = '';
		totalResults.textContent = '';
		if (userInput !== '') {
			const bookUrl = `https://openlibrary.org/search.json?q=${userInput}`;
			const response = await fetch(bookUrl);
			const data = await response.json();
			displayBookInfo(data);
		} else {
			errorMessage(`No Result found! try again....!!`);
		}
		hideSpinner('spinner');
	} catch (error) {
		console.log(error);
	}
};

// displaying book details
const displayBookInfo = (bookInfo) => {
	const booksContainer = getElement('books-container');
	booksContainer.textContent = '';
	totalSearchResultFound(bookInfo, booksContainer);
};

// total search result
const totalSearchResultFound = (bookInfo, booksContainer) => {
	if (bookInfo.docs.length > 0) {
		totalResults.classList.remove('d-none', 'text-center', 'text-danger');
		const div = document.createElement('div');
		div.innerHTML = totalResultAlertHtml(bookInfo);
		totalResults.appendChild(div);

		bookInfo.docs?.forEach((book) => {
			const div = document.createElement('div');
			div.innerHTML = generateBookHtml(book);
			booksContainer.appendChild(div);
		});
	} else {
		errorMessage(`No Result found! try again....!!`);
	}
};

// show and hide spinner functions
const hideSpinner = (id) => {
	const spinner = getElement(id);
	spinner.classList.add('d-none');
};
const showSpinner = (id) => {
	const spinner = getElement(id);
	spinner.classList.remove('d-none');
};

//Error message function
const errorMessage = (errorMsg) => {
	totalResults.classList.remove('d-none');
	totalResults.classList.add('text-center', 'text-danger', 'fs-5');
	totalResults.innerText = errorMsg;
};

//generating book HTML to display details
const generateBookHtml = (book) => {
	const {
		cover_i,
		title,
		title_suggest,
		publisher,
		publish_date,
		first_publish_year,
		author_name,
		author_alternative_name,
		language,
	} = book;

	//conditions to check the values
	const bookImgUrl = `https://covers.openlibrary.org/b/id/${
		cover_i !== undefined ? cover_i : 6487762
	}-M.jpg`;

	const bookTitle = title ? title : title_suggest;
	const authorName = book.hasOwnProperty('author_name')
		? author_name[0]
		: author_alternative_name;
	const publisherName = publisher ? publisher[0] : 'N/A';
	const firstPublishYear = first_publish_year ? first_publish_year : 'N/A';
	const bookLanguage = language ? language : 'N/A';
	const publishDate = publish_date !== undefined ? publish_date[0] : 'N/A';

	return `
        <div class="card border-primary border-bottom border-3 border-0 h-100">
            <img src="${bookImgUrl}" class="card-img-top image-cover" alt="book image">
            <div class="card-body p-1">
                <h5 class="card-title text-primary">Title: ${bookTitle}</h5>
                <ul class="list-group list-group-flush">
                    <li class="list-group-item"><strong>Author:</strong> ${
											authorName || 'N/A'
										}</li>
                    <li class="list-group-item"><strong>Publisher:</strong> ${publisherName}</li>
                    <li class="list-group-item"><strong>Publish Date:</strong> ${publishDate}</li>
                    
                </ul>
            </div>
            <div class="row row-group border-top g-0">
				<div class="col">
					<div class="p-3 text-start">
						<p class="mb-0 text-danger">Language: ${bookLanguage}</p>
					</div>
				</div>
				<div class="col">
					<div class="p-3 text-start">
						<p class="mb-0 text-success">Year: ${firstPublishYear}</p>
					</div>
				</div>
			</div>
        </div>`;
};

const totalResultAlertHtml = (alertMsg) => {
	return `
        <div class="alert border-0 border-start border-5 border-primary alert-dismissible fade show py-2">
            <div class="d-flex align-items-center">
                <div class="font-35 text-primary"><i class="fas fa-heartbeat fa-2x"></i>
                
                </div>
                <div class="ms-3">
                    <h6 class="mb-0 text-primary fs-5">#Result found: ${alertMsg.numFound}</h6>
                    <div>Successfully loaded!</i></div>
                </div>
            </div>
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>`;
};
