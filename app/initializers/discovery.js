export function initialize(container, application) {
   application.inject('route', 'discovery', 'module:discovery');
   application.inject('controller', 'discovery', 'module:discovery');
   application.inject('component', 'discovery', 'module:discovery');
   application.inject('module', 'store', 'service:store');
}

export default {
  name: 'discovery',
  after: 'settings',
  initialize: initialize
};
