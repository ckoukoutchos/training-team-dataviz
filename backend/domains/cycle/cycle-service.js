const {google} = require('googleapis');
const csv = require('csvtojson');
const config = require('../../config');
const CustomException = require("../../util/custom-exception");

module.exports = class CycleService {

	/**
	 * Sets up the Google Drive client with access token.
	 * @param {Request} req the incoming request
	 * @returns a configured instance of the google drive client
	 */
	configureGoogleClient(req) {
		const token = req.headers['x-access-token'];
		const oAuth2Client = new google.auth.OAuth2();
		oAuth2Client.setCredentials({ access_token: token });
		return google.drive({version: 'v3', auth: oAuth2Client});
	}

	/**
	 * The method called to retrieve all cycle data.
	 * @param {Request} req the incoming request
	 * @param {Response} res the outgoing response
	 */
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

	/**
	 * Processes the files which contain event data.
	 * @param {Google} drive the google drive client
	 * @param {Array} files the list of files to process
	 * @returns {Array} event data for all cycles
	 */
	async processFiles(drive, files) {
		const jsonData = files
			.filter((file) => {
				return !config.BLACKLIST.includes(file.name);
			})
			.map(async file => {
				try {
					let data = await this.retrieveCycleDataFromDrive(drive, file.id)
					let { name, formattedName } = this.processCycleKeyAndName(file.name);
					return { 
						metadata: {
							fileId: file.id, name: name, formattedName: formattedName
						},
						data: data 
					};
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

	/**
	 * Using the file name, parses a readable string for the cycle name.
	 * @param {String} fileName the name of the event data file
	 * @returns {String} a readable cycle name
	 */
	processCycleKeyAndName(fileName) {
		let cycleNameArray = fileName.split('_');
		let cycleName = '';
		let cycleFormattedName = '';
		if(cycleNameArray.length > 6) {
			let location = cycleNameArray[2];
			let year = cycleNameArray[3];
			let type = cycleNameArray[5];
			// process cycle key
			cycleName = type.toLowerCase() + location + year;
			// process cycle formatted name
			cycleFormattedName = `${type.includes('ML') ? 'Mastery Learning' : `${type} Cycle`} ${location} ${year}`;
		} else {
			cycleName = fileName;
			cycleFormattedName = cycleNameArray.join(' ');
		}
		return { name: cycleName, formattedName: cycleFormattedName };
	}

	/**
	 * Retrives a single cycle's event data.
	 * @param {Request} req the incoming request
	 * @param {Response} res the outgoing response
	 */
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

	/**
	 * Retrieves cycle data from drive and converts it to json.
	 * @param {Google} drive google drive client
	 * @param {String} fileId file id to search for
	 * @returns {JSON} cycle event data
	 */
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