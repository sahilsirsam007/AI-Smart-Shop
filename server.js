import express from 'express'
import { app as smartShopApi } from './backend/server.js'

const app = express()
app.use(smartShopApi)

export default app
