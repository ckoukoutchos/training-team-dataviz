const {google} = require('googleapis');
const csv = require('csvtojson');
const config = require('../../config');
const CustomException = require("../../util/custom-exception");

module.exports = class CycleService {

	configureGoogleClient(req) {
		const token = req.headers['x-access-token'];
		const oAuth2Client = new google.auth.OAuth2();
		oAuth2Client.setCredentials({ access_token: token });
		return google.drive({version: 'v3', auth: oAuth2Client});
	}

	async retrieveAllCycleData(req, res) {
		const drive = this.configureGoogleClient(req);
		try {
			let filesResponse = await drive.files.list({
				q: `'${config.EVENT_DIR_ID}' in parents and trashed = false`,
				fields: "nextPageToken, files(id, name)"
			});
			const files = filesResponse.data.files;
			if(files.length === 0) {
				throw new CustomException(401, 'You are not authorized to access this resource!' );
			} else {
				let processedData = await this.processFiles(drive, files);
				res.status(200).send(processedData);
			}
		} catch(err) {
			res.status(err.code).send(err.message);
		}
	}

	async processFiles(drive, files) {
		const jsonData = files.map(async file => {
			try {
				let data = await this.retrieveCycleDataFromDrive(drive, file.id)
				let cycleName = this.processCycleName(file.name);
				return { fileId: file.id, name: cycleName, data: data };
			} catch(err) {
				throw err;
			}
		});
		return Promise.all(jsonData).then((data) => {
			return data;
		}).catch(err => {
			throw new CustomException(500, 'An unexpected error occurred: ' + JSON.stringify(err));
		});
	}

	processCycleName(fileName) {
		let cycleNameArray = fileName.split('_');
		let cycleName = '';
		if(cycleNameArray.length > 4) {
			let location = cycleNameArray[0];
			let dateArray = cycleNameArray[1].split('-');
			let monthNum = Number(dateArray[1]) - 1;
			let type = cycleNameArray[3];
			cycleName += type.includes('Trad') ? 'trad' : 'ml';
			cycleName += location + config.MONTHS[monthNum] + dateArray[0];
		} else {
			cycleName = fileName;
		}
		return cycleName;
	}

	async retrieveCycleData(req, res) {
		const fileId = req.params.id;
		const drive = this.configureGoogleClient(req);
		try {
			let data = await this.retrieveCycleDataFromDrive(drive, fileId);
			res.status(200).send(data);
		} catch(err) {
			res.status(err.code).send(err.message);
		}
	}

	async retrieveCycleDataFromDrive(drive, fileId) {
		try {
			let cycleCsvData = await drive.files.export({
				fileId: fileId,
				mimeType: 'text/csv'
			}, {
				responseType: 'stream'
			});
			return await csv().fromStream(cycleCsvData.data);
		} catch(err) {
			if(err.code === '401') {
				throw new CustomException(401, 'You are not authorized to access this resource!' );
			} else {
				throw new CustomException(500, 'An unexpected error occurred: ' + JSON.stringify(err));
			}
		}
	}
}