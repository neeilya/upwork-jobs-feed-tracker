import fetcher from './services/jobs-fetcher';
import jobsStorage from './services/jobs-storage';
import badge from './services/badge';
import parser from 'rss-parser/dist/rss-parser.js';
import storage from './services/storage';
import config from './services/config';

let notifications = 0;

localStorage.clear();

chrome.alarms.create('jobsFetch', { periodInMinutes: config.getInterval() }); // in production minimum 1 minute

chrome.alarms.onAlarm.addListener(({ name }) => {
    if(name !== 'jobsFetch') { return; }

    try {
        let { results } = fetcher.fetch();
        let newJobs = jobsStorage.push(results);

        if(newJobs.length > 0) {
            badge.increaseBy(newJobs.length);
            chrome.notifications.create(++notifications + '-notification', {
                type: 'basic',
                iconUrl: './icon.png',
                title: 'You got ' + newJobs.length + ' new jobs!',
                message: 'Click here to review'
            });
        }
    } catch(err) {
        badge.refresh();
        badge.setText('err');
    }
});