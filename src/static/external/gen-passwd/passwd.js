/**
 * Generate passwords
 */
class Password {
    constructor() {
        this._pattern = /[a-zA-Z0-9_\-+.]/;
    }

    _getRandomByte() {
        let result = new Uint8Array(1);
        if (window.crypto && window.crypto.getRandomValues) {
            window.crypto.getRandomValues(result);
            return result[0];
        } else if (window.msCrypto && window.msCrypto.getRandomValues) {
            window.msCrypto.getRandomValues(result);
            return result[0];
        } else {
            return Math.floor(Math.random() * 256);
        }
    }

    /**
     * Generates a password with the given length
     * @param {Number} length
     * @returns {String}
     */
    generate(length) {
        return Array.apply(null, {"length": length})
            .map(() => {
                let result = "";
                while (true) {
                    result = String.fromCharCode(this._getRandomByte());
                    if (this._pattern.test(result)) {
                        return result;
                    }
                }
            }, this).join("");
    }
}