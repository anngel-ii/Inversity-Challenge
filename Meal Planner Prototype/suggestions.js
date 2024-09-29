document.addEventListener("DOMContentLoaded", () => {
    const suggestionForm = document.getElementById("suggestion-form");
    const resultsDiv = document.getElementById("suggestion-results");
    const apiKey = "31436c72a6124b4190c1b0ae054e4682"; // Your updated Spoonacular API key

    suggestionForm.addEventListener("submit", function(event) {
        event.preventDefault();

        const budget = document.getElementById("budget-input").value; // Get user's budget input

        if (budget) {
            fetchSuggestions(budget);
        } else {
            resultsDiv.innerHTML = "Please enter a budget.";
        }
    });

    function fetchSuggestions(budget) {
        const apiURL = `https://api.spoonacular.com/recipes/complexSearch?apiKey=${apiKey}&maxCalories=${budget}&number=5`;

        fetch(apiURL)
            .then(response => {
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                return response.json();
            })
            .then(data => {
                if (data && data.results) {
                    displaySuggestions(data.results);
                } else {
                    resultsDiv.innerHTML = "No meal suggestions found.";
                }
            })
            .catch(error => {
                console.error("Error fetching meal suggestions:", error);
                resultsDiv.innerHTML = "There was an error fetching suggestions. Please try again later.";
            });
    }

    function displaySuggestions(suggestions) {
        resultsDiv.innerHTML = ""; // Clear previous suggestions

        if (suggestions.length === 0) {
            resultsDiv.innerHTML = "No suggestions found for the selected budget.";
            return;
        }

        suggestions.forEach(suggestion => {
            const mealDiv = document.createElement("div");
            mealDiv.classList.add("suggestion-item");

            const mealTitle = document.createElement("h3");
            mealTitle.textContent = suggestion.title;

            const mealImage = document.createElement("img");
            mealImage.src = suggestion.image;
            mealImage.alt = suggestion.title;
            mealImage.style.cursor = "pointer"; // Show that the image is clickable

            // Clicking the image will lead to the recipe page
            mealImage.addEventListener("click", () => {
                window.open(`https://spoonacular.com/recipes/${suggestion.title.replace(/ /g, "-")}-${suggestion.id}`, '_blank');
            });

            mealDiv.appendChild(mealTitle);
            mealDiv.appendChild(mealImage);

            resultsDiv.appendChild(mealDiv);
        });
    }
});
