import express from 'express'
import cors from 'cors'
import * as dotenv from 'dotenv'
import compression from 'compression'

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

app.get('/api/v1/GET/:COMMAND',async (req, res) => {
    const { URL } = process.env;
    await axios.get(`${URL}/api/v1/GET/${req.params.COMMAND}`)
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

app.post('/api/v1/POST/:COMMAND',async (req, res) => {
    const { URL } = process.env;
    await axios.post(`${URL}/api/v1/POST/${req.params.COMMAND}`)
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
app.listen(PORT, () => console.log(`Server Status: Listening on port ${PORT}`))