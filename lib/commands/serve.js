"use strict";

const stc = require('../serve/stc');
const sth = require('../serve/sth');
const mkdirp = require('mkdirp');
const fs = require('fs-extra');
const PLI = require('@superflycss/pli');
const gaze = require('gaze');

module.exports = (cli) => {
    cli.
    command('serve').
    alias('s').
    description('Serve test css and html').
    action((name) => {
        var bs = require("browser-sync").create();

        // Start the browsersync server
        bs.init({server: PLI.SERVE});
 
        stc();
        sth();
        stc().then(gazeTestCss(bs));
        sth().then(gazeTestHtml(bs));
    });
}

function gazeTestCss(bs) {
    gaze(PLI.SRC_TEST_HTML, (err, watcher) => {

        if (err) {
            log('error', 'Error buliding src/test/html content.');
            throw new Error(err);
        }

        /**
         * Triggered both when new files are added and when files are changed.
         */
        watcher.on('changed', function (filepath) {
            bth().then(()=>{
                bs.reload("*.html");
            })
        });
    });
}

function gazeTestHtml(bs) {
    gaze(PLI.SRC_TEST_CSS, (err, watcher) => {

        if (err) {
            log('error', 'Error buliding src/test/css/ content.');
            throw new Error(err);
        }

        /**
         * Triggered both when new files are added and when files are changed.
         */
        watcher.on('changed', function (filepath) {
            btc().then(()=>{
                bs.reload("*.css");
            });
        });
    });
}