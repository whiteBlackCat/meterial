//index.js
var wezrender = require('../../lib/wezrender');

//获取应用实例
var app = getApp();

var zr;

Page({

    onReady: function () {
        // console.log('onReady');
        var that = this;

        zr = wezrender.zrender.init("line-canvas-1", 375, 600);

        var lineCaps = ['butt', 'round', 'square'];
     
        for (var i = 0; i < 50; i++) {

            var color = 'rgb(' + [
                random(255),
                random(255),
                random(255)
            ].join(',') + ')';

            var line = new wezrender.graphic.shape.Line({
                shape: {
                    x1: 50,
                    y1: 10 + 10 * i,
                    x2: 250,
                    y2: 10 + 10 * i
                },
                style: {
                    lineCap: lineCaps[i % 3],                   
                    lineWidth: 5,
                    stroke: color,
                }

            });
            zr.add(line);
        }


        function random(max, min) {
            var min = min || 0;
            return Math.floor(Math.random() * (max - min)) % (max - min) + min;
        }
    },

    onUnload: function () {
        if (zr) {
            zr.dispose();
        }
    }
});