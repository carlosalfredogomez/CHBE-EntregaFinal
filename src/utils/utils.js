import envConfig from "../config/env.config.js";
import { fileURLToPath } from "url";
import { dirname } from "path";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import multer from "multer";

//--------------------------[PROJECT DIRECTORIES]

export const __filename = fileURLToPath(import.meta.url);
export const __dirname = dirname(__filename);
export const __src = dirname(__dirname)


//--------------------------[PASSWORD VALIDATION]

export const isValidPassword = (user, password) => bcrypt.compareSync(password, user.password);


//--------------------------[GENERATE NEW CODE] Genera un codigo random para el productDTO y el ticketDTO

export const generateNewCode = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let randomCode = '';
    for (let i = 0; i < 7; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        randomCode += characters[randomIndex];
    }
    return randomCode
}


//--------------------------[JSON WEB TOKEN]  - 18.08

const KEY = envConfig.sessions.JWT_KEY

export const generateToken = (user) => {
    const token = jwt.sign({ user }, KEY, { expiresIn: '1h' })
    return token 
}
export const authToken = (req, res, next) => {
    const headerAuth = req.headers
    if (!headerAuth) return res.status(401).send({ status: 'error', error: 'Not Autorized' })
    const token = headerAuth.split(' ')[1]

    jwt.verify(token, KEY, (error, credentials) => {
        if (error) return res.status(401).send({ status: 'error', error: 'Not autorized second check.' })
        req.user = credentials.user
        next()
    })
}
export const recoveryPassToken = (req, res, next) => {
    const token = req.params.token

    jwt.verify(token, KEY, (err, decoded) => {
        if (err) {
            return res.status(401).send('Invalid or expired token');
        }

        const userEmail = decoded.userEmail;
        const currentPassword = decoded.currentPassword;

        const currentTimestamp = Math.floor(Date.now() / 1000); 
        if (decoded.exp <= currentTimestamp) {
            return res.status(401).send('Token has expired');
        }

        req.tokenData = { userEmail, currentPassword };
        next(); 
    });
}


//--------------------------[MULTER: FILE MANAGER FOR USERS]

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        let destinationFolder;

        if (file.fieldname === 'profile') {
            destinationFolder = 'profiles';
        } else if (file.fieldname === 'address' || file.fieldname === 'account') {
            destinationFolder = 'documents';
        } else if (file.fieldname === 'product') {
            destinationFolder = 'products';
        }

        cb(null, __src + '/public/uploads/' + destinationFolder);
    },
    filename: (req, file, cb) => {
        cb(null, req.session.user.email + '-' + file.fieldname + '-' + file.originalname);
    }
});

export const uploader = multer({ storage: storage })

export const userUpload = uploader.fields([
    { name: 'profile', maxCount: 1 },
    { name: 'address', maxCount: 1 },
    { name: 'account', maxCount: 1 }
])