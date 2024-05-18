document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('search-input');
    const searchButton = document.getElementById('search-button');
    const mealList = document.getElementById('meal-list');
    const mealDetails = document.getElementById('meal-details');

    async function fetchMealsByName(name) {
        const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${name}`);
        const data = await response.json();
        return data.meals;
    }

    async function fetchMealById(id) {
        const response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`);
        const data = await response.json();
        return data.meals[0];
    }

    function displayMeals(meals) {
        mealList.innerHTML = '';
        if (meals) {
            meals.forEach(meal => {
                const mealItem = document.createElement('div');
                mealItem.classList.add('meal-item');
                mealItem.innerHTML = `
                    <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
                    <h3>${meal.strMeal}</h3>
                `;
                mealItem.addEventListener('click', () => showMealDetails(meal.idMeal));
                mealList.appendChild(mealItem);
            });
        } else {
            mealList.innerHTML = '<p>Item Not Found</p>';
        }
    }

    function showMealDetails(mealId) {
        fetchMealById(mealId).then(meal => {
            const ingredients = [];
            for (let i = 1; i <= 20; i++) {
                if (meal[`strIngredient${i}`]) {
                    ingredients.push(`${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]}`);
                } else {
                    break;
                }
            }
    
            mealDetails.innerHTML = `
                <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
                <h2>${meal.strMeal}</h2>
                <h3>Ingredients:</h3>
                <ul>${ingredients.map(ingredient => `<li>${ingredient}</li>`).join('')}</ul>
            `;
            mealDetails.style.display = 'block';
        });
    }
    
    

    searchButton.addEventListener('click', () => {
        const searchTerm = searchInput.value.trim();
        if (searchTerm) {
            fetchMealsByName(searchTerm).then(meals => displayMeals(meals));
        }
    });

    fetchMealsByName('').then(meals => displayMeals(meals));
});
