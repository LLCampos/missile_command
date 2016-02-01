$( function() {

var c = document.getElementById("canvas");
var canvas = c.getContext("2d");

// ========== Math ==============



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
                x_positions.push(this.x_init_position + 50);
                x_positions.push(this.x_init_position + 43);
                x_positions.push(this.x_init_position + 57);
                x_positions.push(this.x_init_position + 38);
                x_positions.push(this.x_init_position + 50);
                x_positions.push(this.x_init_position + 64);
                x_positions.push(this.x_init_position + 35);
                x_positions.push(this.x_init_position + 45);
                x_positions.push(this.x_init_position + 57);
                x_positions.push(this.x_init_position + 67);
                return x_positions;
            },

            missiles_y_positions: function() {
                y_positions = [];
                y_positions.push(dune_height + 5);
                y_positions.push(dune_height + 15);
                y_positions.push(dune_height + 15);
                y_positions.push(dune_height + 25);
                y_positions.push(dune_height + 25);
                y_positions.push(dune_height + 25);
                y_positions.push(dune_height + 35);
                y_positions.push(dune_height + 35);
                y_positions.push(dune_height + 35);
                y_positions.push(dune_height + 35);
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
            },

            updateMissiles: function() {
                this.draw();
                this.drawMissiles();
            },
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
        canvas.fillRect(this.x_position, this.y_position, 1.5, 4);
        canvas.fillRect(this.x_position, this.y_position, 4, 1.5);
        canvas.fillRect(this.x_position + 4, this.y_position, 1.5, 4);
        canvas.fillRect(this.x_position + 2, this.y_position - 4, 1.5, 4);
    },
    };
};

// ============= Launched Missiles =====================

launchedMissles = [];



var launchMissile = function(from_x, to_x, to_y) {
    return {
        init_x: from_x,
        init_y: dune_height - 5,
        destination_x: to_x,
        destination_y: to_y,
        current_x: from_x,
        current_y: dune_height - 5,
        speed_x: 7,
        speed_y: 7,

        total_distance_x: function() {return this.destination_x - this.init_x;},
        total_distance_y: function() {return this.init_y - this.destination_y;},
        total_trajectory_distance: function() { return Math.sqrt(Math.pow(this.total_distance_x(), 2) + Math.pow(this.total_distance_y(), 2));} ,
        angle_trajectory: function() {
            var angle = Math.acos(this.total_distance_y() / this.total_trajectory_distance());
            var sign = (this.destination_x > this.init_x) ? 1 : -1;
            return sign * angle;
        },

        current_distance_x: function() {return this.current_x - this.init_x;},
        current_distance_y: function() {return this.init_y - this.current_y;},
        current_trajectory_distance: function() { return Math.sqrt(Math.pow(this.current_distance_x(), 2) + Math.pow(this.current_distance_y(), 2));} ,

        moveMissile: function() {
            this.current_x += this.speed_x;
            this.current_y -= this.speed_y;
        },

        clearTrajectory: function() {
            canvas.save();
            canvas.fillStyle = 'black';
            canvas.translate(this.init_x, this.init_y);
            canvas.rotate(Math.PI + this.angle_trajectory());
            canvas.fillRect(-1, -1, 3, this.current_trajectory_distance() + 2);
            canvas.restore();
        },

        drawTrajectory: function() {
            canvas.save();
            canvas.fillStyle = 'red';
            canvas.translate(this.init_x, this.init_y);
            canvas.rotate(Math.PI + this.angle_trajectory());
            canvas.fillRect(0, 0, 1, this.current_trajectory_distance());
            canvas.restore();
        },

        updateTrajectory: function() {
            this.moveMissile();
            this.drawTrajectory();
        },

    };
};






createDunes();
prepareDunes();

$(c).on('click', function(event) {
    x_coordinate = event.pageX - this.offsetLeft;
    y_coordinate = event.pageY - this.offsetTop;

    var x_dune_position = 0;
    var dune_shoot_from = "";

    if (x_coordinate < 140) {
        x_dune_position = 50;
        dune_shoot_from = dunes[0];
    } else if (x_coordinate < 320) {
        x_dune_position = 230;
        dune_shoot_from = dunes[1];
    } else {
        x_dune_position = 410;
        dune_shoot_from = dunes[2];
    }

    if (dune_shoot_from.missiles.length > 0) {

        dune_shoot_from.missiles.pop();
        dune_shoot_from.updateMissiles();

        var new_launched_missile = launchMissile(x_dune_position, x_coordinate, y_coordinate);

        var timer = setInterval(function() {
            if (new_launched_missile.current_trajectory_distance() > new_launched_missile.total_trajectory_distance()) {
                new_launched_missile.clearTrajectory();
                clearInterval(timer);
            } else {
                new_launched_missile.updateTrajectory();
            }
        }, 20);
    }
});



});
