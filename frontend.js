import express from 'express'
import cors from 'cors'
import * as dotenv from 'dotenv'
import compression from 'compression'
import https from 'https'
import fs from 'fs'
import axios from 'axios'

dotenv.config()
const app = express()
app.use(compression())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cors({
    origin: true,
    credentials: true,
    methods: ["GET", "POST"],
    allowedHeaders: [
        "Content-Type",
        "Authorization",
        "Access-Control-Allow-Credentials",
    ],
}))

app.get('/api/v1/GET/:COMMAND/:A?/:B?/:C?/:D?/:E?', async (req, res) => {
    const { URL } = process.env;

    let path = `${URL}/api/v1/GET/${req.params.COMMAND}`

    if (req.params.A) { path += `/${req.params.A}` }
    if (req.params.B) { path += `/${req.params.B}` }
    if (req.params.C) { path += `/${req.params.C}` }
    if (req.params.D) { path += `/${req.params.D}` }
    if (req.params.E) { path += `/${req.params.E}` }

    console.log(path)

    await axios.get(path)
        .then((result) => {
            res.json(result.data)
        })
        .catch(error => {
            res.json({
                status: error.status,
                message: error.message,
                description: error.description
            })
        });
});

app.post('/api/v1/POST/:COMMAND/:A?/:B?/:C?/:D?/:E?', async (req, res) => {
    const { URL } = process.env;

    let path = `${URL}/api/v1/POST/${req.params.COMMAND}`

    if (req.params.A) { path += `/${req.params.A}` }
    if (req.params.B) { path += `/${req.params.B}` }
    if (req.params.C) { path += `/${req.params.C}` }
    if (req.params.D) { path += `/${req.params.D}` }
    if (req.params.E) { path += `/${req.params.E}` }

    await axios.post(path, req.body)
        .then((result) => {
            res.json(result.data)
        })
        .catch(error => {
            res.json({
                status: error.status,
                message: error.message,
                description: error.description
            })
        });
});

const { PORT } = process.env;
//app.listen(PORT, () => console.log(`Server Status: Listening on port ${PORT}`))

const options = {
    key: fs.readFileSync("ckfi.key"),
    cert: fs.readFileSync("STAR_ckfi_live.crt"),
};

https.createServer(options, app)
    .listen(PORT, function (req, res) {
        console.log(`RUNNING: ${PORT}`);
    });