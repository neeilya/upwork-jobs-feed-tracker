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
        let xhr = new XMLHttpRequest();

        xhr.open("GET", 'https://www.upwork.com/ab/find-work/api/feeds/search', false);
        xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
        xhr.send();

        return xhr;
    },
    /**
     * Make auth check request
     * @return {Void}
     */
    checkAuthenticated() {
        let xhr = new XMLHttpRequest();

        xhr.open("GET", 'https://www.upwork.com/ab/account-security/login', false);
        xhr.setRequestHeader('Content-Type', 'text/html');
        xhr.send();
    },
    /**
     * Fetch jobs from server
     * @return {Array}
     */
    fetch() {
        this.checkAuthenticated();

        let response = this.feedRequest();

        if(response.status !== 200) {
            throw { code: response.status };
        }

        return JSON.parse(response.responseText);
    },
    /**
     * Fetch jobs for the first time and mark them read
     * @return {Void}
     */
    fetchFirstTime() {
        try {
            let { results } = this.fetch();
            let readJobs = results.map(job => {
                job.isRead = true;
                return job;
            });

            jobsStorage.store(readJobs);
        } catch (err) {
            if(err.code === 401) {
                storage.store('auth', false);
                badge.refresh();
                badge.setText('err');
            }

            console.log(err);
        }
    },
    /**
     * Fetch jobs and make notification if there are new
     * @return {Void}
     */
    fetchAndNotify() {
        try {
            let { results } = this.fetch();
            let freshJobs = jobsStorage.push(results);
            let unreadJobs = jobsStorage.getUnreadJobs();

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
        } catch(err) {
            if(err.code === 401) {
                storage.store('auth', false);
                badge.refresh();
                badge.setText('err');
            }

            console.log(err);
        }
    },
    /**
     * Remove old notifications if any
     * @return {Void}
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