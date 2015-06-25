
// http://wiki.openstreetmap.org/wiki/Slippy_map_tilenames#ECMAScript_.28JavaScript.2FActionScript.2C_etc..29


function tile2lon(zoom, x) {
  return (x / Math.pow(2, zoom) * 360 - 180);
}

function tile2lat(zoom, y) {
  var n = Math.PI - (2 * Math.PI * y) / Math.pow(2, zoom);
  return (180 / Math.PI * Math.atan(0.5 * (Math.exp(n) - Math.exp(-n))));
}

var getLTRBbox = function (zoom, x, y) {

  var top = tile2lat(zoom, y);
  var bottom = tile2lat(zoom, y+1);
  var left = 	tile2lon(zoom, x);
  var right = tile2lon(zoom, x+1);

  return {
    left: left,
    top: top,
    right: right,
    bottom: bottom
  };

}

exports.getLTRBbox = getLTRBbox;
