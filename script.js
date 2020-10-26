const BASE_URL = `https://api.covid19api.com`;
let myChart = null
function getData() {
    const countrySlug = $("#search-by-country").val();
    fetch(`${BASE_URL}/country/${countrySlug}`)
        .then(response => {
            if (response.ok) {
                return response.json()
            }
            return response.json().then(e => Promise.reject(e))
        })
        .then(responseJson => {
            displayResults(responseJson, countrySlug)
        }).catch(error => console.log(error));
}

function displayResults(data, country) {
    // console.log(data)
    if (myChart) {
        myChart.destroy()
    }

    data = data.map(item => {
        return { t: new Date(item.Date), y: item['Deaths'] }
    })

    var ctx = $('#myChart');
    const color = Chart.helpers.color;
    myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            datasets: [{
                label: country,
                // label: `${title} Covid ${type === 'confirmed'? 'Infected': type}`,
                backgroundColor: color('red').alpha(0.5).rgbString(),
                data: data,
                type: 'bar',
                pointRadius: 0,
                fill: false,
                lineTension: 0,
                borderWidth: 2
            }]
        },
        options: {
            responsive: false,
            scales: {
                xAxes: [{
                    type: 'time',
                    time: {
                        unit: 'day'
                    }
                }]
            }
        }
    });
   


}




function watchForm() {
    $('.search-form').submit(event => {
        event.preventDefault();
        getData()
    });
}

function showCountriesInDropdown(countries) {
    let options = ``
    countries.forEach((country) => {
        options += `<option value="${country.Slug}">${country.Country}</option>`
    })
    $('#search-by-country').html(options);
}

function getGlobalSummary() {
    fetch(`${BASE_URL}/summary`)
        .then(response => response.json())
        .then(responseJson => {
            // console.log(responseJson)
            showCountriesInDropdown(responseJson.Countries)
            $("#today-confirmed").text(responseJson.Global.NewConfirmed)
            $("#today-recovered").text(responseJson.Global.NewRecovered)
            $("#today-death").text(responseJson.Global.NewDeaths)
            $("#total-confirmed").text(responseJson.Global.TotalConfirmed)
            $("#total-death").text(responseJson.Global.TotalConfirmed)
            $("#total-recovered").text(responseJson.Global.TotalRecovered)
        }).catch(error => alert('Something went wrong. Try again later global summary.'));
}

$(() => {
    watchForm();
    getGlobalSummary();
});