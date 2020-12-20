const quoteContainer = document.getElementById('quote-container');
const quoteText = document.getElementById('quote');
const authorText = document.getElementById('author');
const twitterBtn = document.getElementById('twitter');
const newQuoteBtn = document.getElementById('new-quote');
const loader = document.getElementById('loader');

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

async function getQuote() {
    showLoadingSpinner();

    // to avoid the cors error by using a proxy url.
    const proxyUrl ='https://cors-anywhere.herokuapp.com/';
    // https://forismatic.com/en/api/
    const apiUrl = 'http://api.forismatic.com/api/1.0/?method=getQuote&lang=en&format=json';

    try {
        // https://medium.com/@dtkatz/3-ways-to-fix-the-cors-error-and-how-access-control-allow-origin-works-d97d55946d9
        // we call the proxy url first which adds the cors header to our request, and then the api url
        // waits until the fetch request completes for the proxyUrl and apiUrl
        const response = await fetch(proxyUrl + apiUrl);
        
        // waits for the response in json format
        const data = await response.json();
        
        // if author is blank, put Unknown.
        // else, element with author
        if (data.quoteAuthor === '') {
            authorText.innerText = 'Unknown';
        } else {
            authorText.innerText = data.quoteAuthor;
        }

        // reduce font size for long quotes
        if (data.quoteText.length > 50) {
            quoteText.classList.add('long-quote');
        } else {
            quoteText.classList.remove('long-quote');
        }
        quoteText.innerText = data.quoteText;

        // stop loader and show quote
        removeLoadingSpinner();
    } catch (error) {
        // getQuote();
        
    }
}

// tweet quote
function tweetQuote() {
    const quote = quoteText.innerText;
    const author = authorText.innerText;
    const twitterUrl = `https://twitter.com/intent/tweet?text=${quote} - ${author}`;
    // open a new tab going to the twitterUrl
    window.open(twitterUrl, '_blank');
}

//  event listeners for buttons
newQuoteBtn.addEventListener('click', getQuote);
twitterBtn.addEventListener('click', tweetQuote);

// on page load
getQuote();