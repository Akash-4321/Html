document.addEventListener("DOMContentLoaded", () => {
    const API_KEY = 'OigFHEy2dJVRsCJKYs9a65miecXwTLZIGln3lijw'; 
    const API_URL = 'https://api.nasa.gov/planetary/apod';

    const form = document.getElementById('search-form');
    const searchInput = document.getElementById('search-input');
    const imageContainer = document.getElementById('image-content');
    const searchHistoryList = document.getElementById('search-history');

    form.addEventListener('submit', event => {
        event.preventDefault();
        const selectedDate = searchInput.value;
        getImageOfTheDay(selectedDate);
    });

    function getCurrentImageOfTheDay() {
        const currentDate = new Date().toISOString().split('T')[0];
        fetchImage(currentDate);
    }

    function getImageOfTheDay(date) {
        fetchImage(date);
        saveSearch(date);
        addSearchToHistory();
    }

    function fetchImage(date) {
        fetch(`${API_URL}?api_key=${API_KEY}&date=${date}`)
            .then(response => response.json())
            .then(data => {
                if (data.media_type === "image") {
                    imageContainer.innerHTML = `
                        <h3>${data.title}</h3>
                        <img src="${data.url}" alt="${data.title}">
                        <p>${data.explanation}</p>
                    `;
                } else {
                    imageContainer.innerHTML = `<p>Media type is not supported: ${data.media_type}</p>`;
                }
            })
            .catch(error => {
                imageContainer.innerHTML = `<p>Failed to fetch image: ${error.message}</p>`;
            });
    }

    function saveSearch(date) {
        let searches = JSON.parse(localStorage.getItem('searches')) || [];
        if (!searches.includes(date)) {
            searches.push(date);
            localStorage.setItem('searches', JSON.stringify(searches));
        }
    }

    function addSearchToHistory() {
        const searches = JSON.parse(localStorage.getItem('searches')) || [];
        searchHistoryList.innerHTML = '';
        searches.forEach(date => {
            const listItem = document.createElement('li');
            listItem.textContent = date;
            listItem.addEventListener('click', () => {
                fetchImage(date);
            });
            searchHistoryList.appendChild(listItem);
        });
    }

    
    getCurrentImageOfTheDay();
    addSearchToHistory();
});
