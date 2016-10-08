export default {
    /**
     * Create alarm with specified interval
     * @param  {Number} interval
     * @return {Void}
     */
    create(interval) {
        chrome.alarms.create('jobsFetch', { periodInMinutes: +interval });
    },
    /**
     * Destroy alarm
     * @return {Void}
     */
    destroy() {
        chrome.alarms.clear('jobsFetch');
    }
}