import Ember from 'ember';

export default Ember.Component.extend({
  classNames : ['playlist-badge', 'pointer'],
  attributeBindings : ['draggable', 'dataItem'],
  classNameBindings : ['itemMoving', 'itemMovingOver'],
  itemMoving : false,
  itemMovingOver : false,
  draggable : true,
  dataItem : Ember.computed.alias('playlist.id'),

  dragStart : function(event) {
    event.originalEvent.dataTransfer.setData('text/plain', 'playlist,' + this.$().attr('dataitem'));
    setTimeout(() => this.set('itemMoving', true), 0);
  },

  dragOver : function(event) {
    event.preventDefault();
    this.set('itemMovingOver', true);
  },

  dragEnter : function(event) {
    this.cancelDragEvent();

    let dragDebounce =
    Ember.run.debounce(this, function(data) {
      let source = data.split(',');

      if (this.$() && this.$().attr('dataitem')) {

        if ((source[0] === 'item' && source[1]) || source[0] !== 'playlist') {
            this.get('application').transitionToRoute('playlists.playlist', this.$().attr('dataitem'));
        }
      }
    }, event.originalEvent.dataTransfer.getData('text/plain'), 1000);

    this.set('application.playlistsDragOverdebounce', dragDebounce);
  },

  dragLeave : function() {
    this.set('itemMovingOver', false);
  },

  dragEnd : function() {
    this.cancelDragEvent();
    this.set('itemMoving', false);
  },

  drop : function(event) {
    this.cancelDragEvent();

    let src = event.originalEvent.dataTransfer.getData('text/plain').split(','),
    target = this.$().attr('dataitem');

    if (src && src[0] === 'playlist') {
      if (src[1] !== target && confirm('Merge Playlists ?')) {
        this.get('application.playlist').mergePlaylists(src[1], target);
      }
    }

    this.set('itemMoving', false);
    this.set('itemMovingOver', false);
  },

  cancelDragEvent : function() {
    if (this.get('application.playlistsDragOverdebounce')) {
      Ember.run.cancel(this.get('application.playlistsDragOverdebounce'));
    }
  },

  actions : {
    toggleSelection : function(playlist) {
      this.get('model').filter(p => p.get('selected')).forEach(p => {
        if (p.get('id') !== playlist.get('id')) {
          p.set('selected', false);
        }
      });
      playlist.toggleProperty('selected');
      this.set('playlist.currentPlaylist', playlist.get('id'));
    },

    removePlaylist : function(playlist) {
      if (confirm('Delete Playlist ?')) {
        if (this.get('playlist.currentPlaylist') === playlist.get('id')) {
          this.set('playlist.currentPlaylist', null);
        }

        this.get('model.store').query('playlistItem', {playlist : playlist.get('id')}).then( i => {
          i.forEach( r => {
              r.destroyRecord();
              r.save();
          });
        });

        playlist.destroyRecord();
        playlist.save();
      }
    }
  }
});
