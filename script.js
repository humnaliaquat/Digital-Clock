const tickSound = document.getElementById("tick-sound");
const soundToggle = document.getElementById("sound-toggle");
let soundOn = true;
soundToggle.addEventListener("click", function () {
  soundOn = !soundOn;
  if (soundOn) {
    tickSound.muted = false;
  } else {
    tickSound.muted = true;
  }
});
function displayTime() {
  const now = new Date();
  let hours = now.getHours();
  let minutes = now.getMinutes();
  let seconds = now.getSeconds();
  let ampm = hours >= 12 ? "pm" : "am";

  hours = hours % 12;
  hours = hours < 10 ? "0" + hours : hours;
  minutes = minutes < 10 ? "0" + minutes : minutes;
  seconds = seconds < 10 ? "0" + seconds : seconds;
  document.getElementById(
    "clock"
  ).innerHTML = `${hours}:${minutes}:${seconds} ${ampm}`;

  const tickSound = document.getElementById("tick-sound");
  if (tickSound) {
    tickSound.currentTime = 0; //
    tickSound.play();
  }
}

async function getWeather() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      function (position) {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;

        let apiKey = "ADD-API-KEY-HERE";

        const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

        fetch(url)
          .then((response) => response.json())
          .then((data) => {
            const city = data.name;
            const temp = Math.round(data.main.temp);

            const condition = data.weather[0].main;
            const icon = data.weather[0].icon;
            document.getElementById("city").innerHTML = city;
            document.getElementById("temp").innerHTML = `${temp}°C`;
            const iconURL = `https://openweathermap.org/img/wn/${icon}.png`;
            document.getElementById(
              "icon"
            ).innerHTML = `<img src="${iconURL}" alt="${condition}" />`;

            const body = document.body;

            if (condition.includes("Clear")) {
              body.classList.remove("cloudy", "rainy", "snowy");
              body.classList.add("sunny");
            } else if (condition.includes("Clouds")) {
              body.classList.remove("sunny", "rainy", "snowy");
              body.classList.add("cloudy");
            } else if (condition.includes("Rain")) {
              body.classList.remove("sunny", "cloudy", "snowy");
              body.classList.add("rainy");
            } else if (condition.includes("Snow")) {
              body.classList.remove("sunny", "cloudy", "rainy");
              body.classList.add("snowy");
            }
          })
          .catch((err) => {
            console.error("Error with weather API:", err);
          });
      },
      // Error callback for geolocation
      function (error) {
        alert("Error: " + error.message);
      }
    );
  } else {
    alert("Geolocation is not supported by this browser.");
  }
}

setInterval(displayTime, 1000);
displayTime();
getWeather();
