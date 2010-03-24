
if (typeof Object.create !== 'function') {
  Object.create = function (o) {
    function F() {}
    F.prototype = o;
    return new F();
  };
}

//############################################################

var geom = (function() {
  var point = function(x, y) {
    return {"x": x,
            "y": y};
  };

  var region = (function() {
    var result = {
      "contains": function(p) {
        return (p.x >= this.topLeft.x && p.x <= this.bottomRight.x) &&
               (p.y >= this.topLeft.y && p.y <= this.bottomRight.y);
      },
      "overlaps": function(r) {
        return this.contains(r.topLeft)     ||
               this.contains(r.topRight)    ||
               this.contains(r.bottomLeft)  ||
               this.contains(r.bottomRight) ||
               r.contains(this.topLeft)     ||
               r.contains(this.topRight)    ||
               r.contains(this.bottomLeft)  ||
               r.contains(this.bottomRight);
      }
    };

    return function(p1, p2) {
      result             = Object.create(result);
      result.topLeft     = p1;
      result.topRight    = point(p2.x, p1.y);
      result.bottomLeft  = point(p1.x, p2.y);
      result.bottomRight = p2;

      return result;
    };
  })();

  return {"point": point,
          "region": region};
})();

//############################################################

var shuffle = function(sel, move_f) {
  sel = $(sel);

  move_f = move_f || function(elem, x, y, duration) {
    $(elem).animate({"left": x + "px",
                     "top":  y + "px"}, duration);
  };

  var overlap_iter = function(region, regions) {
    var i;
    var l = regions.length;

    for(i=0; i<l; i++) {
      if(region.overlaps(regions[i])) { return true; }
    }

    return false;
  };

  var box = {"width": sel.width(), "height": sel.height()};
  var regions = [];
  sel.find('.item').each(function(i, elem) {
    elem = $(elem);
    var x, y, region;
    var w = elem.width();
    var h = elem.height();

    do {
      x = Math.floor(Math.random()*(box.width - w));
      y = Math.floor(Math.random()*(box.height - h));
      region = geom.region(geom.point(x, y), geom.point(x+w, y+h));
    } while(overlap_iter(region, regions));

    regions.push(region);
    move_f(elem, region.topLeft.x, region.topLeft.y, 1000);
  });
};

$(document).ready(function() {
  shuffle('.scanny');

  $('button').click(function() {
    shuffle('.scanny');
  });
});
