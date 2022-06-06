import Papa from "papaparse"
import fs from "node:fs"

/**
 * It reads a csv file, parses it into a json object, and writes the json object to a file
 * @param filePath - the path to the csv file
 * @param jsonFilePath - The path to the file you want to write the JSON to.
 * @returns A promise that resolves to the data parsed from the csv file.
 */
export default function parseCsvToJson(filePath, jsonFilePath) {
  return new Promise((resolve, reject) => {
    console.time("test")
    fs.readFile(filePath, "utf8", (err, data) => {
      if (err) {
        reject(err)
      } else {
        const json = {}
        Papa.parse(data, {
          header: false,
          step(row) {
            const date = row.data[1]
            const hour = row.data[2]
            const level = row.data[3]
            const volume = row.data[4]
            const area = row.data[5]
            const ID_SWOT = row.data[6]
            const makeObj = () => {
              const data = {
                date,
                hour,
                level,
                volume,
                area,
                ID_SWOT,
              }
              return data
            }
            /* Checking if the key exists in the json object. If it does not exist, it creates the key
            and sets it to an array with the data. If it does exist, it checks if the date is
            unique. If it is unique, it pushes the data to the array. */
            if (!json[row.data[0]]) {
              const data = makeObj()
              json[row.data[0]] = [data]
            } else {
              const isUnique = json[row.data[0]].every(
                item => item.date !== date
              )
              if (isUnique) {
                const data = makeObj()
                json[row.data[0]].push(data)
              }
            }
          },
          complete: results => {
            console.log("complete")
            const jsonBuffer = Buffer.from(JSON.stringify(json))
            fs.writeFile(jsonFilePath, jsonBuffer, err => {
              if (err) {
                reject(err)
              } else {
                resolve(results.data)
                console.timeEnd("test")
              }
            })
          },
        })
      }
    })
  })
}

parseCsvToJson(
  "./data/csv/andalousie_ZSV_timeseries.csv",
  "./data/json/andalousie_ZSV_timeseries.json"
)
