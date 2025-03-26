import express from 'express'
import path from 'path'
import {fileURLToPath} from 'node:url'

//import of routes
import getCustomObjects from "./routes/getCustomObjects.js"
import updateCustomObjects from "./routes/updateCustomObjects.js"

//instantiation of the express application
const app = express()

//setup of __dirname because its not natively available ES6
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

//serving of static files such as the style.css file
app.use(express.static(path.join(__dirname, 'public')))

//setup of the view engine

app.set("views", path.join(__dirname, 'views'))
app.set("view engine", "pug")
// Parse application/x-www-form-urlencoded form data
app.use(express.urlencoded({ extended: true }));

// Enable json parsing
app.use(express.json());
//registration of routes
app.use("/", getCustomObjects)
app.use("/", updateCustomObjects)

export default app
