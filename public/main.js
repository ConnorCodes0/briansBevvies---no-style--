// grab all the elements
const ingredientFieldset = document.querySelector('.ingredient-fieldset');
const smoothieBaseFieldset = document.querySelector('.smoothie-base');
const milkBaseFieldset = document.querySelector('.milk-base');
const extrasFieldset = document.querySelector('.extras');
const optSize = document.querySelector('#size');
const optType = document.getElementsByName('type');
const optMilkBase = document.querySelector('#milk-base');
const optSmoothieBase = document.getElementsByName('smoothie-base');
const optExtras = document.getElementsByName('extras');
const currentCostSpan = document.querySelector('.drink-cost');
const totalSpan = document.querySelector('.total-span');
const form = document.querySelector('.drink-form');
const addOrderBtn = document.querySelector('.add-order-btn');
const addFavoriteBtn = document.querySelector('.add-favorite');
const orderFavoriteBtn = document.querySelector('.order-favorite');
const placeOrderBtn = document.querySelector('.place-order');

// hide and disable elements
smoothieBaseFieldset.style.display = 'none';
milkBaseFieldset.style.display = 'none';
extrasFieldset.style.display = 'none';
addFavoriteBtn.disabled = true;
addOrderBtn.disabled = true;
placeOrderBtn.disabled = true;

// enable order favourite btn if there is a drink stored in localStorage else disable it
if (localStorage.getItem('favourite') === null) {
    orderFavoriteBtn.disabled = true;

} else {
    orderFavoriteBtn.disabled = false;
}

// event listeners
optSize.addEventListener('change', changeSize);
optType.forEach(type => type.addEventListener('change', changeType));
optMilkBase.addEventListener('change', getBase);
optSmoothieBase.forEach(item => item.addEventListener('change', getBase));
optExtras.forEach(extra => extra.addEventListener('change', changeExtras));
addOrderBtn.addEventListener('click', addToOrder);
addFavoriteBtn.addEventListener('click', addFavourite);
orderFavoriteBtn.addEventListener('click', orderFavourite);
placeOrderBtn.addEventListener('click', placeOrder);

// create global variables
let currentCost;
let totalCost = 0;
let size;
let type;
let base;
let ingredients;
let extras;

// function to initialise variables
function initialise() {
    currentCost = 3.20;
    size = 'Medium';
    type = undefined;
    base = undefined;
    ingredients = [];
    extras = [];
}

// call initialise function
initialise();

// fetch content from ingredients.json and call json ingredients function inputting data from json
fetch("ingredients.json").then(res => res.json()).then(data => addJsonIngredients(data)).catch(error => console.log(`Error: ${error}`));

// function to use json to create ingredient list
function addJsonIngredients(data) {

    // loop through each item in ingredient list and add input to form
    data.ingredients.forEach(ingredient => {

        // create all elements for ingredient input
        const ingredientDiv = document.createElement('div');
        const ingredientLabel = document.createElement('label');
        const labelTxt = document.createTextNode(`${ingredient}`);
        const ingredientInput = document.createElement('input');
        
        // set the attributes for the input and label
        ingredientLabel.setAttribute('for', `${ingredient}`);
        ingredientInput.setAttribute('type', 'checkbox');
        ingredientInput.setAttribute('name', 'ingredient');
        ingredientInput.setAttribute('id', `${ingredient}`);
        ingredientInput.setAttribute('value', `${ingredient}`);

        // append to parent elements
        ingredientLabel.appendChild(labelTxt);
        ingredientDiv.appendChild(ingredientLabel);
        ingredientDiv.appendChild(ingredientInput);
        ingredientFieldset.appendChild(ingredientDiv);

        // add event listener to each element
        ingredientInput.addEventListener('change', changeIngredients);
    });
}

// function to enable and diable btns when at least 1 ingredient and the type of drink is selected
function toggleBtn() {
    if (ingredients.length > 0 && type !== undefined) {
        addFavoriteBtn.disabled = false;
        addOrderBtn.disabled = false;

    } else {
        addFavoriteBtn.disabled = true;
        addOrderBtn.disabled = true;
    }
}

// function to check size
function changeSize() {
    // set the size of drink
    // get list of all the options, get the index of the selected option, get item from list using index and set size as the text of that option
    size = this.options[this.selectedIndex].text;

    // update current cost to the base cost of size + any extras added (so cost of extras is added if size is changed after they have been selected)
    currentCost = parseFloat(this.value) + (extras.length * 0.85);

    // output cost
    currentCostSpan.innerText = currentCost.toFixed(2);
}

// function to check type
function changeType() {
    if (this.value === 'smoothie') {
        type = 'smoothie';
        // set base to default value for smoothie
        base = 'orange juice';

        // show options for smoothie
        smoothieBaseFieldset.style.display = 'flex';
    
        // hide options for milkshake
        milkBaseFieldset.style.display = 'none';
        extrasFieldset.style.display = 'none';

    } else if (this.value === 'milkshake') {
        type = 'milkshake';
        // set base to default value for milkshake
        base = 'skimmed milk';

        // show options for milkshake
        milkBaseFieldset.style.display = 'flex';
        extrasFieldset.style.display = 'flex';
    
        // hide options for smoothie
        smoothieBaseFieldset.style.display = 'none';

    } else {
        // hide all options if no type is selected
        smoothieBaseFieldset.style.display = 'none';
        milkBaseFieldset.style.display = 'none';
        extrasFieldset.style.display = 'none';
    }

    // call function to toggle btns
    toggleBtn();
}

// function to get base
function getBase() {
    if (type === 'smoothie') {
        base = this.value;

    } else if (type === 'milkshake') {
        base = this.value;
    }
}

// function to add and remove ingredients
function changeIngredients() {

    if (this.checked) {
        ingredients.push(this.value);

    } else {
        // get the index of the checkbox clicked and remove the extra from aray
        const index = ingredients.indexOf(this.value);

        if (index !== -1) {
            ingredients.splice(index, 1);
        }
    }

    // call function to toggle btns
    toggleBtn();
}

// function to add and remove extras
function changeExtras() {

    if (this.checked) {
        extras.push(this.value);

        // increase cost
        currentCost += 0.85;

    } else {
        // get the index of the checkbox clicked and remove the extra from aray
        const index = extras.indexOf(this.value);

        if (index !== -1) {
            extras.splice(index, 1);

            // decrease cost
            currentCost -= 0.85; 
        }
    }

    // output current cost
    currentCostSpan.innerText = currentCost.toFixed(2);
}

// function to create a new order, used by add favourite and add to order btn
function newOrder(size, type, ingredients, base, extras, cost) {
    // create all the new elements to hold order info and cost
    const newOrderDiv = document.createElement('div');
    newOrderDiv.classList.add('new-order-container');

    const newOrderP = document.createElement('p');
    const newOrderTxt = document.createTextNode(`${size} ${type}: ${ingredients} with ${base} ${extras}`);
    const costP = document.createElement('p');
    const costTxt = document.createTextNode(`£${cost.toFixed(2)}`);


    // append txt nodes to new elements
    newOrderP.appendChild(newOrderTxt);
    newOrderDiv.appendChild(newOrderP);
    costP.appendChild(costTxt);
    newOrderDiv.appendChild(costP);

    // append new order to current order container
    const currentOrderDiv = document.querySelector('.current-order-content');
    currentOrderDiv.appendChild(newOrderDiv);

    // update and output total cost
    totalCost += currentCost;
    totalSpan.innerText = totalCost.toFixed(2);

    // reset drink details
    form.reset(); // reset form

    // hide drink base inputs and extras inputs
    smoothieBaseFieldset.style.display = 'none';
    milkBaseFieldset.style.display = 'none';
    extrasFieldset.style.display = 'none';
    // disable btns
    addFavoriteBtn.disabled = true;
    addOrderBtn.disabled = true;

    placeOrderBtn.disabled = false;
}

// function to add a new order
function addToOrder() {
    // convert ingredients from array to string if ingredients were added
    ingredientsStr = ingredients.join(', ');


    // convert extras from array to string if extras were added and milkshake selected
    if (type === 'milkshake') {
        extrasStr = 'and extra ' + extras.join(', ');

    } else {
        extrasStr = '';
    }

    // add the drink to the order
    newOrder(size, type, ingredientsStr, base, extrasStr, currentCost);

    // reset global variables
    initialise();

    // output reset cost
    currentCostSpan.innerText = currentCost.toFixed(2);
}

// function to add a favourite drink
function addFavourite() {
    // convert ingredients from array to string
    ingredientsStr = ingredients.join(', ');

    // convert extras from array to string
    if (type === 'milkshake') {
        extrasStr = 'and extra ' + extras.join(', ');

    } else {
        extrasStr = '';
    }

    // clear previous favourite from local storage
    localStorage.clear();

    // convert array to string and add to localStorage as favourite drink
    let faveOrderArr = [size, type, ingredientsStr, base, extrasStr, currentCost]; // add the order to an array
    faveOrderArr = JSON.stringify(faveOrderArr); // convert array to string

    localStorage.setItem('favourite', faveOrderArr); // store into localStorage

    // show order favourite btn
    orderFavoriteBtn.disabled = false;
}

// function to order favourite drink
function orderFavourite() {
    // get favourite drink from localStorage and convert back to array
    const favoriteDrink = JSON.parse(localStorage.getItem('favourite'));

    // update current cost to cost of favourite drink
    currentCost = favoriteDrink[5];

    // call the add to current order method to add favourite drink to order
    newOrder(favoriteDrink[0], favoriteDrink[1], favoriteDrink[2], favoriteDrink[3], favoriteDrink[4], favoriteDrink[5]);

    // reset global variables
    initialise();

    // output reset cost
    currentCostSpan.innerText = currentCost.toFixed(2);
}

// function to place order
function placeOrder() {
    // alert user that they placed order
    alert(`Order placed! Total cost: £${totalCost.toFixed(2)}`);

    // loop through and remove all current order elements
    const removeCurrentOrder = document.querySelectorAll('.new-order-container');

    for (let i = 0; i < removeCurrentOrder.length; i++) {
        removeCurrentOrder[i].remove();
    }

    // reset drink details
    form.reset();

    // hide drink base inputs and extras inputs
    smoothieBaseFieldset.style.display = 'none';
    milkBaseFieldset.style.display = 'none';
    extrasFieldset.style.display = 'none';
    // disable btns
    addFavoriteBtn.disabled = true;
    addOrderBtn.disabled = true;
    placeOrderBtn.disabled = true;

    // reset global variables
    initialise();
    totalCost = 0;

    // reset and output total and current cost
    currentCostSpan.innerText = currentCost.toFixed(2);
    totalSpan.innerText = totalCost.toFixed(2);
}