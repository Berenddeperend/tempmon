require('dotenv').config();
const chalk = require('chalk');
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const config = require('./config/database');
const tempmonController = require('./controllers/tempmon');
// const temperatureRecorder = require('./workers/temprecorder');
const mockStream = require('./workers/mockStream');
const logReadableStream = require('./workers/logger');
const stringParser = require('./workers/stringParser');
const objStreamLogger = require('./workers/objStreamLogger');
const objValidator = require('./workers/objValidator');
const dbSaver = require('./workers/dbSaver');
const lightModel = require('./models/light.js').lightModel;
const anyModel = require('./models/any');

const arduino2 = require('./workers/arduino2');
const databaseSaver2 = require('./workers/dbsaver2');

const app = express();
const port = process.env.PORT || 4000;
let isLocal = port === 4000;

app.use(cors());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
// app.use(express.static('public'));

app.use('/', tempmonController);

app.listen(port, () => {
	console.log(chalk.gray(`Starting the server at port ${port}`));
});

// mongoose.connect(isLocal ? config.database.local : config.database.mlab , {
mongoose.connect(config.database.mlab, {
	useMongoClient: true
}).then(() => {
	console.log(chalk.gray(`Succesfully connected to database.`));
	
	const collections = tempmonController.fetchCollections();
	// anyModel.getAllFromAnyModel(collections[2]).then(data => {
	// 	console.log(data);
	// })

}).catch((error) => {
	console.log(chalk.red(`Connect to database failed:`));
	console.log(chalk.red(error));
});


// mockStream()
arduino2('usb')
// .pipe(logReadableStream())
		.pipe(stringParser())
		.pipe(objValidator())
		.pipe(objStreamLogger())
		// .pipe(dbSaver());
.pipe(databaseSaver2());