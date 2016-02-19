export function initialize(container, application) {
   application.inject('controller:application', 'resolver', 'module:resolver');
}

export default {
  name: 'resolver',
  after: 'settings',
  initialize: initialize
};
