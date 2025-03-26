import express from 'express'

//import of the controller function for this route
import {getCustomObjects} from "../controllers/getCustomObjects.js"

//instantiation of the router object
const router = express.Router()

//get route to obtain custom object data from the HubSpot account
router.get('/', getCustomObjects)

export default router