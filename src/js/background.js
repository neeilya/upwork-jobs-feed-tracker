import fetcher from './services/jobs-fetcher';
import jobsStorage from './services/jobs-storage';
import badge from './services/badge';
import storage from './services/storage';
import config from './services/config';

let notifications = 0;

// Set badge if there are jobs in storage
if(jobsStorage.getUnreadJobs().length > 0) {
    chrome.browserAction.setBadgeBackgroundColor({ color: '#f44e42' });
    badge.setCounter(jobsStorage.getUnreadJobs().length);
}

chrome.alarms.create('jobsFetch', { periodInMinutes: config.getInterval() }); // in production minimum 1 minute

chrome.alarms.onAlarm.addListener(({ name }) => {
    if(name !== 'jobsFetch') { return; }

    try {
        let { results } = fetcher.fetch();
        let freshJobs = jobsStorage.push(results);
        let unreadJobs = jobsStorage.getUnreadJobs();

        badge.getText((text) => {
            if(text === 'err') {
                storage.store('auth', true);
                badge.setCounter(unreadJobs.length);
            }
        });

        if(freshJobs.length > 0) {
            badge.setCounter(freshJobs.length);

            chrome.notifications.create(++notifications + '-notification', {
                type: 'basic',
                iconUrl: './notification-icon.png',
                title: 'You got ' + freshJobs.length + ' new jobs!',
                message: "Don't miss your chance",
                buttons: [{
                    title: "Click here to take a look"
                }]
            });
        }
    } catch(err) {
        if(err.code === 401) {
            storage.store('auth', false);
            badge.refresh();
            badge.setText('err');
        }

        console.log(err);
    }
});