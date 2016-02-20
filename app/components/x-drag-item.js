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
  onFileDrop : null,

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

  getItemOrder(element) {
    var item = Ember.$(element).attr('dataitem'), pos = 0;
    Ember.$('li.playlist-item-movable[dataitem]').each(function(c) {
      if (Ember.$(this).attr('dataitem') === item) {
          pos = c ;
        return;
      }

      if (typeof item === 'undefined') {
        pos = c + 1;
      }
    });
    return pos;
  },

  dragStart(event) {
    event.originalEvent.dataTransfer.setData('text/plain', 'item,' + this.$().attr('dataItem'));
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
    if (event.dataTransfer.files.length > 0) {
      if (this.get('onFileDrop')) {
        this.onFileDrop(event, this.getItemOrder(event.currentTarget));
      }
    } else {
      let item = event.originalEvent.dataTransfer.getData('text/plain').split(',')[1];

      /* it is an item from another playlist */
      if (Ember.$(`[dataitem=${item}]`).length === 0 &&  this.get('onItemMoved')) {
          this.onItemMoved(item, this.getItemOrder(this.$()));
      } else {
        Ember.$(`[dataitem=${item}]`).insertBefore(this.$());
        if (this.get('onReorder')) {
          this.onReorder(this.createItemsOrderList());
        }
      }
    }

    set(this, 'itemOver', false);
  }
});
