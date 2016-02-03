$( function() {

var c = document.getElementById("canvas");
var canvas = c.getContext("2d");

speed = 20;
speedEnemyMissiles = 0.5;
speedUserMissiles = 7;

// ========= Background ==========================

var getBlackScreen = function() {
    canvas.fillStyle = "#000";
    canvas.fillRect(0,0,500,500);
};

// ========= Dunes ===============================

var floor_height = 470;
var dune_height = 460;


var createDune = function(x) {
    return {x_init_position: x,
            x_position_middle_dune: function() {return this.x_init_position + 50;},
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
                    var missile = createUserMissile(this.missiles_x_positions()[i], this.missiles_y_positions()[i]);
                    this.missiles.push(missile);
                }
            },

            drawMissiles: function() {
                this.missiles.forEach( function(element) {
                    element.draw('blue');
                });
            },

            eraseMissile: function(missile) {
                missile.draw("yellow");
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


// decides from which dune the missile will be shoot
var chooseDune = function(x_coordinate) {

    var dune_shoot_from = false;
    var dunes_with_missiles = dunes.filter(function(element) {return element.missiles.length > 0;});

    if (dunes_with_missiles.length > 0) {

        if (dunes_with_missiles.length === 1) {
            dune_shoot_from = dunes_with_missiles[0];
        } else {

            if (x_coordinate < 140) {
                dune_shoot_from = dunes_with_missiles[0];

            } else if (x_coordinate < 320) {

                if (dunes[1].missiles.length > 0) {
                    dune_shoot_from = dunes[1];
                } else if (x_coordinate < 250) {
                    dune_shoot_from = dunes_with_missiles[0];
                } else {
                    dune_shoot_from = dunes_with_missiles[1];
                }

            } else {
                dune_shoot_from = dunes_with_missiles.reverse()[0];
            }
        }
    }

    return dune_shoot_from;
};

// ============= Missiles ===========================


var launchMissile = function(from_x, to_x, from_y, to_y, missile_speed) {
    return {
        init_x: from_x,
        init_y: from_y,
        destination_x: to_x,
        destination_y: to_y,
        current_x: function() {
            angle_with_trajectory = Math.PI/2 - Math.abs(this.angle_trajectory());
            return this.init_x + (Math.cos(angle_with_trajectory) * this.current_trajectory_distance) * Math.sign(this.angle_trajectory());
        },
        current_y: function() {return Math.abs(Math.cos(this.angle_trajectory()) * this.current_trajectory_distance) + this.init_y;},
        active: true,

        total_distance_x: function() {return this.destination_x - this.init_x;},
        total_distance_y: function() {return this.init_y - this.destination_y;},
        total_trajectory_distance: function() { return Math.sqrt(Math.pow(this.total_distance_x(), 2) + Math.pow(this.total_distance_y(), 2));} ,
        angle_trajectory: function() {
            var angle = Math.acos(this.total_distance_y() / this.total_trajectory_distance());
            var sign = (this.destination_x > this.init_x) ? 1 : -1;
            return sign * angle;
        },

        current_trajectory_distance: 0,

        moveMissile: function() {
            this.current_trajectory_distance += missile_speed;
        },

        clearTrajectory: function() {
            canvas.save();
            canvas.fillStyle = 'black';
            canvas.translate(this.init_x, this.init_y);
            canvas.rotate(Math.PI + this.angle_trajectory());
            canvas.fillRect(-1, -1, 3, this.current_trajectory_distance + 2);
            canvas.restore();
        },

        drawTrajectory: function() {
            canvas.save();
            canvas.fillStyle = 'red';
            canvas.translate(this.init_x, this.init_y);
            canvas.rotate(Math.PI + this.angle_trajectory());
            canvas.fillRect(0, 0, 1, this.current_trajectory_distance);
            canvas.restore();
        },

        updateTrajectory: function() {
            this.moveMissile();
            this.drawTrajectory();
        },

    };
};


// ============== User Missiles =========================

var createUserMissile = function(x, y) { return {
    x_position: x,
    y_position: y,
    draw: function(color) {
        canvas.fillStyle = color;
        canvas.fillRect(this.x_position, this.y_position, 1.5, 4);
        canvas.fillRect(this.x_position, this.y_position, 4, 1.5);
        canvas.fillRect(this.x_position + 4, this.y_position, 1.5, 4);
        canvas.fillRect(this.x_position + 2, this.y_position - 4, 1.5, 4);
    },
    };
};

var shootUserMissile = function(dune_shoot_from, x_coordinate, y_coordinate) {

    if (y_coordinate > 440) {
        y_coordinate = 440;
    }

    missile_used = dune_shoot_from.missiles.pop();
    dune_shoot_from.eraseMissile(missile_used);

    new_launched_missile = launchMissile(dune_shoot_from.x_position_middle_dune(), x_coordinate, dune_height - 5, y_coordinate, speedUserMissiles);

    var timer = setInterval(function() {
        if (new_launched_missile.current_trajectory_distance > new_launched_missile.total_trajectory_distance()) {
            new_launched_missile.clearTrajectory();
            new_explosion = createExplosion(x_coordinate, y_coordinate);
            userExplosions.push(new_explosion);
            new_explosion.explosion();
            clearInterval(timer);
        } else {
            new_launched_missile.updateTrajectory();
        }
    }, speed);
};

// ============== Enemy Missiles =====================================

// enemyMissiles = [];

var createEnemyMissile = function() {
    init_x = Math.floor(Math.random() * 500);
    destination_x = Math.floor(Math.random() * 500);
    return launchMissile(init_x, destination_x, 22, floor_height, speedEnemyMissiles);
};

var shootEnemyMissile = function() {
    var new_launched_missile = createEnemyMissile();
    enemyMissiles.push(new_launched_missile);
};

var updateEnemyMissiles = function() {
    setInterval(function() {

        enemyMissiles = enemyMissiles.filter(function(missile) {return missile.active;});

        for (var i in enemyMissiles) {

            missile = enemyMissiles[i];

            if (missile.current_trajectory_distance > missile.total_trajectory_distance()) {
                missile.clearTrajectory();
                dune_hitted = checkCollisionWithUserMissiles(missile.destination_x);

                if (dune_hitted) {
                    new_explosion = createExplosion(dune_hitted.x_position_middle_dune(), dune_height + 5);
                    dune_hitted.missiles = [];
                } else {
                    new_explosion = createExplosion(missile.destination_x, missile.destination_y);
                }

                enemyExplosions.push(new_explosion);
                new_explosion.explosion();

                missile.active = false;
            } else {
                missile.updateTrajectory();
            }
        }

    },speed);
};

var launchEnemyMissiles = function(n) {
    for (var i = 0; i < n; i++) {
        shootEnemyMissile();
    }
};

var enemyMissilesLauncher = function() {
    enemyMissiles = [];

    var total_enemy_missiles = 15;
    var enemy_missiles_per_batch = 5;

    launchEnemyMissiles(enemy_missiles_per_batch);
    total_enemy_missiles -= enemy_missiles_per_batch;

    var timer = setInterval(function() {

        console.log(enemyMissiles);

        launchEnemyMissiles(enemy_missiles_per_batch);
        total_enemy_missiles -= enemy_missiles_per_batch;
        if (total_enemy_missiles <= 0) {
            clearTimeout(timer);
        }
    }, 5000);
};


// ============= EXPLOSIONS ===========================================

userExplosions = [];
enemyExplosions = [];

var createExplosion = function(x, y) {
    return {
        x_coordinate: x,
        y_coordinate: y,
        current_radius: 0,
        max_radius: 20,
        speed: 1,
        active: true,
        drawExplosion: function() {
            canvas.fillStyle = "white";
            canvas.beginPath();
            canvas.arc(this.x_coordinate, this.y_coordinate, this.current_radius, 0, 2*Math.PI);
            canvas.fill();
        },
        clearExplosion: function() {
            canvas.fillStyle = "black";
            canvas.beginPath();
            canvas.arc(this.x_coordinate, this.y_coordinate, this.max_radius, 0, 2*Math.PI);
            canvas.fill();
        },
        explosionDiminish: function() {
            var that = this;
            var timer = setInterval(function() {
                if (that.current_radius <= 0) {
                    clearInterval(timer);
                    that.active = false;
                } else {
                    that.clearExplosion();
                    that.current_radius -= that.speed;
                    that.drawExplosion();
                }
            }, speed);
        },
        explosion: function() {
            var that = this;
            var timer = setInterval(function() {
                if (that.current_radius >= that.max_radius) {
                    clearInterval(timer);
                    that.explosionDiminish();
                } else {
                    that.current_radius += that.speed;
                    that.drawExplosion();
                }
            }, speed);
        }
    };

};

updateExplosions = function() {
    setInterval(function() {
        userExplosions = userExplosions.filter(function(explosion){return explosion.active;});
        enemyExplosions = enemyExplosions.filter(function(explosion){return explosion.active;});
    }, speed);
};

// =========== Collisions ========================

var checkCollisions = function() {
    setInterval( function() {
        checkCollisionUserExplosioneEnemyMissile();
    }, speed);
};

var checkCollisionUserExplosioneEnemyMissile = function() {
    userExplosions.forEach( function(explosion) {
        var radius = explosion.current_radius;
        var x = explosion.x_coordinate;
        var y = explosion.y_coordinate;
        enemyMissiles.forEach( function(missile) {
            if (missile.current_x() >= x - radius && missile.current_x() <= x + radius && missile.current_y() >= y - radius && missile.current_y() <= y + radius) {
                missile.clearTrajectory();
                new_explosion = createExplosion(missile.current_x(), missile.current_y());
                new_explosion.explosion();
                userExplosions.push(new_explosion);
                missile.active = false;

                user.hitUserMissile();
            }
        });
    });
};

var checkCollisionWithUserMissiles = function(x) {
    if (x >= dunes[0].x_init_position && x <= dunes[0].x_init_position + 100) {
        return dunes[0];
    } else if (x >= dunes[1].x_init_position && x <= dunes[1].x_init_position + 100) {
        return dunes[1];
    } else if (x >= dunes[2].x_init_position && x <= dunes[2].x_init_position + 100){
        return dunes[2];
    } else {
        return false;
    }
};

// ============== Start Game Button ===================

var start_button_x = 190;
var start_button_y = 250;
var start_button_height = 30;
var start_button_width = 100;

var detectClickOnButton = function(x,y) {
    if (x >= start_button_x && x <= start_button_x + start_button_width &&
        y >= start_button_y && y <= start_button_y + start_button_height) {
        return true;
    } else {
        return false;
    }
};

// ============== Score ====================

var newScore = {
    score: 0,
    hitUserMissile: function() {this.score += 25;}
};

var updateScoreOnScreen = function(user) {
    setInterval(function() {
        canvas.fillStyle = "red";
        canvas.font = "21px Munro";
        canvas.fillText(user.score, 100, 20);
    }, speed);
};

// ============== Game =====================

var startGame = function() {
    getBlackScreen();
    createDunes();
    prepareDunes();

    updateEnemyMissiles();
    updateExplosions();
    checkCollisions();

    user = newScore;
    updateScoreOnScreen(user);

    enemyMissilesLauncher();
    // launchEnemyMissiles(5);

    $(c).on('click', function(event) {
        x_coordinate = event.pageX - this.offsetLeft;
        y_coordinate = event.pageY - this.offsetTop;

        dune_shoot_from = chooseDune(x_coordinate);

        if (dune_shoot_from) {
            shootUserMissile(dune_shoot_from, x_coordinate, y_coordinate);
        }
    });
};

var startScreen = function() {
    getBlackScreen();
    canvas.fillStyle = 'blue';
    canvas.font = "50px Munro";
    canvas.fillText("Missile Command", 80, 200);

    canvas.fillStyle = "red";
    canvas.fillRect(start_button_x, start_button_y, start_button_width, start_button_height);

    canvas.fillStyle = "white";
    canvas.font = "20px Munro";
    canvas.fillText("Start Game", 195, 270);

    $(c).on('click', function(event) {
            x_coordinate = event.pageX - this.offsetLeft;
            y_coordinate = event.pageY - this.offsetTop;

            if (detectClickOnButton(x_coordinate, y_coordinate)) {
                    startGame();
            }
        }
    );
};

startScreen();


});
