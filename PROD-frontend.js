import express from 'express'
import cors from 'cors'
import * as dotenv from 'dotenv'
import compression from 'compression'
import https from 'https'
import fs from 'fs'
import axios from 'axios'
import { upload } from './FileAuth.js'

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

app.get('/GET/:COMMAND/:A?/:B?/:C?/:D?/:E?', async (req, res) => {
    const { URL } = process.env;
    let path = `${URL}/GET/${req.params.COMMAND}`

    if (req.params.A) { path += `/${req.params.A}` }
    if (req.params.B) { path += `/${req.params.B}` }
    if (req.params.C) { path += `/${req.params.C}` }
    if (req.params.D) { path += `/${req.params.D}` }
    if (req.params.E) { path += `/${req.params.E}` }

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

app.post('/POST/:COMMAND/:A?/:B?/:C?/:D?/:E?', async (req, res, next) => {
    const uploadRequiredAPIs = ['P147UFRL', 'P66UFR', 'P67UFF'];
    if (uploadRequiredAPIs.includes(req.params.COMMAND)) { return upload.array('files')(req, res, next); }
    next();
}, async (req, res) => {
    const { URL } = process.env;
    let path = `${URL}/POST/${req.params.COMMAND}`

    if (req.params.A) { path += `/${req.params.A}` }
    if (req.params.B) { path += `/${req.params.B}` }
    if (req.params.C) { path += `/${req.params.C}` }
    if (req.params.D) { path += `/${req.params.D}` }
    if (req.params.E) { path += `/${req.params.E}` }

    if (req.params.COMMAND === 'P66UFR') {
        const formData = new FormData();
        const FileContainer = await ConvertToBlob(req.files);
        formData.append('client', req.body.client)
        formData.append('docsID_list', req.body.docsID_list)
        formData.append('status_list', req.body.status_list)
        formData.append('remarks_list', req.body.remarks_list)
        formData.append('docStatus_list', req.body.docStatus_list)
        formData.append('prid', req.body.prid)
        formData.append('Uploader', req.body.Uploader)

        FileContainer.map(async (x) => {
            const FileHolder = new File([x.data], { type: x.file.mimetype });
            formData.append('files', FileHolder, x.file.originalname)
        })

        await axios.post(path, formData, { headers: { 'Content-Type': 'multipart/form-data' } })
            .then((result) => { res.json(result.data) })
            .catch(error => { res.json({ status: error.status, message: error.message, description: error.description }) });
    }
    else if (req.params.COMMAND === 'P67UFF') {
        const formData = new FormData();
        const FileContainer = await ConvertToBlob(req.files);
        formData.append('client', req.body.client)
        formData.append('docsID_list', req.body.docsID_list)
        formData.append('dfn_list', req.body.dfn_list)
        formData.append('remarks_list', req.body.remarks_list)
        formData.append('docStatus_list', req.body.docStatus_list)
        formData.append('prid', 'IC')
        formData.append('Uploader', req.body.Uploader)

        FileContainer.map(async (x) => {
            const FileHolder = new File([x.data], { type: x.file.mimetype });
            formData.append('files', FileHolder, x.file.originalname)
        })

        await axios.post(path, formData, { headers: { 'Content-Type': 'multipart/form-data' } })
            .then((result) => { res.json(result.data) })
            .catch(error => { res.json({ status: error.status, message: error.message, description: error.description }) });
    }
    else if (req.params.COMMAND === 'P147UFRL') {
        const formData = new FormData();
        const FileContainer = await ConvertToBlob(req.files);
        formData.append('client', req.body.client)
        formData.append('docsID_list', req.body.docsID_list)
        formData.append('status_list', req.body.status_list)
        formData.append('remarks_list', req.body.remarks_list)
        formData.append('docStatus_list', req.body.docStatus_list)
        formData.append('prid', req.body.prid)
        formData.append('Uploader', req.body.Uploader)

        FileContainer.map(async (x) => {
            const FileHolder = new File([x.data], { type: x.file.mimetype });
            formData.append('files', FileHolder, x.file.originalname)
        })

        await axios.post(path, formData, { headers: { 'Content-Type': 'multipart/form-data' } })
            .then((result) => { res.json(result.data) })
            .catch(error => { res.json({ status: error.status, message: error.message, description: error.description }) });
    }
    else {
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
    }
});

async function ConvertToBlob(files) {
    const FileData = files.map(file => {
        return new Promise((res, rej) => {
            fs.readFile(file.path, (err, data) => {
                if (err) { rej(err); }
                else { res({ file, data, }) }
            })
        })
    })

    const Blob = await Promise.all(FileData);
    return Blob;
}

app.get('/test', (req, res) => {
    res.json('ANO NG GALING TALAGA')
})

const { PORT } = process.env;
//app.listen(PORT, () => console.log(`Server Status: Listening on port ${PORT}`))

const options = {
    key: fs.readFileSync("ckfi.key"),
    cert: fs.readFileSync("STAR_ckfi_live.crt"),
};
https.createServer(options, app).listen(PORT, function (req, res) {
    console.log(`RUNNING: ${PORT}`);
});
