$( function() {

var c = document.getElementById("canvas");
var canvas = c.getContext("2d");

// background
canvas.fillStyle = "#000";
canvas.fillRect(0,0,500,500);


// draw yellow dunes
canvas.fillStyle = "yellow";
canvas.moveTo(0,500);
canvas.lineTo(0,470);
canvas.lineTo(30, 460);
canvas.lineTo(70, 460);
canvas.lineTo(100,470);
canvas.lineTo(180,470);
canvas.lineTo(210, 460);
canvas.lineTo(250, 460);
canvas.lineTo(280,470);
canvas.lineTo(360,470);
canvas.lineTo(390, 460);
canvas.lineTo(430, 460);
canvas.lineTo(460,470);
canvas.lineTo(540,470);
canvas.lineTo(540, 500);
canvas.closePath();
canvas.fill();

});
