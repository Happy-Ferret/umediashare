import DS from 'ember-data';

export default DS.Model.extend({
  isLocal : DS.attr('boolean'),
  localPath : DS.attr('string'),
  remotePath : DS.attr('string')
});
