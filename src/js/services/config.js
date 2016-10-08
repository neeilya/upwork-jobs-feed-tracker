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
     * @param {Void}
     */
    setInterval(interval) {
        localStorage.setItem('fetchInterval', +interval);
    }
}