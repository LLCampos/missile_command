$( function() {

var c = document.getElementById("canvas");
var canvas = c.getContext("2d");

// ========= Background =======================

canvas.fillStyle = "#000";
canvas.fillRect(0,0,500,500);

// ========= Dunes ===============================

var floor_height = 470;
var dune_height = 460;


var createDune = function(x) {
    return {x_init_position: x,
            missiles: [],
            color: "yellow",


            draw: function() {
                canvas.fillStyle = this.color;
                canvas.beginPath();
                canvas.moveTo(this.x_init_position,500);
                canvas.lineTo(this.x_init_position,floor_height);
                canvas.lineTo(this.x_init_position + 30, dune_height);
                canvas.lineTo(this.x_init_position + 70, dune_height);
                canvas.lineTo(this.x_init_position + 100, floor_height);
                canvas.lineTo(this.x_init_position + 180, floor_height);
                canvas.lineTo(this.x_init_position + 180, 500);
                canvas.closePath();
                canvas.fill();
            },

            missiles_x_positions: function() {
                x_positions = [];
                x_positions.push(this.x_init_position + 55);
                x_positions.push(this.x_init_position + 48);
                x_positions.push(this.x_init_position + 62);
                x_positions.push(this.x_init_position + 43);
                x_positions.push(this.x_init_position + 55);
                x_positions.push(this.x_init_position + 67);
                x_positions.push(this.x_init_position + 38);
                x_positions.push(this.x_init_position + 48);
                x_positions.push(this.x_init_position + 62);
                x_positions.push(this.x_init_position + 72);
                return x_positions;
            },

            missiles_y_positions: function() {
                y_positions = [];
                y_positions.push(dune_height);
                y_positions.push(dune_height + 10);
                y_positions.push(dune_height + 10);
                y_positions.push(dune_height + 20);
                y_positions.push(dune_height + 20);
                y_positions.push(dune_height + 20);
                y_positions.push(dune_height + 30);
                y_positions.push(dune_height + 30);
                y_positions.push(dune_height + 30);
                y_positions.push(dune_height + 30);
                return y_positions;
            },

            createMissiles: function() {
                for (var i = 0; i<10; i++) {
                    var missile = createMissile(this.missiles_x_positions()[i], this.missiles_y_positions()[i]);
                    this.missiles.push(missile);
                }
            },

            drawMissiles: function() {
                this.missiles.forEach( function(element) {
                    element.draw();
                });
            }
    };
};

var createDunes = function() {
    dunes = [];

    for (var i = 0; i<3; i++) {
        var x_position = i * 180;
        dunes.push(createDune(x_position));
    }
};

var prepareDunes = function() {
    dunes.forEach( function(element) {
        element.draw();
        element.createMissiles();
        element.drawMissiles();
    });
};


// ============== Missiles =========================

var createMissile = function(x, y) { return {
    x_position: x,
    y_position: y,
    draw: function() {
        canvas.fillStyle = "blue";
        canvas.fillRect(this.x_position, this.y_position, 2, 5);
        canvas.fillRect(this.x_position, this.y_position, 5, 2);
        canvas.fillRect(this.x_position + 5, this.y_position, 2, 5);
        canvas.fillRect(this.x_position + 2.5, this.y_position - 5, 2, 5);
    },
    };
};







createDunes();
prepareDunes();


});
