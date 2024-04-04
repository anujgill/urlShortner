const express = require('express');
const app = express();
const Router = require('./routes/urlRoute');
const mongoose = require('mongoose');
const path = require('path')

app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

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

app.use('/',Router);



