import Vue from 'vue';
import storage from './services/storage';
import jobsStorage from './services/jobs-storage';
import styles from './../sass/popup.sass';

let app = new Vue({
    el: '#popup',
    data: {
        jobs: jobsStorage.getUnreadJobs(),
        auth: storage.get('auth', true)
    },
    created() {
        window.addEventListener('storage', (e) => {
            this.jobs = jobsStorage.getUnreadJobs();
            this.auth = storage.get('auth', true);
        }, true);
    },
    methods: {
        openOptionsPage() {
            chrome.tabs.create({'url': "/options.html" });
        }
    }
});