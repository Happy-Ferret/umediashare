import Ember from 'ember';

var {set} = Ember;

export default Ember.Component.extend({
  classNames        : [ 'playlist-item-movable' ],
  classNameBindings : ['itemOver', 'itemMoving', 'itemMovingDrag'],
  attributeBindings : ['draggable', 'dataItem'],
  draggable : true,
  itemOver : false,
  itemMoving : false,
  itemMovingDrag: false,
  dataItem : null,
  tagName : 'li',
  onReorder : null,

  createItemsOrderList() {
    var out = [];
    Ember.$('li.playlist-item-movable[dataitem]').each(function(c) {
      out.push({
        id: Ember.$(this).attr('dataitem'),
        sort : c
      });
    });
    return out;
  },

  dragStart(event) {
    event.originalEvent.dataTransfer.setData('text/plain', this.$().attr('id'));
    set(this, 'itemMoving', true);
    setTimeout(() => set(this, 'itemMovingDrag', true), 0);
  },

  dragEnd() {
    set(this, 'itemMoving', false);
    set(this, 'itemMovingDrag', false);

  },

  dragOver() {
    set(this, 'itemOver', true);
  },

  dragLeave() {
    set(this, 'itemOver', false);
  },

  drop(event) {
    Ember.$(`#${event.originalEvent.dataTransfer.getData('text/plain')}`).insertBefore(this.$());
    set(this, 'itemOver', false);
    if (this.get('onReorder')) {
      this.onReorder(this.createItemsOrderList());
    }
  }
});
