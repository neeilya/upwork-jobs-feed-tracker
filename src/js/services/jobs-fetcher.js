import parser from 'rss-parser/dist/rss-parser.js';
import config from './config';

export default {
    /**
     * Fetch jobs from server
     * @return {Array}
     */
    fetch() {
        let xhr = new XMLHttpRequest();

        xhr.open("GET", 'https://www.upwork.com/ab/find-work/api/feeds/search', false);
        xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
        xhr.send();

        if(xhr.status !== 200) {
            throw { code: xhr.status };
        }

        return JSON.parse(xhr.responseText);
    }
}