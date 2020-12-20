// counts for retrying to fetch quote
let count = 0;

// empty array to hold our quotes
let apiQuotes = [];

// holds the quote
let quote;

// random number for our quotes
let randomQuoteNum;

// setting our constants to our html elements
const quoteContainer = document.getElementById('quote-container');
const quoteText = document.getElementById('quote');
const authorText = document.getElementById('author');
const twitterBtn = document.getElementById('twitter');
const newQuoteBtn = document.getElementById('new-quote');
const loader = document.getElementById('loader');
const errorContainer = document.getElementById('error-container');
const errorText = document.getElementById('error-text');
const retryText = document.getElementById('retry-text');

function showErrorContainer() {
    retryText.hidden = false;
    errorText.hidden = true;
    errorContainer.hidden = false;
    quoteContainer.hidden = true;
}

function removeErrorContainer() {
    errorContainer.hidden = true;
    quoteContainer.hidden = false;
}

function removeRetryTextShowErrorText() {
    retryText.hidden = true;
    errorText.hidden = false;
}

function showLoadingSpinner() {
    loader.hidden = false;
    quoteContainer.hidden = true;
}

function removeLoadingSpinner() {
    if (!loader.hidden) {
        quoteContainer.hidden = false;
        loader.hidden = true;
    }
}

function tweetQuote() {
    const quote = quoteText.innerText;
    const author = authorText.innerText;
    const twitterUrl = `https://twitter.com/intent/tweet?text=${quote} - ${author}`;
    // open a new tab going to the twitterUrl
    window.open(twitterUrl, '_blank');
}

// sets a random number to choose which quote to display.
// and sets it to the constant quote
function getQuote() {
    quote = apiQuotes[Math.floor(Math.random() * apiQuotes.length)];
}

//  event listeners for buttons
newQuoteBtn.addEventListener('click', getAndSetQuotes);
twitterBtn.addEventListener('click', tweetQuote);


async function getAndSetQuotes() {
    showLoadingSpinner();

    const apiUrl = 'https://type.fit/api/quotes';

    try {
        // waits until the fetch request completes for the apiUrl
        const response = await fetch(apiUrl);

        // waits for the response in json format and
        // gets the json from our response and turning it into a json object
        apiQuotes = await response.json();
                
        getQuote();

        // if author is blank, put Unknown.
        if (quote.author === '' || quote.author === null) {
            authorText.innerText = 'Unknown';
        } else {
            authorText.innerText = quote.author;
        }

        // reduce font size for long quotes
        if (quote.text.length > 50) {
            quoteText.classList.add('long-quote');
        } else {
            quoteText.classList.remove('long-quote');
        }
        quoteText.innerText = quote.text;

        // stop loader and show quote
        removeLoadingSpinner();
        removeErrorContainer();
        count = 0;
    } catch (error) {
        count++;
        showErrorContainer();
        if (count >= 3) {
            removeRetryTextShowErrorText();
            console.error("Error: ", error);
            return;
        } else {
            getAndSetQuotes();
        }
        
    }
}

// on page load
getAndSetQuotes();