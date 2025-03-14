import express from 'express'

//import of controller functions for the two routes
import {getFormData, updateCustomObject} from "../controllers/updateCustomObjects.js"

//instantiation of the router object
const router = express.Router()

//the get route to get and display the custom form to add records to the custom object
router.get("/update-cobj", getFormData)

//the post route to make use of the information submitted through the form and add a record to the custom object via the appropriate hubspot api endpoint
router.post("/update-cobj", updateCustomObject)

export default router