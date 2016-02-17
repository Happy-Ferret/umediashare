/*jshint node:true*/
/* global require, module */
var EmberApp = require('ember-cli/lib/broccoli/ember-app');
var Funnel = require("broccoli-funnel");
var mergeTrees = require("broccoli-merge-trees");

module.exports = function(defaults) {
  var app = new EmberApp(defaults, {
    lessOptions: {
        paths: [
          'vendor/adminlte/less/'
        ]
      }
  });


  app.import('vendor/jquery-xml2json/src/xml2json.js');
  app.import('vendor/adminlte/js/bootstrap.min.js');
  app.import('vendor/adminlte/js/AdminLTE/vendour.js');
  app.import('vendor/adminlte/css/bootstrap.min.css');
  app.import('bower_components/font-awesome/css/font-awesome.min.css');
  app.import('bower_components/roboto-fontface/css/roboto-fontface.css');
  app.import('vendor/komika/komika.css');
  app.import('vendor/electron/context-menu.js');

  var faAssets = new Funnel("bower_components/font-awesome/fonts", {
      srcDir: "/",
      include: ["*.*"],
      destDir: "/fonts"
  });

  var roAssets = new Funnel("bower_components/roboto-fontface/fonts", {
      srcDir: "/",
      include: ["*.*"],
      destDir: "/fonts"
  });

  var koAssets = new Funnel("vendor/komika/font", {
    srcDir: "/",
    include: ["*.*"],
    destDir: "/fonts"
  });


  assets = mergeTrees([faAssets, roAssets, koAssets]);

  return app.toTree(assets);
};
