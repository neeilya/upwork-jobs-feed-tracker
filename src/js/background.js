import jobsFetcher from './services/jobs-fetcher';
import jobsStorage from './services/jobs-storage';
import jobsAlarm from './services/jobs-alarm';
import badge from './services/badge';
import config from './services/config';

let notifications = 0;

// Set badge if there are jobs in storage
if(jobsStorage.getUnreadJobs().length > 0) {
    chrome.browserAction.setBadgeBackgroundColor({ color: '#f44e42' });
    badge.setCounter(jobsStorage.getUnreadJobs().length);
}

jobsAlarm.create(config.getInterval()); // in production minimum 1 minute
jobsFetcher.fetchAndNotify();

chrome.alarms.onAlarm.addListener(({ name }) => {
    if(name !== 'jobsFetch') {
        return;
    }

    jobsStorage.removeOldJobs();
    jobsFetcher.fetchAndNotify();
});

chrome.notifications.onButtonClicked.addListener((notificationId, buttonId) => {
    if((notificationId + '').substr(0,9) !== 'freshJobs') {
        return;
    }

    chrome.tabs.create({'url': "/options.html" });
    chrome.notifications.clear(notificationId);
});