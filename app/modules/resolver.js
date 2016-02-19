import Ember from 'ember';
import hash from '../utils/utility-hash';

var os = require('os');
var http = require('http');
var fs = require('fs');
var url = require('url');
var bind_port = 8001;

export default Ember.Object.extend({
  playlistItems : null,
  serverAddress : null,
  serverPort : Ember.computed.alias('settings.serverPort'),


  startServer : function() {
    if (!this.get('serverPort')) {
      this.set('serverPort', 8888);
    }

    http.createServer((request, response) => {
     let uri = url.parse(request.url).pathname.replace(/^\//,'');
     let item = this.get('playlistItems')
        .filter( i => i.get('isLocal') && i.get('remotePath').indexOf(uri) !== -1)
        .get('0');
    let filename = item.get('localPath');

     fs.exists(filename, function (exists) {
         if (!exists) {
           response.writeHead(404, {
             "Content-Type": "text/plain"
           });
           response.write("404 Not Found\n");
           response.end();
           return;
         } else{
           response.writeHead(200, {
             "Content-Type": item.get('contentType')
           });
           let stream = fs.createReadStream(filename, { bufferSize: 64 * 1024 });
           stream.pipe(response);
        }
     });
   }).listen(this.get('serverPort'));
  },

  lookupInterface : function() {
    let ifaces = os.networkInterfaces();
    Object.keys(ifaces).forEach( ifname => {
      let alias = 0;
      ifaces[ifname].forEach( iface => {
        if ('IPv4' !== iface.family || iface.internal !== false) {
          return;
        }

        if (alias >= 1) {
          //handle aliases
          //console.log(ifname + ':' + alias, iface.address);
        } else {
          this.set('serverAddress', iface.address);
        }
          ++alias;
      });
    });
  },


  init : function() {
    this.set('playlistItems', this.store.peekAll('playlistItem'));
    this.lookupInterface();
    this.startServer();
  },

  playlistsObserver : function() {
      this.get('playlistItems')
        .filter( r => r.get('isLocal'))
        .forEach( r => r.set('remotePath',
         `http://${this.get('serverAddress')}:${this.get('serverPort')}/${hash(r.get('localPath'))}`
        ).save());
  }.observes('playlistItems.[]', 'playlistItems')

});
