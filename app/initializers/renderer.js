export function initialize(container, application) {
   application.inject('controller:player', 'renderer', 'module:renderer');
}

export default {
  name: 'renderer',
  after: 'settings',
  initialize: initialize
};
