const selectElement = document.getElementById('restaurantSelect');
const dailyBtn = document.getElementById('dailyBtn');
const weeklyBtn = document.getElementById('weeklyBtn');
const menuDisplay = document.getElementById('menuDisplay');

let selectedRestaurantId = '';
let currentMenuType = 'daily';

// Metropolia Course REST API Base URL
const API_BASE = 'https://10.120.32.94/restaurant/api/v1';

function loadRestaurants() {
  fetch(API_BASE + '/restaurants')
    .then(function(response) {
      return response.json();
    })
    .then(function(restaurants) {
      selectElement.innerHTML = '<option value="">-- Choose a restaurant --</option>';
      for (let i = 0; i < restaurants.length; i++) {
        const option = document.createElement('option');
        option.value = restaurants[i]._id || restaurants[i].id;
        option.textContent = restaurants[i].name;
        selectElement.appendChild(option);
      }
    })
    .catch(function(error) {
      menuDisplay.innerHTML = '<p>Error loading restaurants. Make sure you are on Metropolia network/VPN and SSL warning is bypassed.</p>';
    });
}

function loadMenu() {
  if (selectedRestaurantId === '') {
    menuDisplay.innerHTML = '<p>Please select a restaurant first.</p>';
    return;
  }

  let url = '';
  if (currentMenuType === 'daily') {
    url = API_BASE + '/restaurants/daily/' + selectedRestaurantId + '/fi';
  } else {
    url = API_BASE + '/restaurants/weekly/' + selectedRestaurantId + '/fi';
  }

  fetch(url)
    .then(function(response) {
      return response.json();
    })
    .then(function(data) {
      displayMenuData(data);
    })
    .catch(function(error) {
      menuDisplay.innerHTML = '<p>Error loading menu.</p>';
    });
}

function displayMenuData(data) {
  menuDisplay.innerHTML = '';

  if (currentMenuType === 'daily') {
    if (!data.courses || data.courses.length === 0) {
      menuDisplay.innerHTML = '<p>No daily menu available.</p>';
      return;
    }

    const ul = document.createElement('ul');
    for (let i = 0; i < data.courses.length; i++) {
      const li = document.createElement('li');
      li.textContent = data.courses[i].name + ' - ' + (data.courses[i].price || 'Student price');
      ul.appendChild(li);
    }
    menuDisplay.appendChild(ul);
  } else {
    if (!data.days || data.days.length === 0) {
      menuDisplay.innerHTML = '<p>No weekly menu available.</p>';
      return;
    }

    for (let i = 0; i < data.days.length; i++) {
      const dayHeading = document.createElement('h3');
      dayHeading.textContent = data.days[i].date;
      menuDisplay.appendChild(dayHeading);

      const ul = document.createElement('ul');
      const courses = data.days[i].courses || [];
      for (let j = 0; j < courses.length; j++) {
        const li = document.createElement('li');
        li.textContent = courses[j].name;
        ul.appendChild(li);
      }
      menuDisplay.appendChild(ul);
    }
  }
}

selectElement.addEventListener('change', function(event) {
  selectedRestaurantId = event.target.value;
  loadMenu();
});

dailyBtn.addEventListener('click', function() {
  currentMenuType = 'daily';
  loadMenu();
});

weeklyBtn.addEventListener('click', function() {
  currentMenuType = 'weekly';
  loadMenu();
});

loadRestaurants();