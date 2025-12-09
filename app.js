import express from 'express';
import fs from 'fs'
import path from 'path'
import csv from 'csv-parser'
import dotenv from 'dotenv'

dotenv.config() // loads environment variables from .env file

const app = express()

const PORT = process.env.PORT || 5001 // retrieves the port from environment variables or defaults to 5001

const DATA_DIR = path.join(import.meta.dirname, 'data') // creates path to the data directory
const WEATHER_FILE = path.join(DATA_DIR, 'weather.json') // path to the weather data file
const LOG_FILE = path.join(DATA_DIR, 'weather_log.csv') // path to the log file

app.use(express.static(path.join(import.meta.dirname, 'public'))) // serves static files from the public directory

app.get('/api/weather', (req, res) => {
    if (!fs.existsSync(WEATHER_FILE)) { // checks if weather.json file exists
        return res.status(404).json({ error: 'Weather data not found' })
    }

    try {
        const weatherData = JSON.parse(fs.readFileSync(WEATHER_FILE, 'utf8')) // reads and parses the weather data file
        res.json(weatherData) // sends the weather data as JSON response to the client
    } catch (error) {
        console.log('Error reading weather.json:', error)
        res.status(500).json({ error: 'Internal server error' })
    }
})

app.get('/api/weather-log', (req, res) => {
    if (!fs.existsSync(LOG_FILE)) {
        return res.status(404).json({ error: 'Weather log not found' })
    }

    const timestamps = []
    const temps = []

    fs.createReadStream(LOG_FILE)
        .pipe(csv())
        .on('data', (row) => {
            if (row.timestamp && row.temperature) {
                timestamps.push(row.timestamp) 
                temps.push(parseFloat(row.temperature)) 
            }
        })
        .on('end', () => res.json({timestamps, temps})) // sends the timestamps and temperatures as JSON response to the client to plot
        .on('error', (error) => {
            console.log('Error reading weather_log.csv:', error)
            res.status(500).json({ error: 'Internal server error' })
        })
})

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
