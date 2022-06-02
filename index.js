import Papa from "papaparse"
import fs from "node:fs"

// parse cvs to json file and save it to disk
export default function parseCsvToJson(filePath, jsonFilePath) {
  return new Promise((resolve, reject) => {
    console.time("test")
    fs.readFile(filePath, "utf8", (err, data) => {
      if (err) {
        reject(err)
      } else {
        Papa.parse(data, {
          header: true,
          complete: results => {
            fs.writeFile(jsonFilePath, JSON.stringify(results.data), err => {
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

parseCsvToJson("./csv", "./json")
