import Ember from 'ember';


export default Ember.Component.extend({
  classNames : ['application-player'],
  tagName : 'div',
  player : Ember.computed.alias('application.player'),
  isPlaying : false,



  actions : {
    play() {
      this.get('player').send('play');
    },
    stop() {
      this.get('player').send('stop');
    },
    pause() {
      this.get('player').send('pause');
    },
    forward() {
      this.get('player').send('forward');
    },
    backward() {
      this.get('player').send('backward');
    }
  }
});
