import Ember from 'ember';
import DiscoveryInitializer from '../../../initializers/discovery';
import { module, test } from 'qunit';

let application;

module('Unit | Initializer | discovery', {
  beforeEach() {
    Ember.run(function() {
      application = Ember.Application.create();
      application.deferReadiness();
    });
  }
});

// Replace this with your real tests.
test('it works', function(assert) {
  DiscoveryInitializer.initialize(application);

  // you would normally confirm the results of the initializer here
  assert.ok(true);
});
