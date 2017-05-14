export default {
    /**
     * Get period of fetching jobs
     * @return {Number}
     */
    getInterval() {
        return localStorage.getItem('fetchInterval') || 1; // one minute by default in production (6 seconds in development)
    },
    /**
     * Setting period of fetching jobs
     * @param interval
     */
    setInterval(interval) {
        localStorage.setItem('fetchInterval', interval);
    },
    /**
     * Getter for playNotificationSound flag
     * @returns {boolean}
     */
    getPlayNotificationSound() {
        return localStorage.getItem('playNotificationSound');
    },
    /**
     * Setter for playNotificationSound flag
     * @param value
     */
    setPlayNotificationSound(value) {
        localStorage.setItem('playNotificationSound', +value);
    },
    /**
     * Getter for isFetchingEnabed param
     * @returns {boolean}
     */
    getIsFetchingEnabled() {
        return localStorage.getItem('isFetchingEnabled');
    },
    /**
     * Getter for isFetchingEnabed param
     * @returns {boolean}
     */
    setIsFetchingEnabled(value) {
        return localStorage.setItem('isFetchingEnabled', value);
    }
}