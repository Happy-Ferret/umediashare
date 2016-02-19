import DS from 'ember-data';

export default DS.Model.extend({
  name : DS.attr('string'),
  itemsNum : DS.attr('number'),

  selected : false,

  isCurrent : function() {
    return Ums.get('application.playlist.currentPlaylist') === this.get('id');
  }.property('Ums.application.playlist.currentPlaylist')
});
