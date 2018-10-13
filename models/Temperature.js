const mongoose = require('mongoose');
const moment = require('moment');

// const TemperatureSchema = mongoose.Schema({
// 	location: {
// 		type: String,
// 		required: true
// 	},
// 	temperature: {
// 		type: Number,
// 		required: true
// 	},
// 	timestamp: {
// 		type: Date,
// 		required: true
// 	}
// });
 

// const Temperature = module.exports = mongoose.model('Temperature', TemperatureSchema );

function buildFullQuery(timestamp){
	return { $gt: 10, $lt: 20 };
}

module.exports.addTemperature = (newTemperature, callback) => {
	newTemperature.save(callback);
};

module.exports.getAll = () => {
	return new Promise(function(resolve, reject){
		Temperature.find({
			// temperature: { $gt: 22 },
			// temperature: buildFullQuery(),
		})
		.exec(function(err, data){
			if(err) {
				reject(err);
			} else {

				resolve(data);
			}
		});
	});
};

module.exports.getEachHour = () => {
	const startDate = new Date();

	return new Promise(function(resolve, reject){
		Temperature.find({})
		.exec(function(err, data){
			if(err) {
				reject(err);
			} else {
				console.log('Time until fetching all from database:');
				console.log(`${(new Date() - startDate) / 1000} s`);
				return data;
			}
		}).then(function(data){
			let arr = [];

			data.forEach(function(item){
				if ( queryFilter(item) ) {
					arr.push(item);
				}
			});

			console.log('Time until filtered:');
			console.log(`${(new Date() - startDate) / 1000} s`);
			resolve(arr);
		});
	});
};

function queryFilter (item) {
	return moment(item.timestamp).format('ss') === '00' && moment(item.timestamp).format('mm') === '00';
}