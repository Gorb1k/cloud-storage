const mongoose = require("mongoose")
const express = require("express")
const config = require("config")
const fileUpload = require("express-fileupload")
const authRouter = require("./routes/auth.routes")
const fileRouter = require("./routes/file.routes")
const corsMiddleware = require('./middleware/cors.middleware')

const app = express()
const PORT = config.get("serverPort")

app.use(fileUpload({}))
app.use(corsMiddleware)
app.use(express.json())
app.use("/api/auth", authRouter)
app.use("/api/file", fileRouter)

const start = async () => {
    try {
        console.log('try to start mongo!')
        await mongoose.connect(config.get("dbURL"), {
            useNewUrlParser: true,
            useCreateIndex: true,
            useUnifiedTopology: true,
            useFindAndModify: false
        })
        console.log('mongo was created!')
        app.listen(PORT,() => {
            console.log(`Server has been started at ${PORT} port!`) })
    }catch (e) {
        console.log(e)
    }
}
start()