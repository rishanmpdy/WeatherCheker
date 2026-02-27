 


        const API_KEY = 'd5866ababe3e8cc1f972efebc36ddbda';

        const weatherCard = document.getElementById("weatherCard");
        const errorMsg = document.getElementById("errorMsg");
        const loading = document.getElementById("loading");
        const favoritesList = document.getElementById("favoritesList");
         const cityInput = document.getElementById("cityInput");


        // 1. IMPLEMENT getWeather(city) - Fetch API + async/await
            async function getWeather(city){

                const weatherURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;
                const forecastURL = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`;

                try{

                    const [weatherRes, forecastRes] = await Promise.all([
                        fetch(weatherURL),
                        fetch(forecastURL)
                    ]);

                    if(!weatherRes.ok || !forecastRes.ok){
                        throw new Error("City not found");
                    }

                    const weatherData = await weatherRes.json();
                    const forecastData = await forecastRes.json();

                    return { weatherData, forecastData };

                }catch(error){
                    throw error;
                }
            }



        // 2. IMPLEMENT addFavorite(city)

                function addFavorite(city){

                    let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

                    if(!favorites.includes(city)){
                        favorites.push(city);
                        localStorage.setItem("favorites", JSON.stringify(favorites));
                        loadFavorites();
                    }
                }

        // 3. IMPLEMENT loadFavorites()
                    function loadFavorites(){

                        favoritesList.innerHTML = "";
                        let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

                            favorites.forEach(city=>{
                                const div = document.createElement("div");
                                div.className = "favorite-item";
                                div.innerHTML = `
                                    <span onclick="searchWeather('${city}')">${city}</span>
                                    <button onclick="removeFavorite('${city}')">❌</button>
                                `;
                                favoritesList.appendChild(div);
                            });
                    }

                    function removeFavorite(city){
                        let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
                        favorites = favorites.filter(c=>c!==city);
                        localStorage.setItem("favorites", JSON.stringify(favorites));
                        loadFavorites();
                    }



        // 4. IMPLEMENT searchWeather()

                        async function searchWeather(city){

                        city = city.trim(); 
                            if(!city) return;

                        weatherCard.style.display="none";
                        errorMsg.style.display="none";
                        loading.style.display="block";

                        try{

                            const {weatherData, forecastData} = await getWeather(city);

                            displayWeather(weatherData, forecastData);
                            loading.style.display="none";

                        }catch(error){

                            loading.style.display="none";
                            errorMsg.innerText="City not found!";
                            errorMsg.style.display="block";
                        }
                    }

                    //display wether
                         function displayWeather(data, forecast){

                        const daily = forecast.list.filter(item=>item.dt_txt.includes("12:00:00")).slice(0,5);

                        weatherCard.innerHTML = `
                            <h2>${data.name}</h2>
                            <h3>${Math.round(data.main.temp)}°C</h3>
                            <p>${data.weather[0].description}</p>
                            <p>Humidity: ${data.main.humidity}%</p>
                            <p>Wind: ${data.wind.speed} m/s</p>
                            <button onclick="addFavorite('${data.name}')">⭐ Add to Favorites</button>

                            <div class="forecast">
                                ${daily.map(day=>`
                                    <div class="forecast-card">
                                        <p>${new Date(day.dt_txt).toLocaleDateString()}</p>
                                        <p>${Math.round(day.main.temp)}°C</p>
                                        <p>${day.weather[0].main}</p>
                                    </div>
                                `).join("")}
                            </div>
                        `;

                        weatherCard.style.display="block";
                    }




        // 5. IMPLEMENT debounceSearch()

                    function debounce(fn, delay){
                        let timeout;
                        return (...args)=>{
                            clearTimeout(timeout);
                            timeout = setTimeout(()=>fn(...args), delay);
                        };
                    }

                    const debouncedSearch = debounce((city)=>{
                        if(city && city.trim().length >= 2){    
                            searchWeather(city);
                        }
                   }, 500);

                            



        // 6. Event Listeners (wire up buttons/inputs)

                        document.addEventListener("DOMContentLoaded", ()=>{
                            
                            loadFavorites();
                 
                            document.getElementById("searchBtn").addEventListener("click", ()=>{
                                const city = cityInput.value;
                                searchWeather(city);
                            });

                            cityInput.addEventListener("keypress", (e)=>{
                                if(e.key === "Enter"){
                                    searchWeather(e.target.value);
                                }
                            });

                            cityInput.addEventListener("input",(e)=>{
                                debouncedSearch(e.target.value);
                            });

                            document.getElementById("themeBtn").addEventListener("click", ()=>{
                                document.body.classList.toggle("dark");
                            });

                        });
                    
             // Export functions for button onclick (temporary)
                    window.searchWeather=searchWeather;
                    window.addFavorite=addFavorite;
 

  