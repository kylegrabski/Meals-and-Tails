let aboutUs = document.querySelector("#about-us");
let recipes = document.querySelector("#recipes");
let saveRecipe = document.querySelector("#saved-recipes");
let $recipeContainer = document.querySelector("#recipe-append");
let saveBtn = document.querySelector(".save-button");
let $savedDrinkContainer = document.querySelector("#saved-drink-container");
let $savedFoodContainer = document.querySelector("#saved-food-container");
let $clearList = document.querySelector(".clearlist");
let $btn = document.querySelector(".search-button");

let userFoodPreference = [];
let recipeArray = [];
let cocktailArray = [];
let allFoodsArr = [];
let liquorLink;
let foodNetworkUrl;

//Welcome modal
var closeModal = document.querySelector("#modal-close-btn1");
var modalContainer = document.querySelector(".modal");
var btnX = document.querySelector("#modal-close-btn1");

closeModal.addEventListener("click", function () {
  modalContainer.classList.remove("is-active");
  btnX.remove();
});

// show saved recipes on nav dropdown
function renderSavedItems() {
  var cocktailName = document.querySelector(".drink-name");
  $savedDrinkContainer.innerHTML = "";
  $savedFoodContainer.innerHTML = "";
  // cocktailName.textContent = drink.strDrink;
  if (savedRecipeArr) {
    for (const foodUrl of savedRecipeArr) {
      var aTag = document.createElement("a");
      aTag.setAttribute("href", foodUrl);
      aTag.textContent = foodUrl;
      $savedFoodContainer.append(aTag);
    }
  }
  for (const drinkUrl of savedLiquorArr) {
    var aTag = document.createElement("a");
    aTag.setAttribute("href", drinkUrl);
    // aTag.textContent = cocktailName.textContent;
    aTag.textContent = drinkUrl;
    $savedDrinkContainer.append(aTag);
  }
}

// empty saved recipes when "clear" in navbar is clicked
$clearList.addEventListener("click", function () {
  localStorage.clear();
  $savedDrinkContainer.innerHTML = "";
  $savedFoodContainer.innerHTML = "";

  savedLiquorArr = getSavedLiquor();
  savedRecipeArr = getSavedRecipes();
});

//Code for Nav bar on scroll color change
var myNav = document.getElementById("mainNav");
window.onscroll = function () {
  "use strict";
  if (
    document.body.scrollTop >= 280 ||
    document.documentElement.scrollTop >= 280
  ) {
    myNav.classList.add("scroll");
  } else {
    myNav.classList.remove("scroll");
  }
}

// ----------------FOOD PREFERENCE LOGIC------------------

// collecting FOOD checkbox values
function getFoodPreference(name, name2, name3) {
  var $grainsCheckBoxes = document.querySelectorAll(
    `input[name = "${name}"]:checked`
  );

  $grainsCheckBoxes.forEach((checkbox) => {
    userFoodPreference.push(checkbox.value);
  });
  var $vegetableCheckBoxes = document.querySelectorAll(
    `input[name = "${name2}"]:checked`
  );

  $vegetableCheckBoxes.forEach((checkbox) => {
    userFoodPreference.push(checkbox.value);
  });
  var $proteinsCheckBoxes = document.querySelectorAll(
    `input[name = "${name3}"]:checked`
  );

  $proteinsCheckBoxes.forEach((checkbox) => {
    userFoodPreference.push(checkbox.value);
  });

  return userFoodPreference;
}

$btn.addEventListener("click", (event) => {
  userFoodPreference = [];
  getFoodPreference("grainsCheck", "vegetablesCheck", "proteinsCheck");

  if (userFoodPreference.length > 4) {
    //INSERT ALERT HERE
    return;
  }
  if (userFoodPreference.length == 0) {
    // INSERT ALERT HERE
    return;
  }

  // fetch data from foodDB API
  fetchFoodData();

  fetchCocktailData(cocktailMenu.value);
  userLiquorPreference.push(cocktailMenu.value);

  // change userFoodPreference into string
  var userString = userFoodPreference.toString();
  // replace commas with hyphen
  userString = userString.replaceAll(",", "-");

  foodNetworkUrl = `https://www.foodnetwork.com/search/${userString}-`;

  var liquorString = cocktailMenu.value;

  liquorLink = `https://www.liquor.com/search?q=${liquorString}`;
});

// -----------------FOOD RECIPE API----------------------

function fetchFoodData() {
  // clears array after search
  recipeArray = [];

  // gets recipes for each ingredient chosen
  for (let i = 0; i < userFoodPreference.length; i++) {
    var apiKey = 9973533;
    var foodUrl = `https://www.themealdb.com/api/json/v2/${apiKey}/filter.php?i=${userFoodPreference[i]}`;

    fetch(foodUrl)
      .then((data) => data.json())
      .then(function (recipes) {
        recipeArray.push(recipes.meals);

        // random recipe
        //  get random index from recipeArray
        var randomIndex =
          recipeArray[Math.floor(Math.random() * recipeArray.length)];

        // get random recipe from random Index
        var randomRecipe =
          randomIndex[Math.floor(Math.random() * randomIndex.length)];

        appendRecipe(randomRecipe);
      });
  }
}

// -------APPEND RECIPE FUNCTION ----------
function appendRecipe(recipe) {
  // clear containers upon each search
  $recipeContainer.innerHTML = "";

  // append the Recipe name
  var recipeName = document.querySelector(".food-name");
  recipeName.textContent = recipe.strMeal;

  // append the recipe image
  var recipeImage = document.querySelector("#foodimage");
  recipeImage.src = recipe.strMealThumb;

  // append food network URL
  var recipeUrl = document.querySelector("#foodlink");
  recipeUrl.href = foodNetworkUrl;
  recipeUrl.setAttribute("target", "_blank");
  recipeUrl.innerText = "Click here for recipes!";
}

/* Cocktail Button */
var cocktailbtn = document.querySelector(".dropdown");
function showDrinks() {
  cocktailbtn.classList.toggle("is-active");
}
var userLiquorPreference = [];

saveBtn.addEventListener("click", function () {
  savedRecipeArr.push(foodNetworkUrl);
  localStorage.setItem("saved-recipe", JSON.stringify(savedRecipeArr));

  savedLiquorArr.push(liquorLink);
  localStorage.setItem("saved-drink", JSON.stringify(savedLiquorArr));

  renderSavedItems();
});

var savedLiquorArr = getSavedLiquor();

function getSavedLiquor() {
  var drinkData = JSON.parse(localStorage.getItem("saved-drink"));
  if (drinkData) {
    return drinkData;
  } else {
    return [];
  }
}

var savedRecipeArr = getSavedRecipes();

function getSavedRecipes() {
  var recipeData = JSON.parse(localStorage.getItem("saved-recipe"));
  if (recipeData) {
    return recipeData;
  } else {
    return [];
  }
}

// --------COCKTAIL API TESTING-------------
var cocktailMenu = document.querySelector("#cocktails");

function fetchCocktailData(drink) {
  // if non alcoholic, fetch this API then return
  var naUrl = `https://www.thecocktaildb.com/api/json/v1/1/filter.php?a=Non_Alcoholic`;

  if (drink === "Non_Alcoholic") {
    fetch(naUrl)
      .then((data) => data.json())
      .then(function (mocktails) {
        cocktailArray.push(mocktails.drinks);
        var randIndex =
          cocktailArray[Math.floor(Math.random() * cocktailArray.length)];

        var randCocktail =
          randIndex[Math.floor(Math.random() * randIndex.length)];

        appendCocktail(randCocktail);
        cocktailArray = [];
      });
  } else {
    var cocktailUrl = `https://www.thecocktaildb.com/api/json/v1/1/filter.php?i=${drink}`;

    fetch(cocktailUrl)
      .then((data) => data.json())
      .then(function (cocktails) {
        cocktailArray.push(cocktails.drinks);

        var randIndex =
          cocktailArray[Math.floor(Math.random() * cocktailArray.length)];

        var randCocktail =
          randIndex[Math.floor(Math.random() * randIndex.length)];

        appendCocktail(randCocktail);
        cocktailArray = [];
      });
  }
}

var $cocktailContainer = document.querySelector("#cocktail-append");

// ---------APPEND COCKTAIL FUNCTION--------
function appendCocktail(drink) {
  // clear containers upon each search
  $cocktailContainer.innerHTML = "";

  // append the Cocktail name
  var cocktailName = document.querySelector(".drink-name");
  cocktailName.textContent = drink.strDrink;

  // append the Cocktail image
  var cocktailImage = document.querySelector("#drinkimage");
  cocktailImage.src = drink.strDrinkThumb;

  var drinkLink = document.querySelector("#drinklink");
  drinkLink.href = liquorLink;
  drinkLink.setAttribute("target", "_blank");
  drinkLink.innerText = "Click here for recipes!";
}

renderSavedItems();
