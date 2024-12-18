import dotenv from "dotenv"
import express from "express"
import morgan from "morgan"
import helmet from "helmet"
import cors from "cors"
import { router } from "./routes/index.js"
import connectDB from "./connection/db.js"
import { i18n } from "./utils/i18n.js"

dotenv.config({
    path: './.env'
})
let app = express()

app.use((req, res, next) => {
    res.append("Access-Control-Expose-Headers", "x-total, x-total-pages");
    next();
});

app.use(cors());
app.use(i18n.init)
morgan.format('custom', ':method :url :status :res[content-length] - :response-time ms')
app.use(morgan('custom'))

app.use(express.json());
app.use(helmet());
app.use(express.urlencoded({ extended: false }));

app.use(express.static("public"));


app.use(function (req, res, next) {
    if (req.headers && req.headers.lang && req.headers.lang == 'ar') {
        i18n.setLocale(req.headers.lang)
    }
    else if (req.headers && req.headers.lang && req.headers.lang == 'hi') {
        i18n.setLocale(req.headers.lang)
    } else {
        i18n.setLocale('en')
    }
    next();
});


app.use("/api/v1", router)


app.use(function (err, req, res, next) {
    console.error(err);
    const status = err.status || 400;
    if (err.message == "jwt expired" || err.message == "Authentication error") {
        res.status(401).send({ status: 401, message: err });
    }
    if (err instanceof ApiError) {
        return res.status(err.statusCode).json({
            status: err.statusCode,
            message: err.message,
            data: err.data,
            success: err.success,
            errors: err.errors
        });
    } else if (err.Error)
        res.status(status).send({ status: status, message: err.Error });
    else if (err.message)
        res.status(status).send({ status: status, message: err.message });
    else res.status(status).send({ status: status, message: err.message });
});


connectDB().then(() => {
    app.listen((process.env.PORT || 8000), () => {
        console.log(`Server is running at port: ${process.env.PORT} `)
    })
}).catch((err) => [
    console.log("MongoDB connection failed!!!", err)
])



