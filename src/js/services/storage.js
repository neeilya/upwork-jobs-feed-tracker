export default {
    /**
     * Store information
     * @param  {[type]} key   [description]
     * @param  {[type]} value [description]
     * @return {[type]}       [description]
     */
    store(key, value) {
        if(typeof value === 'object') { value = JSON.stringify(value); }
        localStorage.setItem(key, value);
    },

    /**
     * Get value from storage by key
     * @param  {String} key
     * @param  {*} defaultValue
     * @return {*}
     */
    get(key, defaultValue = null) {
        let res = localStorage.getItem(key);

        if(res === null) {
            return defaultValue;
        }

        try {
            res = JSON.parse(res);
        } finally {
            return res;
        }
    }
}