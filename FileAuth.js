import multer from 'multer'
const storage = multer.diskStorage({
    filename: (req, file, cb) => {
        cb(null, new Date().toISOString().replace(/:/g, '-') + '-' + file.originalname)
    }
})

export const upload = multer({ storage })