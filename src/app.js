import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import compression from 'compression';
const app = express();

// init middlewares
app.use(morgan('dev'))
app.use(helmet())
app.use(compression())

// init db

// routes

app.get('/', (req, res, next) => {
    const text = "hello";
    return res.status(200).json({
        message: "okay yeah",
        data: text.repeat(1000000)
    })
})

export default app;
