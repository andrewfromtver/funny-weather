/* side API requests */
    /* Address query DADATA API */
function query(input, type) {
    var url = 'https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/address';
    var token = '0e16cee31b2f66a930741dcb0890816f4f9ecf15';
    var query = String(input);
    var options = {
        method: 'POST',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': 'Token ' + token
        },
        body: JSON.stringify({query: query})
    };
    if (input.length > 2) {
        fetch(url, options)
            .then(response => response.text())
            .then(result => suggestions = JSON.parse(result).suggestions)
            .catch(error => console.log('error', error));
        var inner = `
            <div class='loader_placeholder'>
                <div class='lds-ellipsis loader'><div></div><div></div><div></div><div></div></div>
            </div>
        `;
        if (suggestions.length > 0) {
            inner = '';
        }
        if (type == 'friends') {
            suggestions.forEach(function(item) {
                if (item.data.geo_lat & item.data.geo_lon) {
                    inner += `<p onclick='friends(${item.data.geo_lon}, ${item.data.geo_lat}, "${item.value}")'>${item.value}</p>`;
                }
            });
        }
        if (type == 'weather') {
            suggestions.forEach(function(item) {
                if (item.data.geo_lat & item.data.geo_lon) {
                    inner += `<p id='${item.data.geo_lon},${item.data.geo_lat}' onclick="writegeoloc(this)">${item.value}</p>`;
                }
            });
        }
        if (type == 'stat') {
            suggestions.forEach(function(item) {
                if (item.data.geo_lat & item.data.geo_lon) {
                    inner += `<p id='${item.data.geo_lon},${item.data.geo_lat}' onclick="statinfo(${item.data.geo_lon}, ${item.data.geo_lat}, '${item.value}')">${item.value}</p>`;
                }
            });
        }
        document.querySelector('.suggestions').style.display = 'block';
        document.querySelector('.suggestions').innerHTML = inner;
    }
    if (input.length < 4) {
        suggestions = [];
        document.querySelector('.suggestions').innerHTML = '';
        document.querySelector('.suggestions').style.display = 'none';
    }
}
    /* Weather request OWM API */
function weatherrequest(lat, lon, mode, time = '') {
    event.preventDefault();
    if (lat & lon) {
        if (!fetchweatherdata) {
            var url = "https://api.openweathermap.org/data/2.5/weather";
            fetch(url+`?lat=${lon}&lon=${lat}&appid=${token}&mode=${mode}&lang=RU&units=metric`)
                .then(function(value){
                    if(value.status !== 200){
                        return Promise.reject(new Error('Ошибка'));
                    }
                    return value.json();
                })
                .then(function(output){
                    fetchweatherdata = output;
                    currentweather = JSON.stringify(output);
                    var inner = `
                        <div class="meteoinfo leftblock">
                            <div class="title">Сегодня</div>
                            <p onclick="weather(null, null)">${JSON.parse(currentweather).weather[0].description}</p>
                            <p onclick="addinfo('temp')">${'температура воздуха ' + JSON.parse(currentweather).main.temp + ' °C'}</p>
                            <p onclick="addinfo('feeltemp')">${'ощущяется как ' + JSON.parse(currentweather).main.feels_like + ' °C'}</p>
                            <p onclick="addinfo('hum')">${'влажность ' + JSON.parse(currentweather).main.humidity + ' %'}</p>
                            <p onclick="addinfo('pres')">${'атмосферное давление ' + JSON.parse(currentweather).main.pressure + ' мм рт. ст.'}</p>
                        </div>
                    `;
                    document.querySelector('.weatherinfo').innerHTML = inner;
                    document.querySelector('.weatherinfo').innerHTML += `
                        <div class="meteoinfo rightblock">
                        <iframe
                            id="map"
                            width="100%"
                            height="100%"
                            frameborder="0"
                            scrolling="no"
                            src="https://www.openstreetmap.org/export/embed.html?bbox=${Number(lat) - 0.015},${Number(lon) - 0.015},${Number(lat) + 0.015},${Number(lon) + 0.015}&amp;layer=mapquest&amp;marker=${lon},${lat}">
                        </iframe>
                    `;
                    devCheck();
                    weathertab = document.querySelector('.content').innerHTML;
                });
        }
        else {
            
            currentweather = JSON.stringify(fetchweatherdata);
            var inner = `
                <div class="meteoinfo leftblock">
                    <div class="title">Сегодня</div>
                    <p onclick="weather(null, null)">${JSON.parse(currentweather).weather[0].description}</p>
                    <p onclick="addinfo('temp')">${'температура воздуха ' + JSON.parse(currentweather).main.temp + ' °C'}</p>
                    <p onclick="addinfo('feeltemp')">${'ощущяется как ' + JSON.parse(currentweather).main.feels_like + ' °C'}</p>
                    <p onclick="addinfo('hum')">${'влажность ' + JSON.parse(currentweather).main.humidity + ' %'}</p>
                    <p onclick="addinfo('pres')">${'атмосферное давление ' + JSON.parse(currentweather).main.pressure + ' мм рт. ст.'}</p>
                </div>
            `;
            document.querySelector('.weatherinfo').innerHTML = inner;
            document.querySelector('.weatherinfo').innerHTML += `
                <div class="meteoinfo rightblock">
                <iframe
                    width="100%"
                    height="100%"
                    frameborder="0"
                    scrolling="no"
                    src="https://www.openstreetmap.org/export/embed.html?bbox=${Number(lat) - 0.015},${Number(lon) - 0.015},${Number(lat) + 0.015},${Number(lon) + 0.015}&amp;layer=mapquest&amp;marker=${lon},${lat}">
                </iframe>
            `;
            devCheck();
            weathertab = document.querySelector('.content').innerHTML;
        }
    }
}
    /* Weather tab forecast OWM API */
function forecast(days, exclude = 'current,minutely,hourly,alerts') {
    event.preventDefault();
    var url = "https://api.openweathermap.org/data/2.5/onecall";
    if (days == 2) {
        forecasttemp = [];
        forecastfeeltemp = [];
        nextforecasttemp = [];
        nextforecastfeeltemp = [];
        document.querySelector('.detail').innerHTML = '';
        if (globallat & globallon) {
            if (!fetchsecondforecastdata) {
                fetch(url+`?lat=${globallon}&lon=${globallat}&exclude=current,minutely,hourly,alerts&appid=${token}&lang=RU&units=metric`)
                    .then(function(value){
                        if(value.status !== 200){
                            return Promise.reject(new Error('Ошибка'));
                        }
                        return value.json();
                    })
                    .then(function(output){
                        fetchsecondforecastdata = output;
                        forecasttemp.push(output.daily[1].temp.day);
                        forecasttemp.push(output.daily[1].temp.eve);
                        forecasttemp.push(output.daily[1].temp.night);
                        forecastfeeltemp.push(output.daily[1].feels_like.day);
                        forecastfeeltemp.push(output.daily[1].feels_like.eve);
                        forecastfeeltemp.push(output.daily[1].feels_like.night);
                        nextforecasttemp.push(output.daily[2].temp.day);
                        nextforecasttemp.push(output.daily[2].temp.eve);
                        nextforecasttemp.push(output.daily[2].temp.night);
                        nextforecastfeeltemp.push(output.daily[2].feels_like.day);
                        nextforecastfeeltemp.push(output.daily[2].feels_like.eve);
                        nextforecastfeeltemp.push(output.daily[2].feels_like.night);
                    });
            }
            else {  
                forecasttemp.push(fetchsecondforecastdata.daily[1].temp.day);
                forecasttemp.push(fetchsecondforecastdata.daily[1].temp.eve);
                forecasttemp.push(fetchsecondforecastdata.daily[1].temp.night);
                forecastfeeltemp.push(fetchsecondforecastdata.daily[1].feels_like.day);
                forecastfeeltemp.push(fetchsecondforecastdata.daily[1].feels_like.eve);
                forecastfeeltemp.push(fetchsecondforecastdata.daily[1].feels_like.night);
                nextforecasttemp.push(fetchsecondforecastdata.daily[2].temp.day);
                nextforecasttemp.push(fetchsecondforecastdata.daily[2].temp.eve);
                nextforecasttemp.push(fetchsecondforecastdata.daily[2].temp.night);
                nextforecastfeeltemp.push(fetchsecondforecastdata.daily[2].feels_like.day);
                nextforecastfeeltemp.push(fetchsecondforecastdata.daily[2].feels_like.eve);
                nextforecastfeeltemp.push(fetchsecondforecastdata.daily[2].feels_like.night);
            }
        }
        if (forecasttemp.length > 0) {
            document.querySelector('.detail').innerHTML += `
                <div class="title">Сравнительный температурный график (завтра / послезавтра)</div>
                <canvas style="margin-bottom: 50px;" id="forecastChart"></canvas>
            `;
            var ctx = document.getElementById('forecastChart').getContext('2d');
            var chart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: ['День', 'Вечер', 'Ночь'],
                    datasets: [{
                        label: 'Т завтра (°C)',
                        backgroundColor: '#13926B',
                        data: forecasttemp
                    },{
                        label: 'Т завтра (по ощущениям) (°C)',
                        backgroundColor: '#CC1B41',
                        data: forecastfeeltemp
                    },{
                        label: 'Т послезавтра (°C)',
                        backgroundColor: '#13926B',
                        data: nextforecasttemp
                    },{
                        label: 'Т послезавтра (по ощущениям) (°C)',
                        backgroundColor: '#CC1B41',
                        data: nextforecastfeeltemp
                    }]
                },
                options: {
                    layout: {
                        padding: {
                            left: 5,
                            right: 15,
                            top: 5,
                            bottom: 5
                        }
                    }
                }
            });
            function intoview() {
                document.querySelector('#forecastChart').scrollIntoView({block: "center", inline: "center", behavior: "smooth"});
            }
            setTimeout(intoview, 250);
        }
    }
    else {
        document.querySelector('.detail').innerHTML = '';
    }
    if (globallat & globallon) {
        if (!fetchforecastdata) {
            fetch(url+`?lat=${globallon}&lon=${globallat}&exclude=${exclude}&appid=${token}&lang=RU&units=metric`)
                .then(function(value){
                    if(value.status !== 200){
                        return Promise.reject(new Error('Ошибка'));
                    }
                    return value.json();
                })
                .then(function(output){
                    fetchforecastdata = output;
                    if (days == 2) {
                        inner = `
                            <div class="weatherinfo">
                                <div class="meteoinfo leftblock">
                                    <div class="title">Завтра</div>
                                    <p onclick="addinfo(null, 'right', true)">${output.daily[1].weather[0].description}</p>
                                    <p onclick="addinfo('temp')">${'температура воздуха ' + output.daily[1].temp.day + ' °C'}</p>
                                    <p onclick="addinfo('feeltemp')">${'ощущяется как ' + output.daily[1].feels_like.day + ' °C'}</p>
                                    <p onclick="addinfo('hum')">${'влажность ' + output.daily[1].humidity + ' %'}</p>
                                    <p onclick="addinfo('pres')">${'атмосферное давление ' + output.daily[1].pressure + ' мм рт. ст.'}</p>
                                </div>
                                <div class="meteoinfo rightblock">
                                    <div class="title">Послезавтра</div>
                                    <p onclick="addinfo(null, 'left', true)">${output.daily[2].weather[0].description}</p>
                                    <p onclick="addinfo('temp', 'left')">${'температура воздуха ' + output.daily[2].temp.day + ' °C'}</p>
                                    <p onclick="addinfo('feeltemp', 'left')">${'ощущяется как ' + output.daily[2].feels_like.day + ' °C'}</p>
                                    <p onclick="addinfo('hum', 'left')">${'влажность ' + output.daily[2].humidity + ' %'}</p>
                                    <p onclick="addinfo('pres', 'left')">${'атмосферное давление ' + output.daily[2].pressure + ' мм рт. ст.'}</p>
                                </div>
                            </div>
                            <form>
                                <button onclick="weather(null, null)">Прогноз на сегодня</button>
                                <button onclick="forecast(2)">Прогноз на 2 дня</button>
                                <button onclick="forecast(6)">Прогноз на 6 дней</button>
                            </form>
                        `;
                        document.querySelector('.content').innerHTML = inner;
                        devCheck();
                    }
                    if (days == 6) {
                        inner = `
                            <div class="weatherinfo">
                                <div class="meteoinfo">
                                    <div class="title">Завтра</div>
                                    <p onclick="forecastinfo(1)">
                                    ${output.daily[1].weather[0].description + ' ' + output.daily[1].temp.day + ' °C'}
                                    </p>
                                </div>
                                <div class="meteoinfo">
                                    <div class="title">Послезавтра</div>
                                    <p onclick="forecastinfo(2)">
                                    ${output.daily[2].weather[0].description + ' ' + output.daily[2].temp.day + ' °C'}
                                    </p>
                                </div>
                                <div class="meteoinfo">
                                    <div class="title">Яерез 3 дня</div>
                                    <p onclick="forecastinfo(3)">
                                    ${output.daily[3].weather[0].description + ' ' + output.daily[3].temp.day + ' °C'}
                                    </p>
                                </div>
                                <div class="meteoinfo">
                                    <div class="title">Яерез 4 дня</div>
                                    <p onclick="forecastinfo(4)">
                                    ${output.daily[4].weather[0].description + ' ' + output.daily[4].temp.day + ' °C'}
                                    </p>
                                </div>
                                <div class="meteoinfo">
                                    <div class="title">Яерез 5 дней</div>
                                    <p onclick="forecastinfo(5)">
                                    ${output.daily[5].weather[0].description + ' ' + output.daily[5].temp.day + ' °C'}
                                    </p>
                                </div>
                                <div class="meteoinfo">
                                    <div class="title">Яерез 6 дней</div>
                                    <p onclick="forecastinfo(6)">
                                    ${output.daily[6].weather[0].description + ' ' + output.daily[6].temp.day + ' °C'}
                                    </p>
                                </div>
                            </div>
                            <form>
                                <button onclick="weather(null, null)">Прогноз на сегодня</button>
                                <button onclick="forecast(2)">Прогноз на 2 дня</button>
                                <button onclick="forecast(6)">Прогноз на 6 дней</button>
                            </form>
                        `;
                        document.querySelector('.content').innerHTML = inner;
                        devCheck();
                    }
                });
        }
        else {
            if (days == 2) {
                inner = `
                    <div class="weatherinfo">
                        <div class="meteoinfo leftblock">
                            <div class="title">Завтра</div>
                            <p onclick="addinfo(null, 'right', true)">${fetchforecastdata.daily[1].weather[0].description}</p>
                            <p onclick="addinfo('temp')">${'температура воздуха ' + fetchforecastdata.daily[1].temp.day + ' °C'}</p>
                            <p onclick="addinfo('feeltemp')">${'ощущяется как ' + fetchforecastdata.daily[1].feels_like.day + ' °C'}</p>
                            <p onclick="addinfo('hum')">${'влажность ' + fetchforecastdata.daily[1].humidity + ' %'}</p>
                            <p onclick="addinfo('pres')">${'атмосферное давление ' + fetchforecastdata.daily[1].pressure + ' мм рт. ст.'}</p>
                        </div>
                        <div class="meteoinfo rightblock">
                            <div class="title">Послезавтра</div>
                            <p onclick="addinfo(null, 'left', true)">${fetchforecastdata.daily[2].weather[0].description}</p>
                            <p onclick="addinfo('temp', 'left')">${'температура воздуха ' + fetchforecastdata.daily[2].temp.day + ' °C'}</p>
                            <p onclick="addinfo('feeltemp', 'left')">${'ощущяется как ' + fetchforecastdata.daily[2].feels_like.day + ' °C'}</p>
                            <p onclick="addinfo('hum', 'left')">${'влажность ' + fetchforecastdata.daily[2].humidity + ' %'}</p>
                            <p onclick="addinfo('pres', 'left')">${'атмосферное давление ' + fetchforecastdata.daily[2].pressure + ' мм рт. ст.'}</p>
                        </div>
                    </div>
                    <form>
                        <button onclick="weather(null, null)">Прогноз на сегодня</button>
                        <button onclick="forecast(2)">Прогноз на 2 дня</button>
                        <button onclick="forecast(6)">Прогноз на 6 дней</button>
                    </form>
                `;
                document.querySelector('.content').innerHTML = inner;
                devCheck();
            }
            if (days == 6) {
                inner = `
                    <div class="weatherinfo">
                        <div class="meteoinfo">
                            <div class="title">Завтра</div>
                            <p onclick="forecastinfo(1)">
                            ${fetchforecastdata.daily[1].weather[0].description + ' ' + fetchforecastdata.daily[1].temp.day + ' °C'}
                            </p>
                        </div>
                        <div class="meteoinfo">
                            <div class="title">Послезавтра</div>
                            <p onclick="forecastinfo(2)">
                            ${fetchforecastdata.daily[2].weather[0].description + ' ' + fetchforecastdata.daily[2].temp.day + ' °C'}
                            </p>
                        </div>
                        <div class="meteoinfo">
                            <div class="title">Яерез 3 дня</div>
                            <p onclick="forecastinfo(3)">
                            ${fetchforecastdata.daily[3].weather[0].description + ' ' + fetchforecastdata.daily[3].temp.day + ' °C'}
                            </p>
                        </div>
                        <div class="meteoinfo">
                            <div class="title">Яерез 4 дня</div>
                            <p onclick="forecastinfo(4)">
                            ${fetchforecastdata.daily[4].weather[0].description + ' ' + fetchforecastdata.daily[4].temp.day + ' °C'}
                            </p>
                        </div>
                        <div class="meteoinfo">
                            <div class="title">Яерез 5 дней</div>
                            <p onclick="forecastinfo(5)">
                            ${fetchforecastdata.daily[5].weather[0].description + ' ' + fetchforecastdata.daily[5].temp.day + ' °C'}
                            </p>
                        </div>
                        <div class="meteoinfo">
                            <div class="title">Яерез 6 дней</div>
                            <p onclick="forecastinfo(6)">
                            ${fetchforecastdata.daily[6].weather[0].description + ' ' + fetchforecastdata.daily[6].temp.day + ' °C'}
                            </p>
                        </div>
                    </div>
                    <form>
                        <button onclick="weather(null, null)">Прогноз на сегодня</button>
                        <button onclick="forecast(2)">Прогноз на 2 дня</button>
                        <button onclick="forecast(6)">Прогноз на 6 дней</button>
                    </form>
                `;
                document.querySelector('.content').innerHTML = inner;
                devCheck();
            }
        }
    }
}
    /* Weather tab forecast map & charts OWM API & OSM iframe */
function addinfo(type = null, position = 'right', map = false, day = 0) {
    if (map) {
        if (globallat & globallon) {
            var divposition = ''
            if (position == 'right') {
                divposition = 'left';
            }
            else if(position == 'left') {
                divposition = 'right';
            }
            document.querySelector('.' + position + 'block').innerHTML = `
                <iframe
                    id="map"
                    width="100%"
                    height="100%"
                    frameborder="0"
                    scrolling="no"
                    src="https://www.openstreetmap.org/export/embed.html?bbox=${Number(globallat) - 0.015},${Number(globallon) - 0.015},${Number(globallat) + 0.015},${Number(globallon) + 0.015}&amp;layer=mapquest&amp;marker=${globallon},${globallat}">
                </iframe>
            `;
        }
    } else {
        if (globallat & globallon) {
            if (!fetchaddinfodata) {
                var url = "https://api.openweathermap.org/data/2.5/onecall";
                fetch(url+`?lat=${globallon}&lon=${globallat}&exclude=current,minutely,alerts&appid=${token}&lang=RU&units=metric`)
                    .then(function(value){
                        if(value.status !== 200){
                            return Promise.reject(new Error('Ошибка'));
                        }
                        return value.json();
                    })
                    .then(function(output){
                        fetchaddinfodata = output;
                        var array = output.hourly;
                        currenttemp = [];
                        currentfeeltemp = [];
                        currenthum = [];
                        currentpres = [];
                        for (let index = 0; index < array.length; index = index + 4) {
                            currenttemp.push(array[index].temp);
                            currentfeeltemp.push(array[index].feels_like);
                            currenthum.push(array[index].humidity);
                            currentpres.push(array[index].pressure);
                        }
                    });
            }
            else {
                var array = fetchaddinfodata.hourly;
                        currenttemp = [];
                        currentfeeltemp = [];
                        currenthum = [];
                        currentpres = [];
                        for (let index = 0; index < array.length; index = index + 4) {
                            currenttemp.push(array[index].temp);
                            currentfeeltemp.push(array[index].feels_like);
                            currenthum.push(array[index].humidity);
                            currentpres.push(array[index].pressure);
                        }
            }
        }
        if (type == 'temp') {
            document.querySelector('.' + position + 'block').innerHTML = `
                <div class="title">Температурный график</div>
                <canvas id="myChart"></canvas>
            `;
            var ctx = document.getElementById('myChart').getContext('2d');
            var chart = new Chart(ctx, {
                type: 'radar',
                data: {
                    labels: [0,2,4,6,8,10,12,14,16,18,20,22],
                    datasets: [{
                        label: 'Температура в течении дня (°C)',
                        borderColor: '#CC1B41',
                        data: currenttemp
                    }]
                    },
                    options: {
                        layout: {
                            padding: {
                            left: 5,
                            right: 15,
                            top: 0,
                            bottom: 5
                        }
                    }
                }
            });
        }
        if (type == 'feeltemp') {
            document.querySelector('.' + position + 'block').innerHTML = `
                <div class="title">Температурный график (по ощущениям)</div>
                <canvas id="myChart"></canvas>
            `;
            var ctx = document.getElementById('myChart').getContext('2d');
            var chart = new Chart(ctx, {
                type: 'radar',
                data: {
                    labels: [0,2,4,6,8,10,12,14,16,18,20,22],
                    datasets: [{
                        label: 'Температура по ощущениям (°C)',
                        borderColor: '#13926B',
                        data: currentfeeltemp
                    }]
                    },
                    options: {
                        layout: {
                            padding: {
                            left: 5,
                            right: 15,
                            top: 0,
                            bottom: 5
                        }
                    }
                }
            });
        }
        if (type == 'hum') {
            document.querySelector('.' + position + 'block').innerHTML = `
                <div class="title">График влажности</div>
                <canvas id="myChart"></canvas>
            `;
            var ctx = document.getElementById('myChart').getContext('2d');
            var chart = new Chart(ctx, {
                type: 'radar',
                data: {
                    labels: [0,2,4,6,8,10,12,14,16,18,20,22],
                    datasets: [{
                        label: 'Влажность в течении дня (%)',
                        borderColor: '#CC1B41',
                        data: currenthum
                    }]
                    },
                    options: {
                        layout: {
                            padding: {
                            left: 5,
                            right: 15,
                            top: 0,
                            bottom: 5
                        }
                    }
                }
            });
        }
        if (type == 'pres') {
            document.querySelector('.' + position + 'block').innerHTML = `
                <div class="title">График атмосферного давления</div>
                <canvas id="myChart"></canvas>
            `;
        var ctx = document.getElementById('myChart').getContext('2d');
        var chart = new Chart(ctx, {
            type: 'radar',
            data: {
                labels: [0,2,4,6,8,10,12,14,16,18,20,22],
                datasets: [{
                    label: 'Атмосферное давление (мм рт. ст.)',
                    borderColor: '#13926B',
                    data: currentpres
                }]
                },
                options: {
                    layout: {
                        padding: {
                        left: 5,
                        right: 15,
                        top: 0,
                        bottom: 5
                    }
                }
            }
        });
        }
    }
}
    /* Weather tab forecast temp charts OWM API */
function forecastinfo(day = 0) {
    document.querySelector('.detail').innerHTML = '';
    var url = "https://api.openweathermap.org/data/2.5/onecall";
    if (globallat & globallon) {
        if (!fetchforecasttemp) {
            fetch(url+`?lat=${globallon}&lon=${globallat}&exclude=current,minutely,hourly,alerts&appid=${token}&lang=RU&units=metric`)
                .then(function(value){
                    if(value.status !== 200){
                        return Promise.reject(new Error('Ошибка'));
                    }
                    return value.json();
                })
                .then(function(output){
                    fetchforecasttemp = output;
                    forecasttemp = [];
                    forecastfeeltemp = [];
                    forecasttemp.push(output.daily[day].temp.day);
                    forecasttemp.push(output.daily[day].temp.eve);
                    forecasttemp.push(output.daily[day].temp.night);
                    forecastfeeltemp.push(output.daily[day].feels_like.day);
                    forecastfeeltemp.push(output.daily[day].feels_like.eve);
                    forecastfeeltemp.push(output.daily[day].feels_like.night);
                });
        }
        else {
            forecasttemp = [];
            forecastfeeltemp = [];
            forecasttemp.push(fetchforecasttemp.daily[day].temp.day);
            forecasttemp.push(fetchforecasttemp.daily[day].temp.eve);
            forecasttemp.push(fetchforecasttemp.daily[day].temp.night);
            forecastfeeltemp.push(fetchforecasttemp.daily[day].feels_like.day);
            forecastfeeltemp.push(fetchforecasttemp.daily[day].feels_like.eve);
            forecastfeeltemp.push(fetchforecasttemp.daily[day].feels_like.night);
        }
    }
    var key = [' на сегодня', ' на завтра', ' на послезавтра', ' через 3 дня', ' через 4 дня', ' через 5 дней', ' через 6 дней'];
    if (forecasttemp.length > 0) {
        document.querySelector('.detail').innerHTML = `
            <div class="title">Прогноз погоды${key[day]}</div>
            <canvas style="margin-bottom: 50px;" id="myChart"></canvas>
        `;
        var ctx = document.getElementById('myChart').getContext('2d');
        var chart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['День', 'Вечер', 'Ночь'],
                datasets: [{
                    label: 'Температура (°C)',
                    borderColor: '#13926B',
                    backgroundColor: '#13926B',
                    data: forecasttemp
                },{
                    label: 'Температура (по ощущениям) (°C)',
                    borderColor: '#CC1B41',
                    backgroundColor: '#CC1B41',
                    data: forecastfeeltemp
                }]
            },
            options: {
                layout: {
                    padding: {
                        left: 5,
                        right: 15,
                        top: 5,
                        bottom: 5
                    }
                }
            }
        });
        function intoview() {
            document.querySelector('.detail').scrollIntoView({block: "center", inline: "center", behavior: "smooth"});
        }
        setTimeout(intoview, 250);
    }
}
    /* Stat tab charts OWM API */
function showstat(type) {
    event.preventDefault();
    selectedchart = type;
    var url = "https://api.openweathermap.org/data/2.5/onecall";
    if (globallat & globallon) {
        if (!fetchstat) {
            fetch(url+`?lat=${globallon}&lon=${globallat}&exclude=current,minutely,hourly,alerts&appid=${token}&lang=RU&units=metric`)
                .then(function(value){
                    if(value.status !== 200){
                        return Promise.reject(new Error('Ошибка'));
                    }
                    return value.json();
                })
                .then(function(output){
                    fetchstat = output;
                    if (type == 'temp') {
                        temp = [];
                        tempday = [];
                        tempnight = [];
                        output.daily.forEach(function(e){
                            temp.push(e.dew_point);
                            tempday.push(e.temp.day);
                            tempnight.push(e.temp.night);
                        });
                        document.querySelector('.content').innerHTML =`
                            <div class="title">Температурный график на следующие 7 дней</div>
                        `;
                        inner = `
                            <form>
                                <button onclick="showstat('temp')">Температура</button>
                                <button onclick="showstat('humidity')">Влажность</button>
                                <button onclick="showstat('pressure')">Давление</button>
                            </form>
                            <canvas id="myChart"></canvas>
                        `;
                        document.querySelector('.content').innerHTML += inner;
                        var ctx = document.getElementById('myChart').getContext('2d');
                        var chart = new Chart(ctx, {
                            type: 'bar',
                            data: {
                                labels: [0, 1, 2, 3, 4, 5, 6, 7],
                                datasets: [{
                                    label: 'Средн. (°C)',
                                    borderColor: '#13926B',
                                    backgroundColor: '#13926B',
                                    data: temp
                                },
                                {
                                    label: 'День (°C)',
                                    borderColor: '#CC1B41',
                                    backgroundColor: '#CC1B41',
                                    data: tempday
                                },
                                {
                                    label: 'Ночь (°C)',
                                    borderColor: '#8F5B09',
                                    backgroundColor: '#8F5B09',
                                    data: tempnight
                                }]
                            },
                            options: {
                                layout: {
                                    padding: {
                                        left: 5,
                                        right: 15,
                                        top: 5,
                                        bottom: 5
                                    }
                                }
                            }
                        });
                    }
                    if (type == 'humidity') {
                        output.daily.forEach(function(e){
                            humidity.push(e.humidity);
                        });
                        document.querySelector('.content').innerHTML =`
                            <div class="title">График влажности на следующие 7 дней</div>
                        `;
                        inner = `
                            <form>
                                <button onclick="showstat('temp')">Температура</button>
                                <button onclick="showstat('humidity')">Влажность</button>
                                <button onclick="showstat('pressure')">Давление</button>
                            </form>
                            <canvas id="myChart"></canvas>
                        `;
                        document.querySelector('.content').innerHTML += inner;
                        var ctx = document.getElementById('myChart').getContext('2d');
                        var chart = new Chart(ctx, {
                            type: 'line',
                            data: {
                                labels: [0, 1, 2, 3, 4, 5, 6, 7],
                                datasets: [{
                                    label: 'График влажности (%)',
                                    borderColor: '#13926B',
                                    backgroundColor: '#13926B',
                                    data: humidity
                                }]
                            },
                            options: {
                                layout: {
                                    padding: {
                                        left: 5,
                                        right: 15,
                                        top: 5,
                                        bottom: 5
                                    }
                                }
                            }
                        });
                    }
                    if (type == 'pressure') {
                        output.daily.forEach(function(e){
                            pressure.push(e.pressure);
                        });
                        document.querySelector('.content').innerHTML =`
                            <div class="title">График атм. давления на следующие 7 дней</div>
                        `;
                        inner = `
                            <form>
                                <button onclick="showstat('temp')">Температура</button>
                                <button onclick="showstat('humidity')">Влажность</button>
                                <button onclick="showstat('pressure')">Давление</button>
                            </form>
                            <canvas id="myChart"></canvas>
                        `;
                        document.querySelector('.content').innerHTML += inner;
                        var ctx = document.getElementById('myChart').getContext('2d');
                        var chart = new Chart(ctx, {
                            type: 'line',
                            data: {
                                labels: [0, 1, 2, 3, 4, 5, 6, 7],
                                datasets: [{
                                    label: 'График давления (мм рт. ст.)',
                                    borderColor: '#CC1B41',
                                    backgroundColor: '#CC1B41',
                                    data: pressure
                                }]
                            },
                            options: {
                                layout: {
                                    padding: {
                                        left: 5,
                                        right: 15,
                                        top: 5,
                                        bottom: 5
                                    }
                                }
                            }
                        });
                    }
                });
        }
        else {
            if (type == 'temp') {
                temp = [];
                tempday = [];
                tempnight = [];
                fetchstat.daily.forEach(function(e){
                    temp.push(e.dew_point);
                    tempday.push(e.temp.day);
                    tempnight.push(e.temp.night);
                });
                document.querySelector('.content').innerHTML =`
                    <div class="title">Температурный график на следующие 7 дней</div>
                `;
                inner = `
                    <form>
                        <button onclick="showstat('temp')">Температура</button>
                        <button onclick="showstat('humidity')">Влажность</button>
                        <button onclick="showstat('pressure')">Давление</button>
                    </form>
                    <canvas id="myChart"></canvas>
                `;
                document.querySelector('.content').innerHTML += inner;
                var ctx = document.getElementById('myChart').getContext('2d');
                var chart = new Chart(ctx, {
                    type: 'bar',
                    data: {
                        labels: [0, 1, 2, 3, 4, 5, 6, 7],
                        datasets: [{
                            label: 'Средн. (°C)',
                            borderColor: '#13926B',
                            backgroundColor: '#13926B',
                            data: temp
                        },
                        {
                            label: 'День (°C)',
                            borderColor: '#CC1B41',
                            backgroundColor: '#CC1B41',
                            data: tempday
                        },
                        {
                            label: 'Ночь (°C)',
                            borderColor: '#8F5B09',
                            backgroundColor: '#8F5B09',
                            data: tempnight
                        }]
                    },
                    options: {
                        layout: {
                            padding: {
                                left: 5,
                                right: 15,
                                top: 5,
                                bottom: 5
                            }
                        }
                    }
                });
            }
            if (type == 'humidity') {
                fetchstat.daily.forEach(function(e){
                    humidity.push(e.humidity);
                });
                document.querySelector('.content').innerHTML =`
                    <div class="title">График влажности на следующие 7 дней</div>
                `;
                inner = `
                    <form>
                        <button onclick="showstat('temp')">Температура</button>
                        <button onclick="showstat('humidity')">Влажность</button>
                        <button onclick="showstat('pressure')">Давление</button>
                    </form>
                    <canvas id="myChart"></canvas>
                `;
                document.querySelector('.content').innerHTML += inner;
                var ctx = document.getElementById('myChart').getContext('2d');
                var chart = new Chart(ctx, {
                    type: 'line',
                    data: {
                        labels: [0, 1, 2, 3, 4, 5, 6, 7],
                        datasets: [{
                            label: 'График влажности (%)',
                            borderColor: '#13926B',
                            backgroundColor: '#13926B',
                            data: humidity
                        }]
                    },
                    options: {
                        layout: {
                            padding: {
                                left: 5,
                                right: 15,
                                top: 5,
                                bottom: 5
                            }
                        }
                    }
                });
            }
            if (type == 'pressure') {
                fetchstat.daily.forEach(function(e){
                    pressure.push(e.pressure);
                });
                document.querySelector('.content').innerHTML =`
                    <div class="title">График атм. давления на следующие 7 дней</div>
                `;
                inner = `
                    <form>
                        <button onclick="showstat('temp')">Температура</button>
                        <button onclick="showstat('humidity')">Влажность</button>
                        <button onclick="showstat('pressure')">Давление</button>
                    </form>
                    <canvas id="myChart"></canvas>
                `;
                document.querySelector('.content').innerHTML += inner;
                var ctx = document.getElementById('myChart').getContext('2d');
                var chart = new Chart(ctx, {
                    type: 'line',
                    data: {
                        labels: [0, 1, 2, 3, 4, 5, 6, 7],
                        datasets: [{
                            label: 'График давления (мм рт. ст.)',
                            borderColor: '#CC1B41',
                            backgroundColor: '#CC1B41',
                            data: pressure
                        }]
                    },
                    options: {
                        layout: {
                            padding: {
                                left: 5,
                                right: 15,
                                top: 5,
                                bottom: 5
                            }
                        }
                    }
                });
            }
        }
    }
}