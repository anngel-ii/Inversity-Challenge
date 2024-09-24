document.addEventListener("DOMContentLoaded", () => {
    const suggestionForm = document.getElementById("suggestion-form");
    const resultsDiv = document.getElementById("suggestion-results");
    const apiKey = "306c88394fe24feb9b9dfc515cb2f1fa"; // Your Spoonacular API key

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
        const apiURL = `https://api.spoonacular.com/recipes/complexSearch?apiKey=${apiKey}&maxPrice=${budget}&number=5`;

        fetch(apiURL)
            .then(response => response.json())
            .then(data => displaySuggestions(data.results))
            .catch(error => {
                console.error("Error fetching meal suggestions:", error);
                resultsDiv.innerHTML = "There was an error fetching suggestions.";
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

            const mealLink = document.createElement("a");
            mealLink.href = `https://spoonacular.com/recipes/${suggestion.id}`;
            mealLink.target = "_blank";
            mealLink.textContent = "View Recipe";

            mealDiv.appendChild(mealTitle);
            mealDiv.appendChild(mealImage);
            mealDiv.appendChild(mealLink);

            resultsDiv.appendChild(mealDiv);
        });
    }
});
