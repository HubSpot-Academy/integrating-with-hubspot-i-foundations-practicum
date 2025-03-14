//import of the express application instance
import app from "../app.js"

//id of the port to listen on
const port = process.env.PORT || 3000

//local host to listen on
app.listen(port, () => console.log(`Listening on port ${port}`))