const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
require('dotenv').config();

const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUI = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json')

const userRoutes = require('./routes/routes')
const authRoute = require('./routes/auth');
const errorMiddleware = require('./middleware/errorMiddleware');

const app = express();
const PORT = process.env.PORT || 3000;


//database coonection
mongoose.connect(process.env.DB, {useNewUrlParser: true, useUnifiedTopology: true});
const db = mongoose.connection;
db.on('error', (err)=> {
   console.log(err);
});
db.once('open', () =>{
   console.log('Database connected successfully!');
})

app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument));
app.use(morgan('tiny'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(express.json());
// app.use('/uploads', express.static('uploads'))

app.use('/api/user', userRoutes)
app.use('/api', authRoute)

morgan.token('host', function(req, res) {
   return req.hostname;
});

app.use(errorMiddleware)

app.listen(PORT, () => {
   console.log(`Server is running at http://localhost:${PORT}`);
})