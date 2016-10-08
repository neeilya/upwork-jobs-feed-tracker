import Vue from 'vue';
import jobsStorage from './services/jobs-storage';
import jobsAlarm from './services/jobs-alarm';
import storage from './services/storage';
import badge from './services/badge';
import config from './services/config';
import styles from './../sass/options.sass';
import moment from 'moment';

Vue.filter('timeAgo', (value) => {
    return moment(value).fromNow();
});

let app = new Vue({
    el: '#options',
    data: {
        jobs: jobsStorage.getAll(),
        unreadJobs: jobsStorage.getUnreadJobs(),
        auth: storage.get('auth', false),
        fetchInterval: config.getInterval()
    },
    created() {
        window.addEventListener('storage', (e) => {
            this.jobs = jobsStorage.getAll();
            this.unreadJobs = jobsStorage.getUnreadJobs();
            this.auth = storage.get('auth', true);
        }, true);

        jobsStorage.markAllRead();

        if(this.auth === true) {
            badge.refresh();
        }
    },
    watch: {
        'fetchInterval': function(newValue, oldValue) {
            config.setInterval(newValue);

            jobsAlarm.destroy();
            jobsAlarm.create(newValue);
        }
    }
});