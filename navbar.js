/* Navbar functions */
function weather(lat, lon, place = null) {
    event.preventDefault();
    document.querySelector('.detail').innerHTML = '';
    document.querySelector('.container').innerHTML = `
        <div class="title">FUNNY WEATHER / Прогноз погоды</div>
        <form>
            <input class="input" type="text" placeholder="Введите название населенного пункта" maxlength="30" oninput="query(this.value, 'weather')">
            <button onclick="bygeoloc('weather')">Погода по GPS</button>
            <div class="suggestions"></div>
            <div class="geoloc"></div>
        </form>
    `;
    document.querySelector('.content').innerHTML = `
        <div class="weatherinfo"></div>
        <form>
            <button onclick="weather(null, null)">Прогноз на сегодня</button>
            <button onclick="forecast(2)">Прогноз на 2 дня</button>
            <button onclick="forecast(6)">Прогноз на 6 дней</button>
        </form>
    `;
    if (place) {
        document.querySelector('.input').value = place;
        if (document.documentElement.clientWidth > 900) {
            document.querySelector('.title').innerText += ` / ${place}`;
        }
        weatherplace = place;
    }
    if (lat && lon) {
        weatherrequest (lat, lon, 'json');
    }
    if (lat == null || lon == null) {
        document.querySelector('.content').innerHTML = `
            <div class="nodata">
                <div class="title">Введите название населенного пункта, или определите свои координаты по GPS, чтобы увидеть метеорологическую сводку</div>
                <img src="./img/nodata.png" alt="nodata">
            </div>
        `;
        if (weathertab.length > 1) {
            document.querySelector('.content').innerHTML = weathertab;
            document.querySelector('.input').value = weatherplace;
            if (document.documentElement.clientWidth > 900) {
                document.querySelector('.title').innerText += ` / ${weatherplace}`;
            }
        }
    }
    document.querySelector('.suggestions').style.display = 'none';
    devCheck();
    activeitem('weather');
    addinfo();
}
function friends(lat, lon, place = null, json = []) {
    event.preventDefault();
    document.querySelector('.detail').innerHTML = '';
    document.querySelector('.content').innerHTML = '';
    document.querySelector('.container').innerHTML = `
        <div class="title">FUNNY WEATHER / Друзья на карте</div>
        <form>
            <input class="input" type="text" placeholder="Введите название населенного пункта" maxlength="30" oninput="query(this.value, 'friends')">
            <button onclick="bygeoloc('friends')">Найти по GPS</button>
            <div class="suggestions"></div>
            <div class="geoloc"></div>
        </form>
    `;
    if (place) {
        document.querySelector('.input').value = place;
        if (document.documentElement.clientWidth > 900) {
            document.querySelector('.title').innerText += ` / ${place}`;
        }
        friendsplace = place;
    }
    jsonparse = `marker=${lon},${lat}`;
    document.querySelector('.content').innerHTML = `
                <iframe 
                    width="100%"
                    height="65%"
                    frameborder="0"
                    scrolling="no"
                    marginheight="0"
                    marginwidth="0"
                    src="https://www.openstreetmap.org/export/embed.html?bbox=${Number(lat) - 0.015},${Number(lon) - 0.015},${Number(lat) + 0.015},${Number(lon) + 0.015}&amp;layer=mapquest&amp;${jsonparse}">
                </iframe>
    `;
    if (lat == null || lon == null) {
        document.querySelector('.content').innerHTML = `
            <div class="nodata">
                <div class="title">Введите название населенного пункта, или определите свои координаты по GPS, чтобы определить зону поиска друзей</div>
                <img src="./img/nomap.gif" alt="nomap">
            </div>
        `;
    }
    document.querySelector('.suggestions').style.display = 'none';
    devCheck();
    activeitem('friends');
    friendstab = document.querySelector('.content').innerHTML;
}
function streems() {
    event.preventDefault();
    document.querySelector('.detail').innerHTML = '';
    document.querySelector('.content').innerHTML = '';
    document.querySelector('.container').innerHTML = `
        <div class="title">FUNNY WEATHER / Трансляции</div>
        <form>
            <button onclick="showstreem('earth')">NASA live stream</button>
            <button onclick="showstreem('warn')">4K Nature</button>
            <button onclick="showstreem('all')">Tropical House Radio</button>
        </form>
    `;
    document.querySelector('.content').innerHTML = `
        <div class="nodata">
            <div class="title">Выберите трянсляцию для того, чтобы посмотреть её</div>
            <img src="./img/nodata.png" alt="nodata">
        </div>
    `;
    devCheck();
    activeitem('alarms');
    if (selectedstreem != '') {
        showstreem(selectedstreem);
    }
}
function stat() {
    event.preventDefault();
    document.querySelector('.detail').innerHTML = '';
    document.querySelector('.content').innerHTML = '';
    document.querySelector('.container').innerHTML = `
        <div class="title">FUNNY WEATHER / Статистика</div>
        <form>
            <input class="input" type="text" placeholder="Введите название населенного пункта" maxlength="30" oninput="query(this.value, 'stat')">
            <button onclick="bygeoloc('stat')">Найти по GPS</button>
            <div class="suggestions"></div>
            <div class="geoloc"></div>
        </form>
    `;
    if (globalplace) {
        document.querySelector('.input').value = globalplace;
        if (document.documentElement.clientWidth > 900) {
            document.querySelector('.title').innerText += ` / ${globalplace}`;
        }
        statplace = globalplace;
    }
    else if (globalplace) {
        document.querySelector('.title').innerText += ` / ${globalplace}`;
    }
    document.querySelector('.content').innerHTML = `
        <div class="nodata">
            <div class="title">Укажите, какие параметры вы хотете отобразить на графиках</div>
            <img src="./img/nodata.png" alt="nodata">
        </div>
        <form>
            <button onclick="showstat('temp')">Температура</button>
            <button onclick="showstat('humidity')">Влажность</button>
            <button onclick="showstat('pressure')">Давление</button>
        </form>
    `;
    document.querySelector('.suggestions').style.display = 'none';
    devCheck();
    activeitem('stat');
    if (selectedchart != '') {
        showstat(selectedchart);
    }
}