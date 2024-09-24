let streakCount = 0;
const streakCountElement = document.getElementById('streak-count');
const mealAddedDays = new Set(); // To track days with added meals
const totalCalorieCountElement = document.getElementById('calorie-count'); // Total calories for the week
let totalCaloriesForWeek = 0;

// Function to add a meal
const addMeal = () => {
    const daySelect = document.getElementById('day-select').value;
    const mealInput = document.getElementById('meal-input').value;
    const calorieInput = document.getElementById('calorie-input').value;

    // Check if all fields are filled
    if (!daySelect || !mealInput || !calorieInput) {
        alert('Please select a day, enter a meal, and provide calories.');
        return;
    }

    // Get the correct meal list and calorie count element based on the selected day
    const mealList = document.getElementById(`${daySelect.toLowerCase()}-meals`);
    const dayCalorieCount = document.getElementById(`${daySelect.toLowerCase()}-calories`);

    // Create new meal list item
    const mealItem = document.createElement('li');
    mealItem.textContent = `${mealInput} - ${calorieInput} calories`;
    mealList.appendChild(mealItem);

    // Update total calories for the selected day
    const currentDayCalories = parseInt(dayCalorieCount.textContent) || 0;
    const newDayCalories = currentDayCalories + parseInt(calorieInput);
    dayCalorieCount.textContent = newDayCalories;

    // Update total calories for the week
    totalCaloriesForWeek += parseInt(calorieInput);
    totalCalorieCountElement.textContent = totalCaloriesForWeek;

    // Clear the input fields
    document.getElementById('meal-input').value = '';
    document.getElementById('calorie-input').value = '';
    document.getElementById('day-select').value = '';

    // Update streak count if meal was added for the first time that day
    if (!mealAddedDays.has(daySelect)) {
        streakCount++;
        mealAddedDays.add(daySelect); // Mark this day as having a meal added
        streakCountElement.textContent = `${streakCount} 🌱`;
    }
};

// Add event listener to the "Add Meal" button
document.getElementById('add-meal-button').addEventListener('click', (event) => {
    event.preventDefault();
    addMeal();
});

// Function to reset streak
document.getElementById('reset-streak-button').addEventListener('click', function() {
    streakCount = 0;
    mealAddedDays.clear(); // Reset the meal added days
    streakCountElement.textContent = `${streakCount} 🌱`;

    // Reset total calories for the week and for each day
    totalCaloriesForWeek = 0;
    totalCalorieCountElement.textContent = totalCaloriesForWeek;

    // Clear the calorie count for each day and the meal lists
    const dayCalorieCounts = document.querySelectorAll('.day-calorie-count');
    const dayMealLists = document.querySelectorAll('.day-meal-list');

    dayCalorieCounts.forEach(day => day.textContent = '0');
    dayMealLists.forEach(list => list.innerHTML = '');
});

// Function to add comment in the Community section
document.getElementById('comment-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const commentInput = document.getElementById('comment-input').value;
    
    const commentList = document.getElementById('comment-list');
    const commentItem = document.createElement('li');
    commentItem.textContent = commentInput;
    commentList.appendChild(commentItem);
    
    // Clear comment input
    document.getElementById('comment-input').value = '';
});
