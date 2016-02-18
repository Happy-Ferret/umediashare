export function initialize(container, application) {
   application.inject('controller:application', 'playlist', 'module:playlist');
   application.inject('controller:playlist', 'playlist', 'module:playlist');
}

export default {
  name: 'playlist',
  initialize: initialize
};
