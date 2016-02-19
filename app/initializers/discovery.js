export function initialize(container, application) {
   application.inject('controller', 'discovery', 'module:discovery');
   application.inject('module', 'store', 'service:store');
}

export default {
  name: 'discovery',
  after: 'settings',
  initialize: initialize
};
