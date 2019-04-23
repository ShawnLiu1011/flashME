!function() {
  var canvas = document.getElementById('cas');
  var ctx = canvas.getContext('2d');
  var rgb = '#448CBB';     
  var extendDis = 5;   
  var lineDis = 100;   
  var dotnumber = 500;
  lineDis *= lineDis;
   canvas.width = 2400;
   canvas.height = 1200;
  var RAF = (function() {
    return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function(callback) {
          window.setTimeout(callback, 1000 / 60);
        };
  })();
  var warea = {x: null, y: null};
  window.onmousemove = function(e) {
    e = e || window.event;
    warea.x = e.clientX - canvas.offsetLeft;
    warea.y = e.clientY - canvas.offsetTop;
  };
  window.onmouseout = function(e) {
    warea.x = null;
    warea.y = null;
  };
  var dots = [];
  for (var i = 0; i < dotnumber; i++) {
    var x = Math.random() * (canvas.width + 2 * extendDis) - extendDis;
    var y = Math.random() * (canvas.height + 2 * extendDis) - extendDis;
    var xa = (Math.random() * 2 - 1) / 1.5;
    var ya = (Math.random() * 2 - 1) / 1.5;
    dots.push({
      x: x,
      y: y,
      xa: xa,
      ya: ya
    })
  }
  setTimeout(function() {
    animate();
  }, 100);
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    bubDrawLine([warea].concat(dots));
    RAF(animate);
  }

  function bubDrawLine(ndots) {
    var ndot;
    dots.forEach(function(dot) {
      move(dot);
      for (var i = 0; i < ndots.length; i++) {
        ndot = ndots[i];
        if (dot === ndot || ndot.x === null || ndot.y === null) continue;
        var xc = dot.x - ndot.x;
        var yc = dot.y - ndot.y;
        if (xc > ndot.max || yc > lineDis) continue;
        var dis = xc * xc + yc * yc;
        if (dis > lineDis) continue;
        var ratio;
        if (ndot === warea && dis < 20000) {
          dot.x -= xc * 0.01;
          dot.y -= yc * 0.01;
        }
        ratio = (lineDis - dis) / lineDis;
        ctx.beginPath();
        ctx.lineWidth = ratio / 2;
        ctx.strokeStyle = rgb;
        ctx.moveTo(dot.x, dot.y);
        ctx.lineTo(ndot.x, ndot.y);
        ctx.stroke();
      }
      ndots.splice(ndots.indexOf(dot), 1);
    });
  }

  function move(dot) {
    dot.x += dot.xa;
    dot.y += dot.ya;
    dot.xa *= (dot.x > (canvas.width + extendDis) || dot.x < -extendDis) ? -1 : 1;
    dot.ya *= (dot.y > (canvas.height + extendDis) || dot.y < -extendDis) ? -1 : 1;
    ctx.fillStyle = rgb;
    ctx.fillRect(dot.x - 0.5, dot.y - 0.5, 1, 1);
  }
}();