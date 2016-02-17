import DS from 'ember-data';

export default DS.Model.extend({
  name : DS.attr('string'),
  itemsNum : DS.attr('number'),

  selected : false
});
