const selectElement = document.getElementById('restaurantSelect');
const dailyBtn = document.getElementById('dailyBtn');
const weeklyBtn = document.getElementById('weeklyBtn');
const menuDisplay = document.getElementById('menuDisplay');

let selectedRestaurantId = '';
let currentMenuType = 'daily';

const API_BASE = 'https://media2.edu.metropolia.fi/restaurant/api/v1';


// Load restaurants
function loadRestaurants() {

  fetch(API_BASE + '/restaurants')
    .then(function(response) {

      console.log('Response status:', response.status);

      return response.json();
    })
    .then(function(data) {

      console.log('API data:', data);

      const restaurants = data;

      selectElement.innerHTML =
        '<option value="">-- Choose a restaurant --</option>';

      for (let i = 0; i < restaurants.length; i++) {

        const option = document.createElement('option');

        option.value = restaurants[i]._id;
        option.textContent = restaurants[i].name;

        selectElement.appendChild(option);
      }

    })
    .catch(function(error) {

      console.log('Restaurant error:', error);

      menuDisplay.innerHTML =
        '<p>Error loading restaurants.</p>';
    });
}


// Load menu
function loadMenu() {

  if (selectedRestaurantId === '') {

    menuDisplay.innerHTML =
      '<p>Please select a restaurant first.</p>';

    return;
  }

  let url = '';

  if (currentMenuType === 'daily') {

    url =
      API_BASE +
      '/restaurants/daily/' +
      selectedRestaurantId +
      '/fi';

  } else {

    url =
      API_BASE +
      '/restaurants/weekly/' +
      selectedRestaurantId +
      '/fi';
  }

  console.log('Menu URL:', url);

  fetch(url)
    .then(function(response) {

      console.log('Menu response status:', response.status);

      return response.json();
    })
    .then(function(data) {

      console.log(
        'Menu data:',
        JSON.stringify(data, null, 2)
      );

      displayMenuData(data);

    })
    .catch(function(error) {

      console.log('Menu error:', error);

      menuDisplay.innerHTML =
        '<p>Error loading menu.</p>';
    });
}


// Display menu
function displayMenuData(data) {

  menuDisplay.innerHTML = '';


  // Daily menu
  if (currentMenuType === 'daily') {

    if (!data.courses || data.courses.length === 0) {

      menuDisplay.innerHTML =
        '<p>No daily menu available.</p>';

      return;
    }

    const ul = document.createElement('ul');

    for (let i = 0; i < data.courses.length; i++) {

      const li = document.createElement('li');

      li.textContent =
        data.courses[i].name +
        ' - ' +
        data.courses[i].price;

      ul.appendChild(li);
    }

    menuDisplay.appendChild(ul);
  }


  // Weekly menu
  else {

    if (!data.days || data.days.length === 0) {

      menuDisplay.innerHTML =
        '<p>No weekly menu available.</p>';

      return;
    }

    for (let i = 0; i < data.days.length; i++) {

      const dayHeading = document.createElement('h3');

      dayHeading.textContent =
        data.days[i].date;

      menuDisplay.appendChild(dayHeading);

      const ul = document.createElement('ul');

      const courses =
        data.days[i].courses || [];

      for (let j = 0; j < courses.length; j++) {

        const li = document.createElement('li');

        li.textContent =
          courses[j].name +
          ' - ' +
          courses[j].price;

        ul.appendChild(li);
      }

      menuDisplay.appendChild(ul);
    }
  }
}


// Restaurant selection
selectElement.addEventListener('change', function(event) {

  selectedRestaurantId = event.target.value;

  loadMenu();
});


// Daily Menu button
dailyBtn.addEventListener('click', function() {

  currentMenuType = 'daily';

  loadMenu();
});


// Weekly Menu button
weeklyBtn.addEventListener('click', function() {

  currentMenuType = 'weekly';

  loadMenu();
});


// Start application
loadRestaurants();