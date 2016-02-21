import Ember from 'ember';

var os = require('os');
var http = require('http');
var fs = require('fs');
var url = require('url');

export default Ember.Object.extend({
  playlistItems : null,
  serverAddress : Ember.computed.alias('settings.serverAddress'),
  serverPort : Ember.computed.alias('settings.serverPort'),
  server : null,


  startServer : function() {
    if (!this.get('serverPort')) {
      this.set('serverPort', 8888);
    }

    this.set('server',
        http.createServer((request, response) => {
         let uri = url.parse(request.url).pathname.replace(/^\//,'');
         let item = this.get('playlistItems')
            .filter( i => i.get('isLocal') && i.get('remotePathFix').indexOf(uri) !== -1)
            .get('0');

          if (!item) {
            response.writeHead(404, {
              "Content-Type": "text/plain"
            });
            response.end();
          }
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
                 "Content-Type": item.get('contentTypeFix')
               });
               fs.createReadStream(filename).pipe(response);
            }
         });
       }).listen(this.get('serverPort'))
     );
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

        } else {
          this.set('serverAddress', iface.address);
        }
          ++alias;
      });
    });
  },


  init : function() {
    this.set('playlistItems', this.store.peekAll('playlistItem'));
    if (!this.get('serverAddress')) {
      this.lookupInterface();
    }
    this.startServer();
  }

});
