/**
 * Custom exception class.
 */
class CustomException {

    constructor (code, message) {
		this.code = code;
		this.message = message;
    }
}

module.exports = CustomException;