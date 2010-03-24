
var box = {};

var make_region = function(x1, y1, x2, y2) {
  return {"x1": x1, "y1": y1, "x2": x2, "y2": y2};
}

var get_region = function(elem) {
  var offset = $(elem).offset();
  return make_region(offset.left, offset.top, offset.left + $(elem).width(), offset.top + $(elem).height());
}

var overlap_xy_region = function(x, y, region) {
  return (x >= region.x1 && x <= region.x2) &&
         (y >= region.y1 && y <= region.y2);
}

var overlap = function(region1, region2) {
  var result = overlap_xy_region(region1.x1, region1.y1, region2) ||
               overlap_xy_region(region1.x2, region1.y1, region2) ||
               overlap_xy_region(region1.x1, region1.y2, region2) ||
               overlap_xy_region(region1.x2, region1.y2, region2) ||
               overlap_xy_region(region2.x1, region2.y1, region1) ||
               overlap_xy_region(region2.x2, region2.y1, region1) ||
               overlap_xy_region(region2.x1, region2.y2, region1) ||
               overlap_xy_region(region2.x2, region2.y2, region1);

  return result;
};

var overlap_iter = function(region, regions) {
  for(var i=0; i<regions.length; i++) {
    if(overlap(region, regions[i])) return true;
  };

  return false;
}

var moveto = function(elem, x, y, duration) {
  $(elem).animate({"left": x + "px",
                   "top":  y + "px"}, duration);
};

var shuffle = function() {
  var regions = [];

  $('.scanny .item').each(function(i, elem) {
    var w = $(elem).width();
    var h = $(elem).height();

    var x, y, region;
    do {
      x = Math.floor(Math.random()*(box.width - w));
      y = Math.floor(Math.random()*(box.height - h));
      region = make_region(x, y, x+w, y+h);
    } while(overlap_iter(region, regions));

    regions.push(region);
    moveto(elem, region.x1, region.y1, 1000);
  });
}

$(document).ready(function() {
  var target = $('.scanny')
  box.width = target.width();
  box.height = target.height();

  shuffle();

  $('button').click(function() {
    shuffle();
  });
});
