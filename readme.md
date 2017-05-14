![alt tag](https://raw.githubusercontent.com/neeilya/upwork-jobs-feed-tracker/master/promotional.png)

The Upwork jobs feed tracker is a Chrome extension.  
It allows you to track your personal jobs feed on Upwork  
and immediately notifies you whenever new job appears.

### Download
You can install ready extension directly from Chrome Web Store [here](https://chrome.google.com/webstore/detail/upwork-jobs-feed-tracker/gcjmekbfkkmaccloaoccfiohjnmgkddm).  
Feedback and contribute are highly appreciated!

## Warning to freelancers
**This extension retrieves items from your personal job feed**.  
If you are new freelancer on the platform, you might have empty  
jobs feed at the beginning. To personalize your job feed you have to  
make regular jobs search with some criteria like keyword or  
minimum budget and then save it (see screenshot)

![alt tag](https://raw.githubusercontent.com/neeilya/upwork-jobs-feed-tracker/master/search.png)

## Features

- Native Chrome notifications (now with sound)
- Configurable frequency of jobs checking requests
- Immediate access to fresh jobs
- *Todo:* Customizable search filters

## Tools and libraries used

- [Vuejs](https://github.com/vuejs)
- [Webpack](https://github.com/webpack/webpack)
- [Babel loader for ES6 features](https://babeljs.io/)
- [Moment.js](http://momentjs.com/)

## Build and contribute instructions

Dependencies: global **npm** and **webpack**
- Download the package
- Run `npm install`
- Run `webpack` (public directory should appear in the root of the project)
- Go to Chrome -> extensions (type in address bar `chrome://extensions`)
- Press *Load unpacked extension*
- Choose public directory

## License

This project is licensed under the [GNU General Public License](https://www.gnu.org/licenses/gpl-3.0.en.html)