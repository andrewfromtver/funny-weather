/* Service functions */
    /* Device screen width check */
function devCheck() {
    if (document.documentElement.clientWidth < 900) {
        document.querySelectorAll(".item_text").forEach(e => {e.style = "display: none;"});
        document.querySelectorAll(".navitem").forEach(e => {e.style = ""});
        document.querySelector(".navitems").style = "justify-content: space-around;";
        if (document.querySelectorAll('.meteoinfo')) {
            document.querySelectorAll('.meteoinfo').forEach(function(elem) {
                elem.style.width = '96vw';
            })
        }
        document.querySelector(".navbar").style.bottom = '0';
        document.querySelector(".navbar").style.top = '';
        document.querySelector(".container").style.margin = '20px auto 10px auto';
    }
    else {
        document.querySelectorAll(".item_text").forEach(e => {e.style = "display: flex;"});
        document.querySelectorAll(".navitem").forEach(e => {e.style = "width: 200px;"});
        document.querySelector(".navitems").style = "justify-content: space-between;";
        if (document.querySelectorAll('.meteoinfo')) {
            document.querySelectorAll('.meteoinfo').forEach(function(elem) {
                elem.style.width = '420px';
            })
        }
        document.querySelector(".navbar").style.bottom = '';
        document.querySelector(".navbar").style.top = '0';
        document.querySelector(".container").style.margin = '50px auto 10px auto';
    }
    activeitem(activetab);
}
window.addEventListener("resize", function() {devCheck();});
    /* UI */
function hidepopup(geo = 'on') {
    if (geo == 'on') {
        allowgeo();
    }
    document.querySelector('.popup_placeholder').style.display = 'none';
    document.querySelector('.navbar').style.display = '';
    document.querySelector('.container').style.display = '';
    document.querySelector('.content').style.display = '';
    document.querySelector('.detail').style.margin = '0 auto 60px auto';
}
function activeitem(name = 'weather') {
    if (name == 'weather') {
        document.querySelector('#weather').style.backgroundColor = '#FFE474';
        document.querySelector('#friends').style.backgroundColor = '#FFF';
        document.querySelector('#alarms').style.backgroundColor = '#FFF';
        document.querySelector('#stat').style.backgroundColor = '#FFF';

    }
    if (name == 'friends') {
        document.querySelector('#weather').style.backgroundColor = '#FFF';
        document.querySelector('#friends').style.backgroundColor = '#FFE474';
        document.querySelector('#alarms').style.backgroundColor = '#FFF';
        document.querySelector('#stat').style.backgroundColor = '#FFF';
    }
    if (name == 'alarms') {
        document.querySelector('#weather').style.backgroundColor = '#FFF';
        document.querySelector('#friends').style.backgroundColor = '#FFF';
        document.querySelector('#alarms').style.backgroundColor = '#FFE474';
        document.querySelector('#stat').style.backgroundColor = '#FFF';
    }
    if (name == 'stat') {
        document.querySelector('#weather').style.backgroundColor = '#FFF';
        document.querySelector('#friends').style.backgroundColor = '#FFF';
        document.querySelector('#alarms').style.backgroundColor = '#FFF';
        document.querySelector('#stat').style.backgroundColor = '#FFE474';
    }
    activetab = name;
}
    /* Geolocation */
function allowgeo() {
    var options = {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
    };
    function success(pos) {
        var crd = pos.coords;
        globallon = crd.latitude;
        globallat = crd.longitude;
        globalplace = 'По моим координатам';
    }
    function error(err) {
        console.warn(`ERROR(${err.code}): ${err.message}`);
        document.querySelector('.detail').style.margin = '';
        document.querySelector('.popup_placeholder').style.display = '';
        document.querySelector('.navbar').style.display = 'none';
        document.querySelector('.container').style.display = 'none';
        document.querySelector('.content').style.display = 'none';
        inner = `
            <div class="popup">
                <h1>Упс, что-то пошло не так...</h1>
                <p>Похоже вы запретили браузеру использовать данные о вашей геопозиции, или у вашего устройства нет GPS</p>
                <p>Вы можете ввести название населенного пункта вручную, используя форму ввода</p>
                <button onclick="hidepopup('off')">OK</button>
            </div>
        `;
        document.querySelector('.popup_placeholder').innerHTML = inner;
    }
    navigator.geolocation.getCurrentPosition(success, error, options);
}
function writegeoloc(elem) {
    fetchweatherdata = null;
    fetchaddinfodata = null;
    fetchforecastdata = null;
    fetchsecondforecastdata = null;
    fetchforecasttemp = null;

    fetchstat = null;
    
    globallat = elem.id.split(',')[0];
    globallon = elem.id.split(',')[1];
    globalplace = elem.innerText;
    if (globallat & globallon) {
        weather(globallat, globallon, globalplace);
    }
}
function bygeoloc(type) {
    allowgeo();
    if (type =='friends') {
        friends(globallat, globallon, globalplace);
    }
    if (type =='weather') {
        fetchweatherdata = null;
        fetchaddinfodata = null;
        fetchforecastdata = null;
        fetchsecondforecastdata = null;
        fetchforecasttemp = null;

        weather(globallat, globallon, globalplace);
    }
    if (type =='stat') {
        fetchstat = null;

        statinfo(globallat, globallon, globalplace);
    }
}


/* In tab functions */
function statinfo(lat, lon, place = '') {
    event.preventDefault();
    fetchstat = null;
    document.querySelector('.container').innerHTML = `
        <div class="title">FUNNY WEATHER / Статистика</div>
        <form>
            <input class="input" type="text" placeholder="Введите название населенного пункта" maxlength="30" oninput="query(this.value, 'stat')">
            <button onclick="bygeoloc('stat')">Найти по GPS</button>
            <div class="suggestions"></div>
            <div class="geoloc"></div>
        </form>
    `;
    if ( lat & lon){
        globallat = lat;
        globallon = lon;
    }
    if (place) {
        document.querySelector('.input').value = place;
        if (document.documentElement.clientWidth > 900) {
            document.querySelector('.title').innerText += ` / ${place}`;
        }
        globalplace = place;
    }
    document.querySelector('.suggestions').style.display = 'none';
    devCheck();
    activeitem('stat');
    if (selectedchart != '') {
        showstat(selectedchart);
    }
}
function showstreem(type = null) {
    selectedstreem = type;
    event.preventDefault();
    document.querySelector('.container').innerHTML = `
        <div class="title">FUNNY WEATHER / Трансляции</div>
        <form>
            <button onclick="showstreem('earth')">NASA live stream</button>
            <button onclick="showstreem('warn')">4K Nature</button>
            <button onclick="showstreem('all')">Tropical House Radio</button>
        </form>
    `;
    if (type == 'earth') {
        document.querySelector('.content').innerHTML = `
            <iframe width="100%" height="65%" src="https://www.youtube-nocookie.com/embed/21X5lGlDOfg?controls=0" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen style="border-radius: 3px;"></iframe>
        `;
        if (document.documentElement.clientWidth > 900) {
            document.querySelector('.title').innerText += ` / NASA live stream`;
        }
    }
    if (type == 'warn') {
        document.querySelector('.content').innerHTML = `
            <iframe width="100%" height="65%" src="https://www.youtube-nocookie.com/embed/P7d1H83IcjE?controls=0" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen style="border-radius: 3px;"></iframe>
        `;
        if (document.documentElement.clientWidth > 900) {
            document.querySelector('.title').innerText += ` / 4K Nature`;
        }
    }
    if (type == 'all') {
        document.querySelector('.content').innerHTML = `
            <iframe width="100%" height="65%" src="https://www.youtube-nocookie.com/embed/Edk0TfK94pA?controls=0" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen style="border-radius: 3px;"></iframe>
        `;
        if (document.documentElement.clientWidth > 900) {
            document.querySelector('.title').innerText += ` / Tropical House Radio`;
        }
    }
}


/* Init */
window.onload = function() {
    document.querySelector('.navbar').style.display = 'none';
    document.querySelector('.container').style.display = 'none';
    document.querySelector('.content').style.display = 'none';
    weather(null, null);
};