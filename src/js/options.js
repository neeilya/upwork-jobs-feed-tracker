import Vue from 'vue';
import jobsStorage from './services/jobs-storage';
import jobsAlarm from './services/jobs-alarm';
import storage from './services/storage';
import badge from './services/badge';
import config from './services/config';
import styles from './../sass/options.sass';
import moment from 'moment';
import jobsFetcher from './services/jobs-fetcher';

Vue.filter('timeAgo', value => {
  return moment(value).fromNow();
});

Vue.filter('money_human', value => {
  if (value === 0) {
    return value;
  }

  if (value >= 250000) return `250k+`;

  if (value >= 200000) return '200k+';

  if (value >= 150000) return '150k+';

  if (value >= 100000) return '100k+';

  if (value >= 70000) return '70k+';

  if (value >= 50000) return '50k+';

  if (value >= 25000) return '25k+';

  if (value >= 10000) return '10k+';

  if (value >= 5000) return '5k+';

  if (value >= 1000) return '1k+';

  if (value >= 500) return '500+';

  if (value >= 100) return '100+';

  return value;
});

new Vue({
  el: '#options',
  data: {
    isFetchingEnabled: config.getIsFetchingEnabled(),
    jobs: jobsStorage.getAll(),
    unreadJobs: jobsStorage.getUnreadJobs(),
    auth: storage.get('auth', true),
    fetchInterval: config.getInterval(),
    playNotificationSound: config.getPlayNotificationSound(),
    selectedJobs: [],
    newJob: null,
    excludedJobs: [],
    newExcludedJob: null
  },

  methods: {
    addJob() {
      if (!this.newJob) return;
      this.selectedJobs.push(this.newJob);
      this.newJob = '';
      this.saveJobs();
    },
    removeJob(x) {
      this.selectedJobs.splice(x, 1);
      this.saveJobs();
    },
    saveJobs() {
      let parsed = JSON.stringify(this.selectedJobs);
      localStorage.setItem('selectedJobs', parsed);
      console.log(parsed);
      jobsFetcher.fetchAndNotify();
    },

    addExcludedJob() {
      if (!this.newExcludedJob) return;
      this.excludedJobs.push(this.newExcludedJob);
      this.newExcludedJob = '';
      this.saveExcludedJobs();
    },
    removeExcludedJob(x) {
      this.excludedJobs.splice(x, 1);
      this.saveExcludedJobs();
    },
    saveExcludedJobs() {
      let parsed = JSON.stringify(this.excludedJobs);
      localStorage.setItem('excludedJobs', parsed);
      console.log(parsed);
      jobsFetcher.fetchAndNotify();
    }
  },
  created() {
    if (localStorage.getItem('excludedJobs')) {
      try {
        this.excludedJobs = JSON.parse(localStorage.getItem('excludedJobs'));
      } catch (e) {
        localStorage.removeItem('excludedJobs');
      }
    }
    if (localStorage.getItem('selectedJobs')) {
      try {
        this.selectedJobs = JSON.parse(localStorage.getItem('selectedJobs'));
      } catch (e) {
        localStorage.removeItem('selectedJobs');
      }
    }

    window.addEventListener(
      'storage',
      e => {
        this.jobs = jobsStorage.getAll();
        this.unreadJobs = jobsStorage.getUnreadJobs();
        this.auth = storage.get('auth', true);
      },
      true
    );

    jobsStorage.markAllRead();

    if (this.auth === true) {
      badge.refresh();
    }
  },
  watch: {
    fetchInterval: function(value) {
      config.setInterval(value);
      jobsAlarm.destroy();
      jobsAlarm.create(value);
    },
    selectJob: function(value) {
      config.setJob(value);
    },
    playNotificationSound: function(value) {
      config.setPlayNotificationSound(value);
    },
    isFetchingEnabled: function(value) {
      config.setIsFetchingEnabled(value);
      if (!JSON.parse(config.getIsFetchingEnabled())) {
        jobsAlarm.destroy();
      } else {
        jobsAlarm.create(config.getInterval());
      }
    }
  }
});
