const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path')
const cookieParser = require('cookie-parser');
const urlRouter = require('./routes/urlRoute');
const userRouter = require('./routes/userRoute')
const staticRouter = require('./routes/staticRoute')

app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));
app.use(cookieParser());


app.use('/',staticRouter);
app.use('/url',urlRouter);
app.use('/user',userRouter);

require('dotenv').config();
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI)
        .then(()=>{console.log("Connected to DataBase...")
        app.listen(PORT,()=>{
            console.log(`Running on port ${PORT}`);
        });
    })
        .catch((err)=>console.log(err));





