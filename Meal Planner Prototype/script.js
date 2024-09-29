document.addEventListener("DOMContentLoaded", () => {
    let streakCount = 0;
    const streakCountElement = document.getElementById('streak-count');
    const mealAddedDays = new Set(); // To track days with added meals
    const totalCalorieCountElement = document.getElementById('calorie-count'); // Total calories for the week
    let totalCaloriesForWeek = 0;

    // Motivational Quotes Array
    const motivationalQuotes = [
        "Believe in yourself and all that you are.",
        "Your only limit is you.",
        "Dream it. Wish it. Do it.",
        "Success doesn’t just find you. You have to go out and get it.",
        "The harder you work for something, the greater you’ll feel when you achieve it.",
        "Dream bigger. Do bigger.",
        "Eat well, live well!",
        "Good food equals good mood.",
        "Healthy eating is a way of life.",
        "You are what you eat, so don't be fast, cheap, easy, or fake.",
        "Let food be thy medicine, and medicine be thy food."
    ];

    // Function to display a random motivational quote with transition
    const displayNewQuote = () => {
        const quoteContainer = document.getElementById('motivational-quote-container');
        const quoteDisplay = document.getElementById('motivational-quote');
        const randomIndex = Math.floor(Math.random() * motivationalQuotes.length);
        const newQuote = `"${motivationalQuotes[randomIndex]}"`;

        // Fade out
        quoteContainer.classList.add('fade-out');

        // After fade-out transition, update the quote and fade in
        setTimeout(() => {
            quoteDisplay.textContent = newQuote;
            quoteContainer.classList.remove('fade-out');
        }, 2500); // Match the transition duration in CSS
    };

    // Automatically change the quote every 5 seconds
    setInterval(displayNewQuote, 5000);

    // Function to add a meal
    const addMeal = (event) => {
        event.preventDefault();

        const daySelect = document.getElementById('day-select').value;
        const mealInput = document.getElementById('meal-input').value.trim();
        const calorieInput = document.getElementById('calorie-input').value.trim();

        // Validate inputs
        if (!daySelect || !mealInput || !calorieInput) {
            alert('Please select a day, enter a meal, and provide calories.');
            return;
        }

        if (parseInt(calorieInput) <= 0) {
            alert('Please enter a positive number for calories.');
            return;
        }

        const mealList = document.getElementById(`${daySelect.toLowerCase()}-meals`);
        const dayCalorieCount = document.getElementById(`${daySelect.toLowerCase()}-calories`);

        // Create new meal list item
        const mealItem = document.createElement('li');

        // Create text span
        const mealText = document.createElement('span');
        mealText.textContent = `${mealInput} - ${calorieInput} calories`;

        // Create edit button
        const editButton = document.createElement('button');
        editButton.textContent = 'Edit';
        editButton.className = 'edit-button';
        editButton.onclick = () => editMeal(mealItem, calorieInput);

        // Create delete button
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.className = 'delete-button';
        deleteButton.onclick = () => deleteMeal(mealItem, calorieInput);

        // Append elements to meal item
        mealItem.appendChild(mealText);
        mealItem.appendChild(editButton);
        mealItem.appendChild(deleteButton);

        // Append meal item to meal list
        mealList.appendChild(mealItem);

        // Update calorie counts
        const currentDayCalories = parseInt(dayCalorieCount.textContent) || 0;
        const newDayCalories = currentDayCalories + parseInt(calorieInput);
        dayCalorieCount.textContent = newDayCalories;

        totalCaloriesForWeek += parseInt(calorieInput);
        totalCalorieCountElement.textContent = totalCaloriesForWeek;

        // Clear input fields
        document.getElementById('meal-input').value = '';
        document.getElementById('calorie-input').value = '';
        document.getElementById('day-select').value = '';

        // Update streak count if meal was added for the first time that day
        if (!mealAddedDays.has(daySelect)) {
            streakCount++;
            mealAddedDays.add(daySelect);
            streakCountElement.textContent = `${streakCount} 🌱`;
        }

        // Save data to localStorage
        saveData();
    };

    // Function to delete a meal
    const deleteMeal = (mealItem, calorie) => {
        const mealList = mealItem.parentNode;
        mealList.removeChild(mealItem);

        // Update calorie counts
        const dayId = mealList.id.split('-')[0]; // e.g., 'monday' from 'monday-meals'
        const dayCalorieCount = document.getElementById(`${dayId}-calories`);
        const currentDayCalories = parseInt(dayCalorieCount.textContent) || 0;
        const newDayCalories = currentDayCalories - parseInt(calorie);
        dayCalorieCount.textContent = newDayCalories;

        totalCaloriesForWeek -= parseInt(calorie);
        totalCalorieCountElement.textContent = totalCaloriesForWeek;

        // Save data to localStorage
        saveData();
    };

    // Function to edit a meal
    const editMeal = (mealItem, oldCalorie) => {
        const mealText = mealItem.querySelector('span');
        const editButton = mealItem.querySelector('.edit-button');
        const deleteButton = mealItem.querySelector('.delete-button');

        // Replace text with input fields
        const [mealName, calorieText] = mealText.textContent.split(' - ');
        const mealNameInput = document.createElement('input');
        mealNameInput.type = 'text';
        mealNameInput.value = mealName;
        mealNameInput.className = 'edit-meal-input';

        const calorieInput = document.createElement('input');
        calorieInput.type = 'number';
        calorieInput.value = oldCalorie;
        calorieInput.className = 'edit-calorie-input';

        mealItem.insertBefore(mealNameInput, mealText);
        mealItem.insertBefore(calorieInput, mealText);
        mealItem.removeChild(mealText);

        // Change edit button to save button
        editButton.textContent = 'Save';
        editButton.onclick = () => saveEdit(mealItem, mealNameInput, calorieInput, oldCalorie);
    };

    // Function to save edited meal
    const saveEdit = (mealItem, mealNameInput, calorieInput, oldCalorie) => {
        const newMealName = mealNameInput.value.trim();
        const newCalorie = calorieInput.value.trim();

        if (!newMealName || !newCalorie || parseInt(newCalorie) <= 0) {
            alert('Please enter valid meal name and positive calories.');
            return;
        }

        const mealList = mealItem.parentNode;
        const dayId = mealList.id.split('-')[0];
        const dayCalorieCount = document.getElementById(`${dayId}-calories`);

        // Update calorie counts
        const currentDayCalories = parseInt(dayCalorieCount.textContent) || 0;
        const updatedDayCalories = currentDayCalories - parseInt(oldCalorie) + parseInt(newCalorie);
        dayCalorieCount.textContent = updatedDayCalories;

        totalCaloriesForWeek = totalCaloriesForWeek - parseInt(oldCalorie) + parseInt(newCalorie);
        totalCalorieCountElement.textContent = totalCaloriesForWeek;

        // Replace input fields with updated text
        const mealText = document.createElement('span');
        mealText.textContent = `${newMealName} - ${newCalorie} calories`;
        mealItem.insertBefore(mealText, mealNameInput);
        mealItem.removeChild(mealNameInput);
        mealItem.removeChild(calorieInput);

        // Restore buttons functionality
        const editButton = mealItem.querySelector('.edit-button');
        const deleteButton = mealItem.querySelector('.delete-button');
        editButton.textContent = 'Edit';
        editButton.onclick = () => editMeal(mealItem, newCalorie);

        // Save data to localStorage
        saveData();
    };

    // Function to toggle edit mode for a day
    const toggleEdit = (day) => {
        const editSaveButton = document.getElementById(`${day}-save-button`);
        const toggleButton = document.querySelector(`#${day} .toggle-edit-button`);
        const mealList = document.getElementById(`${day}-meals`);

        if (editSaveButton.style.display === "none") {
            // Switch to edit mode
            editSaveButton.style.display = "inline-block";
            toggleButton.style.display = "none";
            mealList.querySelectorAll('li').forEach(li => {
                li.querySelector('.delete-button').style.display = 'inline-block';
                li.querySelector('.edit-button').style.display = 'inline-block';
            });
        } else {
            // Exit edit mode
            editSaveButton.style.display = "none";
            toggleButton.style.display = "inline-block";
            mealList.querySelectorAll('li').forEach(li => {
                li.querySelector('.delete-button').style.display = 'none';
                li.querySelector('.edit-button').style.display = 'none';
            });
        }
    };

    // Function to save meals for a day (optional, currently handled individually)
    const saveMeals = (day) => {
        // Placeholder for additional save logic if needed
        alert(`Meals for ${capitalizeFirstLetter(day)} saved!`);
        // You can implement batch saving or other features here
    };

    // Function to reset streak and clear all data
    const resetStreak = () => {
        streakCount = 0;
        mealAddedDays.clear();
        streakCountElement.textContent = `${streakCount} 🌱`;

        totalCaloriesForWeek = 0;
        totalCalorieCountElement.textContent = totalCaloriesForWeek;

        // Clear all meal lists and calorie counts
        const mealLists = document.querySelectorAll('.day-meal-list');
        mealLists.forEach(list => list.innerHTML = '');

        const calorieCounts = document.querySelectorAll('.day-calorie-count');
        calorieCounts.forEach(count => count.textContent = '0');

        // Clear comments
        const commentList = document.getElementById('comment-list');
        commentList.innerHTML = '';

        // Save data to localStorage
        saveData();
    };

    // Function to add a comment
    const addComment = (event) => {
        event.preventDefault();
        const commentInput = document.getElementById('comment-input').value.trim();

        if (commentInput.length === 0) {
            alert('Please enter a comment.');
            return;
        }

        const commentList = document.getElementById('comment-list');
        const commentItem = document.createElement('li');
        commentItem.textContent = commentInput;
        commentList.appendChild(commentItem);

        // Clear comment input
        document.getElementById('comment-input').value = '';

        // Save comments to localStorage
        saveData();
    };

    // Function to capitalize the first letter of a string
    const capitalizeFirstLetter = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    };

    // Function to save data to localStorage
    const saveData = () => {
        const data = {
            streakCount,
            mealAddedDays: Array.from(mealAddedDays),
            totalCaloriesForWeek,
            meals: {},
            comments: []
        };

        // Save meals for each day
        ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].forEach(day => {
            const mealList = document.getElementById(`${day}-meals`);
            const meals = [];
            mealList.querySelectorAll('li').forEach(li => {
                const mealText = li.querySelector('span').textContent;
                const [mealName, calorieText] = mealText.split(' - ');
                const calories = parseInt(calorieText.split(' ')[0]);
                meals.push({ mealName, calories });
            });
            data.meals[day] = meals;
        });

        // Save comments
        const comments = [];
        document.querySelectorAll('#comment-list li').forEach(li => {
            comments.push(li.textContent);
        });
        data.comments = comments;

        localStorage.setItem('mealPlannerData', JSON.stringify(data));
    };

    // Function to load data from localStorage
    const loadData = () => {
        const data = JSON.parse(localStorage.getItem('mealPlannerData'));
        if (!data) return;

        streakCount = data.streakCount || 0;
        streakCountElement.textContent = `${streakCount} 🌱`;

        totalCaloriesForWeek = data.totalCaloriesForWeek || 0;
        totalCalorieCountElement.textContent = totalCaloriesForWeek;

        mealAddedDays.clear();
        (data.mealAddedDays || []).forEach(day => mealAddedDays.add(day));

        // Load meals for each day
        Object.keys(data.meals || {}).forEach(day => {
            const mealList = document.getElementById(`${day}-meals`);
            const dayCalorieCount = document.getElementById(`${day}-calories`);
            (data.meals[day] || []).forEach(meal => {
                const mealItem = document.createElement('li');

                // Create text span
                const mealText = document.createElement('span');
                mealText.textContent = `${meal.mealName} - ${meal.calories} calories`;

                // Create edit button
                const editButton = document.createElement('button');
                editButton.textContent = 'Edit';
                editButton.className = 'edit-button';
                editButton.onclick = () => editMeal(mealItem, meal.calories);

                // Create delete button
                const deleteButton = document.createElement('button');
                deleteButton.textContent = 'Delete';
                deleteButton.className = 'delete-button';
                deleteButton.onclick = () => deleteMeal(mealItem, meal.calories);

                // Append elements to meal item
                mealItem.appendChild(mealText);
                mealItem.appendChild(editButton);
                mealItem.appendChild(deleteButton);

                // Append meal item to meal list
                mealList.appendChild(mealItem);
            });
        });

        // Load comments
        (data.comments || []).forEach(comment => {
            const commentList = document.getElementById('comment-list');
            const commentItem = document.createElement('li');
            commentItem.textContent = comment;
            commentList.appendChild(commentItem);
        });
    };

    // Event listeners
    document.getElementById('meal-form').addEventListener('submit', addMeal);
    document.getElementById('reset-streak-button').addEventListener('click', resetStreak);
    document.getElementById('comment-form').addEventListener('submit', addComment);
    document.getElementById('new-quote-button').addEventListener('click', displayNewQuote);

    // Load data on page load
    loadData();

    // Display a random quote on page load
    displayNewQuote();
});
