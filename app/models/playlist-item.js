import DS from 'ember-data';
import hash from '../utils/utility-hash';

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
  }.property('contentType'),

  contentTypeFix : function() {
    let result = this.get('contentType'),
    type = result.match(/^\w+\/(\w+)$/)[1];

    switch(type) {
        case 'mp3':
            result = 'audio/mpeg';
            break;
        case 'png': // does not supported ...
            break;
        default:
            break;
    }

    return result;
  }.property('contentType'),

  remotePathFix : function() {
    if (this.get('isLocal') === false) {
      return this.get('remotePath');
    }

    let address = this.get('settings.serverAddress'),
    port = this.get('settings.serverPort'),
    itemHash = hash(this.get('name'));

    return `http://${address}:${port}/${itemHash}`;
  }.property('remotePath', 'name')
});
