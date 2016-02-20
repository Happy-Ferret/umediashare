import DS from 'ember-data';

export default DS.Model.extend({
  name : DS.attr('string'),
  itemsNum : DS.attr('number'),

  selected : false,

  isCurrent : function() {
    return Ums.get('application.playlist.currentPlaylist') === this.get('id');
  }.property('Ums.application.playlist.currentPlaylist'),

  itemTypes : function() {
    let types = new Set();

    return DS.PromiseObject.create({
       promise : this.get('store').query('playlistItem', {playlist : this.get('id')}).then( r => {
                  r.forEach( i => {
                    types.add(i.get('type'));
                  });
                 return Array.from(types);
              })
    });
  }.property('itemsNum')
});
