import fs from 'fs'
import path from 'path'

const DATA_DIR = path.join(process.cwd(), 'data') // cwd gets the current working directory and joins it with 'data' folder so tests can access data files
const JSON_FILE = path.join(DATA_DIR, 'weather.json') // path to the weather data file so tests can read it
const CSV_FILE = path.join(DATA_DIR, 'weather_log.csv') // path to the log file " " " "

describe('Weather Data Tests', () => {
    test('weather.json file exists', () => {
        expect(fs.existsSync(JSON_FILE)).toBe(true) // checks if weather.json file exists so that the fetchWeather function is working 
    })

    test('weather.json has required keys', () => {
        const raw = fs.readFileSync(JSON_FILE, 'utf8') // reads the weather.json file
        expect(raw.trim().length).toBeGreaterThan(0) // checks that the file is not empty

        const data = JSON.parse(raw) // converts the raw data to javascript object
        expect(data).toHaveProperty('main') // checks that the data has a 'name' property
        expect(data).toHaveProperty('weather')
        expect(data.weather[0]).toHaveProperty('description')
        expect(data).toHaveProperty('main.temp')

        expect(new Date(data._last_updated_utc).toISOString()).toBe(data._last_updated_utc) // checks the value of _last_updated_utc is a valid ISO date string
    })
    test('CSV log exists and has header', () => {
        expect(fs.existsSync(CSV_FILE)).toBe(true) // checks if weather_log.csv file exists

        const csvContent = fs.readFileSync(CSV_FILE, 'utf8') // reads the weather_log.csv file
        const lines = csvContent.trim().split('\n') // trim whitespace and splits into lines
        const header = lines[0].split(',') // splits the first line (header) by commas;

        expect(header).toEqual(['timestamp', 'city', 'temperature', 'description']) // checks that the header matches expected columns
        expect(lines.length).toBeGreaterThan(1) // checks that there is at least one data entry in the log

        const firstDataRow = lines[1].split(',') // splits the first data row by commas
        expect(!isNaN(parseFloat(firstDataRow[2]))).toBe(true) // checks that the temperature value is a valid number
    })
})
