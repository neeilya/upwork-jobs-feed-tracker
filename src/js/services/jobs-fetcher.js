import axios from 'axios';
import config from './config';
import jobsStorage from './jobs-storage';
import badge from './badge';
import storage from './storage';

let notifications = 0;

export default {
    /**
     * Make XMLHttpRequest
     * @return {Object}
     */
    feedRequest() {
        return axios.get('https://www.upwork.com/ab/find-work/api/feeds/search', {
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            }
        });
    },
    /**
     * Make auth check request (required for keeping user authenticated within upwork)
     * @return {Object}
     */
    checkAuthenticated() {
        return axios.get('https://www.upwork.com/ab/account-security/login');
    },
    /**
     * Fetch jobs from server
     * @return {Object}
     */
    fetch() {
        return this.checkAuthenticated().then(this.feedRequest);
    },
    /**
     * Fetch jobs and make notification if there are new
     * @return {undefined}
     */
    fetchAndNotify() {
        this.fetch().then(response => {
            const results = response.data.results;
            const freshJobs = jobsStorage.push(results);
            const unreadJobs = jobsStorage.getUnreadJobs();

            badge.setCounter(unreadJobs.length);
            storage.store('auth', true);

            if(freshJobs.length > 0) {
                this.removeOldNotifications();

                chrome.notifications.create('freshJobs-' + ++notifications, {
                    type: 'basic',
                    iconUrl: './notification-icon.png',
                    title: 'You got ' + freshJobs.length + ' new jobs!',
                    message: "Don't miss your chance",
                    buttons: [{
                        title: "Click here to take a look"
                    }]
                });

                if(!!JSON.parse(config.getPlayNotificationSound())) {
                    const sound = new Audio('notification.mp3');
                    sound.play();
                }
            }
        }).catch(err => {
            if (err.response && err.response.status === 401) {
                storage.store('auth', false);
                badge.refresh();
                badge.setText('err');

            }
        });
    },
    /**
     * Remove old notifications if any
     * @return {undefined}
     */
    removeOldNotifications() {
        chrome.notifications.getAll(notifications => {
            for(let notification in notifications) {
                if((notification + '').substr(0,9) !== 'freshJobs') {
                    return;
                }

                if (notifications.hasOwnProperty(notification)) {
                    chrome.notifications.clear(notification);
                }
            }
        });
    }
}