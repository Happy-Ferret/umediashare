export function initialize(container, application) {
   application.inject('controller', 'renderer', 'module:renderer');
}

export default {
  name: 'renderer',
  after: 'settings',
  initialize: initialize
};
