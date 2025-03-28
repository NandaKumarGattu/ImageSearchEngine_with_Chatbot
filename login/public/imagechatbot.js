// DOM Elements
const body = document.body;
const themeToggle = document.querySelector('.theme-toggle');
const themeIcon = themeToggle.querySelector('i');
const searchInput = document.getElementById('search-input');
const clearSearchBtn = document.querySelector('.clear-search');
const searchTags = document.querySelectorAll('.search-tag');
const imageBoxes = document.querySelectorAll('.image-box');
const noResults = document.querySelector('.no-results');

// Chatbot Elements
const chatToggle = document.querySelector('.chat-toggle');
const chatbotContainer = document.querySelector('.chatbot-container');
const chatbotClose = document.querySelector('.chatbot-close');
const chatbotMessages = document.querySelector('.chatbot-messages');
const chatbotInput = document.getElementById('chatbot-input-field');
const chatbotSend = document.getElementById('chatbot-send');

// Theme Toggle
themeToggle.addEventListener('click', () => {
    body.classList.toggle('dark-mode');
    if (body.classList.contains('dark-mode')) {
        themeIcon.classList.replace('fa-moon', 'fa-sun');
    } else {
        themeIcon.classList.replace('fa-sun', 'fa-moon');
    }
    
    // Save preference
    localStorage.setItem('dark-mode', body.classList.contains('dark-mode'));
});

// Check for saved theme preference
if (localStorage.getItem('dark-mode') === 'true') {
    body.classList.add('dark-mode');
    themeIcon.classList.replace('fa-moon', 'fa-sun');
}

// Enhanced Search Functionality
function performSearch() {
    const searchValue = searchInput.value.trim().toLowerCase();
    let hasVisibleImages = false;
    
    // Toggle clear button visibility
    if (searchValue) {
        clearSearchBtn.classList.add('visible');
    } else {
        clearSearchBtn.classList.remove('visible');
    }
    
    // Filter images based on search term
    imageBoxes.forEach(box => {
        const name = box.dataset.name.toLowerCase();
        const title = box.querySelector('h6').textContent.toLowerCase();
        const tags = box.dataset.tags ? box.dataset.tags.toLowerCase() : '';
        
        if (name.includes(searchValue) || 
            title.includes(searchValue) || 
            tags.includes(searchValue) || 
            searchValue === '') {
            
            box.style.display = 'block';
            box.classList.remove('fade-out');
            box.classList.add('fade-in');
            hasVisibleImages = true;
        } else {
            box.classList.remove('fade-in');
            box.classList.add('fade-out');
            setTimeout(() => {
                box.style.display = 'none';
            }, 500);
        }
    });
    
    // Show/hide no results message
    if (!hasVisibleImages && searchValue !== '') {
        noResults.style.display = 'block';
    } else {
        noResults.style.display = 'none';
    }
}

// Event Listeners
searchInput.addEventListener('input', performSearch);

clearSearchBtn.addEventListener('click', () => {
    searchInput.value = '';
    performSearch();
    searchInput.focus();
});

// Search Tags functionality
searchTags.forEach(tag => {
    tag.addEventListener('click', () => {
        const tagText = tag.textContent.toLowerCase();
        
        if (tagText === 'all') {
            searchInput.value = '';
        } else {
            searchInput.value = tagText;
        }
        
        performSearch();
    });
});

// Image click for future lightbox functionality
imageBoxes.forEach(box => {
    box.addEventListener('click', () => {
        // This can be expanded to show a lightbox with movie details
        const title = box.querySelector('h6').textContent;
        console.log(`Clicked on ${title}`);
        
        // For now, just add a subtle highlight effect
        box.style.boxShadow = '0 5px 30px rgba(114, 74, 232, 0.5)';
        setTimeout(() => {
            box.style.boxShadow = '';
        }, 300);
    });
});

// Initial animation on page load
document.addEventListener('DOMContentLoaded', () => {
    imageBoxes.forEach((box, index) => {
        setTimeout(() => {
            box.classList.add('fade-in');
        }, index * 100);
    });
});

// Chatbot Functionality
const movieData = {
    superhero: ["Spiderman", "Iron Man", "Avengers", "Black Panther", "Wonder Woman"],
    space: ["The Space", "Passenger", "The Universe", "Interstellar", "Gravity"],
    drama: ["Joker", "The Godfather", "Shawshank Redemption", "Schindler's List"],
    romance: ["Passenger", "Holiday", "Titanic", "The Notebook", "La La Land"],
    comedy: ["Holiday", "The Hangover", "Superbad", "Bridesmaids", "Step Brothers"],
    action: ["Spiderman", "Iron Man", "Mission Impossible", "Die Hard", "John Wick"]
};

// Chatbot toggle
chatToggle.addEventListener('click', () => {
    chatbotContainer.classList.add('active');
    
    // If first time opening, show welcome message
    if (chatbotMessages.children.length === 0) {
        addBotMessage("👋 Hi there! I'm MovieBot. I can help you find movies, suggest titles based on your preferences, or answer questions about our collection. How can I assist you today?", [
            "What movies do you have?",
            "Recommend a superhero movie",
            "Find space movies"
        ]);
    }
    
    // Focus on input
    setTimeout(() => chatbotInput.focus(), 300);
});

chatbotClose.addEventListener('click', () => {
    chatbotContainer.classList.remove('active');
});

// Send message functions
chatbotSend.addEventListener('click', sendMessage);
chatbotInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendMessage();
    }
});

function sendMessage() {
    const message = chatbotInput.value.trim();
    if (message === '') return;
    
    // Add user message
    addUserMessage(message);
    
    // Clear input
    chatbotInput.value = '';
    
    // Show typing indicator
    showTypingIndicator();
    
    // Process message and respond (with slight delay for realism)
    setTimeout(() => {
        processUserMessage(message);
        hideTypingIndicator();
    }, 1000 + Math.random() * 1000);
}

function addUserMessage(text) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', 'user-message');
    messageElement.textContent = text;
    chatbotMessages.appendChild(messageElement);
    
    // Scroll to bottom
    scrollToBottom();
}

function addBotMessage(text, suggestions = []) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', 'bot-message');
    messageElement.textContent = text;
    
    // Add suggestion chips if provided
    if (suggestions.length > 0) {
        const suggestionsContainer = document.createElement('div');
        suggestionsContainer.classList.add('suggestion-chips');
        
        suggestions.forEach(suggestion => {
            const chip = document.createElement('button');
            chip.classList.add('suggestion-chip');
            chip.textContent = suggestion;
            chip.addEventListener('click', () => {
                addUserMessage(suggestion);
                
                // Process the suggestion
                showTypingIndicator();
                setTimeout(() => {
                    processUserMessage(suggestion);
                    hideTypingIndicator();
                }, 800);
            });
            
            suggestionsContainer.appendChild(chip);
        });
        
        messageElement.appendChild(suggestionsContainer);
    }
    
    chatbotMessages.appendChild(messageElement);
    
    // Scroll to bottom
    scrollToBottom();
}

function showTypingIndicator() {
    const typingIndicator = document.createElement('div');
    typingIndicator.classList.add('bot-typing');
    typingIndicator.innerHTML = '<span></span><span></span><span></span>';
    typingIndicator.id = 'typing-indicator';
    chatbotMessages.appendChild(typingIndicator);
    scrollToBottom();
}

function hideTypingIndicator() {
    const typingIndicator = document.getElementById('typing-indicator');
    if (typingIndicator) {
        typingIndicator.remove();
    }
}

function scrollToBottom() {
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
}

// Process user message and generate response
function processUserMessage(message) {
    message = message.toLowerCase();
    
    // Check for greetings
    if (message.includes('hello') || message.includes('hi') || message.includes('hey')) {
        addBotMessage("Hello! How can I help you with movies today?", [
            "Show me popular movies",
            "What genres do you have?",
            "Movie recommendations"
        ]);
        return;
    }
    
    // Check for movie listings
    if (message.includes('what movies') || message.includes('show movies') || message.includes('movie list')) {
        addBotMessage("We have a variety of movies across different genres. Here are some categories:", [
            "Superhero movies",
            "Space movies",
            "Romance movies",
            "Comedy movies"
        ]);
        return;
    }
    
    // Check for genre requests
    const genres = ['superhero', 'space', 'romance', 'comedy', 'drama', 'action'];
    for (const genre of genres) {
        if (message.includes(genre)) {
            const movies = movieData[genre] || [];
            if (movies.length > 0) {
                addBotMessage(`Here are some ${genre} movies in our collection: ${movies.join(', ')}`, [
                    "Tell me more about " + movies[0],
                    "Show me another genre",
                    "Which is the best?"
                ]);
                return;
            }
        }
    }
    
    // Check for specific movie inquiries
    const allMovies = [].concat(...Object.values(movieData));
    const uniqueMovies = [...new Set(allMovies)];
    
    for (const movie of uniqueMovies) {
        if (message.toLowerCase().includes(movie.toLowerCase())) {
            // Find genres for this movie
            const movieGenres = [];
            for (const [genre, movies] of Object.entries(movieData)) {
                if (movies.includes(movie)) {
                    movieGenres.push(genre);
                }
            }
            
            addBotMessage(`${movie} is a ${movieGenres.join('/')} movie in our collection. Would you like to see similar movies?`, [
                "Yes, show similar movies",
                "Tell me more about it",
                "No, thanks"
            ]);
            return;
        }
    }
    
    // Recommendation request
    if (message.includes('recommend') || message.includes('suggestion') || message.includes('what should i watch')) {
        const randomGenre = genres[Math.floor(Math.random() * genres.length)];
        const moviesInGenre = movieData[randomGenre];
        const randomMovie = moviesInGenre[Math.floor(Math.random() * moviesInGenre.length)];
        
        addBotMessage(`Based on our popular picks, I'd recommend ${randomMovie}. It's a great ${randomGenre} movie! Would you like more recommendations?`, [
            "Yes, more recommendations",
            "Tell me about " + randomMovie,
            "No, thanks"
        ]);
        return;
    }
    
    // Search functionality
    if (message.includes('search') || message.includes('find')) {
        const searchTerms = message.replace('search', '').replace('find', '').trim();
        if (searchTerms) {
            // Update the main search
            searchInput.value = searchTerms;
            performSearch();
            
            addBotMessage(`I've updated the search results for "${searchTerms}". Take a look at the gallery!`, [
                "Thanks!",
                "Clear search",
                "Search for something else"
            ]);
            return;
        }
    }
    
    // Clear search
    if (message.includes('clear search')) {
        searchInput.value = '';
        performSearch();
        
        addBotMessage("I've cleared the search results. You can now see all movies in our gallery.", [
            "Thanks!",
            "Show me superhero movies",
            "Recommend something"
        ]);
        return;
    }
    
    // Help request
    if (message.includes('help') || message.includes('how do i')) {
        addBotMessage("I can help you navigate our movie gallery. You can ask me to show movies by genre, search for specific titles, get recommendations, or clear your search. What would you like to do?", [
            "Show movies by genre",
            "Search for a movie",
            "Get recommendations"
        ]);
        return;
    }
    
    // Thank you responses
    if (message.includes('thank') || message.includes('thanks')) {
        addBotMessage("You're welcome! Is there anything else I can help you with?", [
            "Find more movies",
            "No, that's all"
        ]);
        return;
    }
    
    // Goodbye responses
    if (message.includes('bye') || message.includes('goodbye')) {
        addBotMessage("Goodbye! Enjoy your movie watching. Feel free to chat again if you need assistance.", []);
        return;
    }
    
    // Default response for unrecognized queries
    addBotMessage("I'm not sure I understand. Would you like to browse our movie collection, get a recommendation, or search for something specific?", [
        "Browse movies",
        "Get a recommendation",
        "Search for a movie"
    ]);
}

//api
// API Integration for the Chatbot
// const API_KEY = "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"; // You would replace this with an actual API key
// const BASE_URL = "https://api.example.com/v1"; // Replace with actual API endpoint

// // Add this function to make API calls
// async function fetchFromAPI(endpoint, params = {}) {
//     try {
//         const queryParams = new URLSearchParams({
//             api_key: API_KEY,
//             ...params
//         });
        
//         const response = await fetch(`${BASE_URL}/${endpoint}?${queryParams}`);
        
//         if (!response.ok) {
//             throw new Error(`API error: ${response.status}`);
//         }
        
//         return await response.json();
//     } catch (error) {
//         console.error("API Error:", error);
//         return null;
//     }
// }

// // Enhanced function to get real-time movie data
// async function getMovieDetails(movieTitle) {
//     const data = await fetchFromAPI("search/movie", { query: movieTitle });
    
//     if (data && data.results && data.results.length > 0) {
//         return data.results[0];
//     }
    
//     return null;
// }

// // Enhanced function to get trending movies
// async function getTrendingMovies() {
//     const data = await fetchFromAPI("trending/movie/week");
    
//     if (data && data.results) {
//         return data.results.slice(0, 5); // Return top 5 trending movies
//     }
    
//     return [];
// }

// // Updates to the processUserMessage function to use API data
// function processUserMessage(message) {
//     message = message.toLowerCase();
    
//     // ... [existing code] ...
    
//     // Enhanced specific movie inquiries with API data
//     if (message.includes("details about") || message.includes("more about")) {
//         // Extract movie title from the message
//         const titlePattern = /(?:details about|more about)\s+(.+)/i;
//         const match = message.match(titlePattern);
        
//         if (match && match[1]) {
//             const movieTitle = match[1].trim();
            
//             // Show typing indicator for longer API call
//             showTypingIndicator();
            
//             // Get detailed information from the API
//             getMovieDetails(movieTitle).then(movieData => {
//                 hideTypingIndicator();
                
//                 if (movieData) {
//                     const releaseYear = movieData.release_date ? 
//                         new Date(movieData.release_date).getFullYear() : "Unknown";
                    
//                     const rating = movieData.vote_average ? 
//                         `${movieData.vote_average}/10` : "Not rated";
                    
//                     addBotMessage(
//                         `Here's what I found about "${movieData.title}" (${releaseYear}):\n\n` +
//                         `Rating: ${rating}\n` +
//                         `Overview: ${movieData.overview}\n\n` +
//                         `Would you like to see similar movies?`,
//                         ["Show similar movies", "Search for another movie"]
//                     );
//                 } else {
//                     addBotMessage(
//                         `I couldn't find detailed information about "${movieTitle}". Would you like to search for a different movie?`,
//                         ["Search for another movie", "Show popular movies"]
//                     );
//                 }
//             });
            
//             return;
//         }
//     }
    
//     // New feature: Get trending movies from API
//     if (message.includes("trending") || message.includes("popular now")) {
//         showTypingIndicator();
        
//         getTrendingMovies().then(movies => {
//             hideTypingIndicator();
            
//             if (movies.length > 0) {
//                 const movieList = movies.map(movie => movie.title).join(", ");
                
//                 addBotMessage(
//                     `Here are the trending movies this week: ${movieList}. Would you like details about any of these?`,
//                     [
//                         `Details about ${movies[0].title}`,
//                         "Search for something else"
//                     ]
//                 );
//             } else {
//                 addBotMessage(
//                     "I couldn't retrieve the trending movies right now. Would you like to explore our existing collection instead?",
//                     ["Show me superhero movies", "Show me space movies"]
//                 );
//             }
//         });
        
//         return;
//     }
    
//     // Adding "Smart Search" feature using API
//     if (message.includes("find movies with") || message.includes("search movies with")) {
//         // Extract search parameters
//         const paramPattern = /(?:find|search) movies with (.+)/i;
//         const match = message.match(paramPattern);
        
//         if (match && match[1]) {
//             const searchParam = match[1].trim();
            
//             showTypingIndicator();
            
//             // Use more advanced search capabilities of the API
//             fetchFromAPI("discover/movie", { 
//                 with_keywords: searchParam,
//                 sort_by: "popularity.desc"
//             }).then(data => {
//                 hideTypingIndicator();
                
//                 if (data && data.results && data.results.length > 0) {
//                     const movieList = data.results
//                         .slice(0, 5)
//                         .map(movie => movie.title)
//                         .join(", ");
                    
//                     addBotMessage(
//                         `I found these movies matching "${searchParam}": ${movieList}. Would you like details about any of these?`,
//                         [
//                             `Details about ${data.results[0].title}`,
//                             "Try another search"
//                         ]
//                     );
//                 } else {
//                     addBotMessage(
//                         `I couldn't find movies matching "${searchParam}". Would you like to try a different search?`,
//                         ["Try another search", "Show popular movies instead"]
//                     );
//                 }
//             });
            
//             return;
//         }
//     }
    
//     // Add recommendation system based on user preferences
//     if (message.includes("recommend") || message.includes("suggestion")) {
//         // Check if the message includes genre preferences
//         const genres = ["action", "comedy", "romance", "thriller", "horror", "sci-fi"];
//         const mentionedGenres = genres.filter(genre => message.includes(genre));
        
//         if (mentionedGenres.length > 0) {
//             showTypingIndicator();
            
//             // Convert genre names to genre IDs (simplified example)
//             const genreMapping = {
//                 "action": 28,
//                 "comedy": 35,
//                 "romance": 10749,
//                 "thriller": 53,
//                 "horror": 27,
//                 "sci-fi": 878
//             };
            
//             const genreIds = mentionedGenres.map(genre => genreMapping[genre]).join(",");
            
//             fetchFromAPI("discover/movie", {
//                 with_genres: genreIds,
//                 sort_by: "vote_average.desc",
//                 "vote_count.gte": 100
//             }).then(data => {
//                 hideTypingIndicator();
                
//                 if (data && data.results && data.results.length > 0) {
//                     const recommendations = data.results.slice(0, 3);
//                     const movieList = recommendations.map(movie => {
//                         const year = movie.release_date ? 
//                             ` (${new Date(movie.release_date).getFullYear()})` : "";
//                         return `${movie.title}${year}`;
//                     }).join(", ");
                    
//                     addBotMessage(
//                         `Based on your preference for ${mentionedGenres.join(" and ")}, I recommend: ${movieList}. Would you like details about any of these?`,
//                         [
//                             `Tell me about ${recommendations[0].title}`,
//                             "More recommendations",
//                             "No thanks"
//                         ]
//                     );
//                 } else {
//                     addBotMessage(
//                         `I couldn't find personalized recommendations right now. Would you like to see our popular movies instead?`,
//                         ["Show popular movies", "Try different genres"]
//                     );
//                 }
//             });
            
//             return;
//         }
//     }
    
//     // ... [rest of the existing code] ...
// }

// // Add function to handle API-powered search
// function updateSearchWithAPI(query) {
//     showTypingIndicator();
    
//     fetchFromAPI("search/movie", { query: query }).then(data => {
//         hideTypingIndicator();
        
//         if (data && data.results && data.results.length > 0) {
//             // Use the first few results to update the UI
//             // This would require a function to dynamically update the movie gallery
//             updateMovieGalleryWithAPIResults(data.results.slice(0, 10));
            
//             addBotMessage(
//                 `I found ${data.results.length} movies matching "${query}". I've updated the gallery with the top results.`,
//                 ["Clear search", "Tell me about the first result"]
//             );
//         } else {
//             addBotMessage(
//                 `I couldn't find any movies matching "${query}". Would you like to try a different search?`,
//                 ["Try another search", "Show all movies"]
//             );
//         }
//     });
// }

// // Helper function to update the movie gallery with API results
// function updateMovieGalleryWithAPIResults(movies) {
//     const imagesContainer = document.querySelector('.images');
    
//     // Clear existing content
//     imagesContainer.innerHTML = '';
    
//     // Generate new image boxes from API data
//     movies.forEach(movie => {
//         const imageBox = document.createElement('div');
//         imageBox.classList.add('image-box', 'fade-in');
//         imageBox.dataset.name = movie.title.toLowerCase();
        
//         // Extract genres from movie data
//         const genres = movie.genre_ids 
//             ? getGenreNamesFromIds(movie.genre_ids).join(' ')
//             : 'drama';
        
//         imageBox.dataset.tags = genres;
        
//         // Create poster image (using poster path from API)
//         const posterUrl = movie.poster_path 
//             ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
//             : 'images/placeholder.jpg';
        
//         imageBox.innerHTML = `
//             <img src="${posterUrl}" alt="${movie.title}">
//             <div class="image-overlay">
//                 <h6>${movie.title}</h6>
//                 <div class="tags">
//                     ${getGenreNamesFromIds(movie.genre_ids).map(genre => 
//                         `<span class="tag">${genre}</span>`
//                     ).join('')}
//                 </div>
//             </div>
//         `;
        
//         // Add click event
//         imageBox.addEventListener('click', () => {
//             const title = movie.title;
//             console.log(`Clicked on ${title}`);
            
//             // For now, just add a subtle highlight effect
//             imageBox.style.boxShadow = '0 5px 30px rgba(114, 74, 232, 0.5)';
//             setTimeout(() => {
//                 imageBox.style.boxShadow = '';
//             }, 300);
//         });
        
//         imagesContainer.appendChild(imageBox);
//     });
    
//     // Show no results message if needed
//     if (movies.length === 0) {
//         noResults.style.display = 'block';
//     } else {
//         noResults.style.display = 'none';
//     }
// }

// // Helper function to convert genre IDs to names
// function getGenreNamesFromIds(genreIds) {
//     // Simplified genre mapping (in a real app, you'd fetch this from the API)
//     const genreMap = {
//         28: 'Action',
//         12: 'Adventure',
//         16: 'Animation',
//         35: 'Comedy',
//         80: 'Crime',
//         99: 'Documentary',
//         18: 'Drama',
//         10751: 'Family',
//         14: 'Fantasy',
//         36: 'History',
//         27: 'Horror',
//         10402: 'Music',
//         9648: 'Mystery',
//         10749: 'Romance',
//         878: 'Sci-Fi',
//         10770: 'TV Movie',
//         53: 'Thriller',
//         10752: 'War',
//         37: 'Western'
//     };
    
//     return genreIds ? genreIds.map(id => genreMap[id] || 'Other') : ['Drama'];
// }