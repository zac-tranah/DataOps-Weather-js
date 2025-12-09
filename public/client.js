async function loadWeather() {
    try {
        const response = await fetch('/api/weather')
        const weather = await response.json()

        document.getElementById('weather').innerHTML = `
            <h2> ${weather.name} Weather</h2>
            <p> Temperature: ${weather.main.temp} °C</p>
            <p> Condition: ${weather.weather[0].description}</p>
         `

    } catch (err) {
        document.getElementById('weather').innerHTML = '<p>Error loading weather data.</p>'
        console.log(err)
    }
}

async function loadChart() {
    try {
        const res = await fetch('/api/weather-log')
        const { timestamps, temps } = await res.json()

        const trace = {
            x: timestamps,
            y: temps,
            type: 'scatter',
            mode: 'lines+markers',
            line: { 
                color: 'gold' 
            }
        }

        const layout = {
            title: 'Temperature Over Time',
            xaxis: { title: 'Time', type: 'date' },
            yaxis: { title: 'Temperature (°C)' },
            legend: { orientation: 'h', x:0, y: 1.1}
        }

        Plotly.newPlot('chart', [trace], layout)
    }
    catch (err) {
        console.log('Failed to load chart', err)
    }
}

loadWeather()
loadChart()