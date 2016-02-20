import DS from 'ember-data';

export default DS.Model.extend({
  playlist : DS.attr(),
  isLocal : DS.attr('boolean'),
  localPath : DS.attr('string'),
  remotePath : DS.attr('string'),
  name : DS.attr('string'),
  contentType : DS.attr('string'),
  sort : DS.attr('number'),


  isPlaying : function() {
    return Ums.get('application.playlist.currentTrack') === this.get('id');
  }.property('Ums.application.playlist.currentTrack'),

  type : function() {
    return this.get('contentType').match(/^(\w+)\/.*$/)[1];
  }.property('contentType')
});
