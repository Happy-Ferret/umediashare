import DS from 'ember-data';

export default DS.Model.extend({
  playlist : DS.attr(),
  isLocal : DS.attr('boolean'),
  localPath : DS.attr('string'),
  remotePath : DS.attr('string'),
  name : DS.attr('string'),
  contentType : DS.attr('string')
});
