import fs from 'fs' // filesystem module to handle file operations
import path from 'path' // path module to handle file paths
import dotenv from 'dotenv' // dotenv module to load environment variables

dotenv.config() // loads environment variables from .env file

const DATA_DIR = path.join(import.meta.dirname, 'data') // creates a folder and path to the data directory so saves are organized
if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR) // creates the data directory if it doesn't exist
}

const WEATHER_FILE = path.join(DATA_DIR, 'weather.json') // path to the weather data file
const LOG_FILE = path.join(DATA_DIR, 'weather_log.csv') // path to the log file

export async function fetchWeather() {
    const apiKey = process.env.WEATHER_API_KEY // retrieves the API key from environment variables
    const city = process.env.CITY || 'London' // retrieves the city from environment variables or defaults to London
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric` 

    try {
        const response = await fetch(url) // fetches weather data from the API
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
    }

        const data = await response.json() // parses the JSON response
        const nowUTC = new Date().toISOString() // gets the current UTC time in ISO format;
        data._last_updated_utc = nowUTC // adds a timestamp to the data
        fs.writeFileSync(WEATHER_FILE, JSON.stringify(data, null, 2)) // saves the weather data to a JSON file.

    const header = 'timestamp,city,temperature,description\n' // CSV header for the log file
    if (!fs.existsSync(LOG_FILE)) {
        fs.writeFileSync(LOG_FILE, header) // creates the log file with header if it doesn't exist
    } else {
        const firstLine = fs.readFileSync(LOG_FILE, 'utf8').split('\n')[0]
        if (firstLine !== 'timestamp,city,temperature,description') {
            fs.writeFileSync(LOG_FILE, header + fs.readFileSync(LOG_FILE, 'utf8')) // ensures the header is correct 
        }
    }

    const logEntry = `${nowUTC},${city},${data.main.temp},${data.weather[0].description}\n` // creates a log entry
    fs.appendFileSync(LOG_FILE, logEntry) // appends the log entry to the log file

    console.log(`Weather data updated for ${city} at ${nowUTC}`) // logs a success message
    } catch (error) {
        console.error('Error fetching weather data:', error) // logs any errors that occur during the fetch
    }
}

 if (import.meta.url === `file://${process.argv[1]}`) {
        fetchWeather() // calls the function if the script is run directly
    }

fetchWeather()
