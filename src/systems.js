Entropy.Engine.system("Render", {
    init: function () {
        this.stage = this.game.stage;
        this.renderer = this.game.renderer;
    },
    update: function (delta, event) {
        this.renderer.render(this.stage);
    }
});

Entropy.Engine.system("Motion", {
    update: function (delta, event) {
        var es = this.game.engine.getFamily("Moveable");

        for (var i = 0, len = es.length; i < len; i++) {
            var e = es[i].components;
            
            e.position.x += delta / 1000 * e.velocity.v.x;
            e.position.y += delta / 1000 * e.velocity.v.y;
        }
    }
});

Entropy.Engine.system("BoundingCollision", {
    update: function (delta) {
        var es = this.game.engine.getEntitiesWith(["Position"]);
        var e;
        var b_i;

        for (var i = 0, max = es.length; i < max; i++) {
            e = es[i].components;
            b_i = e.position.boundings_interaction;

            if (b_i && e.position.x < 0) {
                e.position.x += Entropy.Game.WIDTH;
            } else if (b_i && e.position.x > Entropy.Game.WIDTH) {
                e.position.x -= Entropy.Game.WIDTH;
            }

            if (b_i && e.position.y < 0) {
                e.position.y += Entropy.Game.HEIGHT;
            } else if (b_i && e.position.y > Entropy.Game.HEIGHT) {
                e.position.y -= Entropy.Game.HEIGHT;
            }
        }
    }
});

Entropy.Engine.system("SpritePosition", {
   update: function (delta) {
        var es = this.game.engine.getEntitiesWith(["Sprite", "Position", "Rotation"]);
        var e;

        //debugger;

        for (var i = 0, max = es.length; i < max; i++) {
            e = es[i].components;

            e.sprite.sprite.position.x = e.position.x;
            e.sprite.sprite.position.y = e.position.y;
            e.sprite.sprite.rotation = e.rotation.vector.getRadAngle(); 
        }
   }
});

Entropy.Engine.system("PlayerShipSteering", {
    update: function (delta) {
        var mouse_position = this.game.input.getMouseStagePosition();
        var player = this.game.engine.getFamily("Player")[0].components;
        var max_speed = 250;

        var vector = new Entropy.Vector([mouse_position.x - player.position.x, mouse_position.y - player.position.y]);
        vector.truncate(15);

        player.velocity.v.add(vector);
        player.rotation.vector.setAngle(player.velocity.v.angle);

        if (player.velocity.v.length > max_speed) {
            player.velocity.v.truncate(max_speed);
        }
    }
});

Entropy.Engine.system("PlayerShipControl", {
    init: function () {
        this.acc = new Entropy.Vector({angle: 0, length: 10});
    },
    update: function (delta) {
        var player = this.game.engine.getFamily("Player")[0].components;
        var pressedKeys = this.game.input.getPressedKeys();
        var max_speed = 250;

        /*if (pressedKeys["W"]) {
            this.acc.setAngle(player.rotation.vector.angle);
            player.velocity.v.add(this.acc);
        }*/
        
        if (pressedKeys["W"]) {
            /*vector = player.velocity.v.truncate(5, true);
            player.velocity.v.add(vector);*/

            player.velocity.v.add([0, -7]);

        } else if (pressedKeys["S"]) {
            /*vector = player.velocity.v.truncate(5, true).negate();
            if (player.velocity.v.length > 5) {
                player.velocity.v.add(vector);
            } else {
                player.velocity.v.truncate(0);
            }*/
            player.velocity.v.add([0, 7]);
        }

        if (pressedKeys["A"]) {
            /*player.velocity.v.rotate(-2);*/
            player.velocity.v.add([-7, 0]);
        } else if (pressedKeys["D"]) {
           /* player.velocity.v.rotate(2);*/
           player.velocity.v.add([7, 0]);
        }

        if (player.velocity.v.length > max_speed) {
            player.velocity.v.truncate(max_speed);
        }
    }
});

Entropy.Engine.system("PlayerShipRotate", {
    update: function (delta) {
        var mouse_position = this.game.input.getMouseStagePosition();
        var player = this.game.engine.getFamily("Player")[0].components;
        var gun = this.game.engine.getFamily("PlayerGun")[0].components;

        player.rotation.vector.setAngle(player.velocity.v.angle);
    }
});

Entropy.Engine.system("PlayerGunPosition", {
    update: function (delta) {
        var mouse_position = this.game.input.getMouseStagePosition();
        var player = this.game.engine.getFamily("Player")[0].components;
        var gun = this.game.engine.getFamily("PlayerGun")[0].components;

        gun.position.x = player.position.x;
        gun.position.y = player.position.y;

        var vector = new Entropy.Vector([mouse_position.x - player.position.x, mouse_position.y - player.position.y]);

        gun.rotation.vector.setAngle(vector.angle);
    }
});

Entropy.Engine.system("Weapon", {
    update: function (delta) {
        var player = this.game.engine.getFamily("Player")[0].components;
        var gun = this.game.engine.getFamily("PlayerGun")[0].components;
        var bullet_lifetime = player.weapon.bullet_lifetime;
        var x, y;

        player.weapon.loadingProgress += delta;// * player.weapon.gain;

        if (player.weapon.loadingProgress >= player.weapon.reload) {
            x = player.position.x + gun.rotation.vector.x;
            y = player.position.y + gun.rotation.vector.y;

            this.game.engine.create("Bullet", x, y, gun.rotation.vector.angle, bullet_lifetime);

            player.weapon.loadingProgress = 0;
        }
    }
});

Entropy.Engine.system("BulletLife", {
    update: function (delta) {
        var bullets = this.game.engine.getFamily("Bullets");
        var b;

        for (var i = 0, max = bullets.length; i < max; i += 1) {
            b = bullets[i].components.bullet;

            if (b.lived_so_far > b.lifetime) {
                this.game.engine.markForRemoval(bullets[i]);

                this.game.engine.create("BulletExplosion", bullets[i].components.position.x, bullets[i].components.position.y);
            } else {
                b.lived_so_far += delta;
            }
        }
    }
});

Entropy.Engine.system("EmitterController", {
    update: function (delta) {
        var es = this.game.engine.getFamily("Emitters");
        var e;
        var emitter;
        var options = {};
        var angle;
        var velocity;

        for (var i = 0, max = es.length; i < max; i++) {
            e = es[i].components;
            emitter = e.particleemitter;

            options.lifetime = emitter.particle_lifetime;
            options.color = emitter.color;
            options.alpha = 1;
            options.length = emitter.length;
            options.end_length = emitter.end_length;
            options.end_alpha = emitter.end_alpha;
            options.end_velocity = emitter.end_velocity;

            options.length_easing = emitter.length_easing;
            options.velocity_easing = emitter.velocity_easing;
            options.alpha_easing = emitter.alpha_easing;

            for (var j = 0; j < emitter.ppf; j++) {

                angle = emitter.angle_from + (Math.random() * (emitter.angle_to - emitter.angle_from));
                velocity = emitter.velocity_from + (Math.random() * (emitter.velocity_to - emitter.velocity_from));

                options.velocity = velocity;


                this.game.engine.create("Particle", e.position.x, e.position.y, angle, velocity, options);
            }

            if (emitter.lifetime !== 0) {
                emitter.lived_so_far += delta;
            }

            if (emitter.lived_so_far > emitter.lifetime) {
                this.game.engine.markForRemoval(es[i]);
            }
        }
    }
});

Entropy.Engine.system("ParticleRenderer", {
    init: function () {
        this.graphics = new PIXI.Graphics();

        this.game.stage.addChild(this.graphics);
    },
    update: function (delta) {
        var es = this.game.engine.getFamily("Particles");
        var e;
        var length;
        var alpha;
        var t;
        var d;
        var c;

        this.graphics.clear();

        for (var i = 0, max = es.length; i < max; i++) {
            e = es[i].components;
            t = e.particle.lived_so_far;
            d = e.particle.lifetime;

            //console.log(e.particle.alpha_easing);
            if (typeof e.particle.alpha_easing === "function") {
                c = e.particle.end_alpha - e.particle.alpha;
                
                alpha = e.particle.alpha_easing(t, e.particle.alpha, c, d);
            } else {
                alpha = e.particle.alpha;
            }

            if (typeof e.particle.length_easing === "function") {
                c = e.particle.end_length - e.particle.length;

                length = e.particle.length_easing(t, e.particle.length, c, d);
            } else {
                length = e.particle.length;
            }

            length = e.velocity.v.truncate(length, true);

            /*this.graphics.beginFill();*/
            this.graphics.lineStyle(2, e.particle.color, alpha);
            this.graphics.moveTo(e.position.x, e.position.y);
            this.graphics.lineTo(e.position.x + length.x, e.position.y + length.y);
            /*this.graphics.endFill();*/
        }
    }
});

Entropy.Engine.system("ParticleController", {
    update: function (delta) {
        var es = this.game.engine.getFamily("Particles");
        var e;
        var velocity;
        var t;
        var d;

        for (var i = 0, max = es.length; i < max; i++) {
            e = es[i].components;
            t = e.particle.lived_so_far;
            d = e.particle.lifetime;

            e.particle.lived_so_far += delta;

            if (e.particle.lived_so_far > e.particle.lifetime) {
                this.game.engine.markForRemoval(es[i]);

                continue;
            }

            if (e.particle.velocity_easing !== "none") {
                c = e.particle.end_velocity - e.particle.velocity;

                e.velocity.v.truncate(e.particle.velocity_easing(t, e.particle.velocity, c, d));
            }
        }
    }
});


Entropy.Engine.system("EngineController", {
    update: function (delta) {
        var engines = this.game.engine.getFamily("Engines");
        var player = this.game.engine.getFamily("Player")[0].components;
        var engine;
        var vector;

        var rotation_vector = player.rotation.vector.negate(true);

        for (var i = 0, max = engines.length; i < max; i++) {
            engine = engines[i].components;

            vector = new Entropy.Vector([engine.position.offset_x, engine.position.offset_y]);
            vector.rotate(rotation_vector.angle);

            engine.position.x = player.position.x + vector.x;
            engine.position.y = player.position.y + vector.y;

            engine.particleemitter.angle_from = rotation_vector.angle - 45;
            engine.particleemitter.angle_to = rotation_vector.angle + 45;
        }
    }
});

Entropy.Engine.system("AlienRenderer", {
    init: function () {
        /*this.graphics = new PIXI.Graphics();

        this.game.stage.addChild(this.graphics);*/
    },
    update: function (delta) {
        var es = this.game.engine.getFamily("Aliens");

        //this.graphics.clear();

        for (var i = 0, max = es.length; i < max; i++) {
            e = es[i].components;

            if (e.position.x > 0 && 
                e.position.x < Entropy.Game.WIDTH && 
                e.position.y > 0 && 
                e.position.y < Entropy.Game.HEIGHT) {
                e.position.boundings_interaction = true;
            }

            /*this.graphics.beginFill();*/
            /*this.graphics.beginFill(e.circle.color);*/
            /*this.graphics.lineStyle(2, 0xffffff, 1);
            this.graphics.drawCircle(e.position.x, e.position.y, e.circle.radius);*/

            /*this.graphics.endFill();*/
        }
    }
});

Entropy.Engine.system("LevelManagement", {
    init: function () {
        /*this.text = new PIXI.Text();
        this.text.setStyle();
        this.text.x = 10;
        this.text.y = 10;

        this.game.stage.addChild(this.text);*/
        this.points = $("#ui-points");
        this.level = $("#ui-level-name");
    },
    update: function (delta) {
        var player = this.game.engine.getFamily("Player")[0].components;

        this.points.html("Punkty: " + Math.round(player.stats.points, 2) + "/" + player.level.points_to_earn +
        "<br />Punkty stracone: " + player.stats.points_lost + "/" + player.level.max_points_to_lose);

        if (player.stats.points >= player.level.points_to_earn) {
            this.game.changeState("win");
        }

        if (player.stats.points_lost >= player.level.max_points_to_lose) {
            this.game.changeState("gameover");
        }
    }
});

Entropy.Engine.system("AlienBulletCollision", {
    update: function (delta) {
        var player = this.game.engine.getFamily("Player")[0].components;
        var aliens = this.game.engine.getFamily("Aliens");
        var bullets = this.game.engine.getFamily("Bullets");
        var a, b;

        for (var j = 0, max2 = bullets.length; j < max2; j++) {
            b = bullets[j].components;

            for (var i = 0, max = aliens.length; i < max; i++) {
                a = aliens[i].components;

                var dist = distance(a.position.x, a.position.y, b.position.x, b.position.y);

                if (dist <= a.circle.radius) {
                    a.circle.radius -= 2;
                    this.game.engine.markForRemoval(bullets[j]);

                    a.sprite.sprite.width = 2 * a.circle.radius;
                    a.sprite.sprite.height = 2 * a.circle.radius;
                    
                    player.stats.points_lost += 2;

                    this.game.engine.create("BulletExplosion", b.position.x, b.position.y, 0xFF002F);

                    break;
                }

                if (a.circle.radius <= 0) {
                    this.game.engine.markForRemoval(aliens[i]);

                    break;
                }
            }
        }
    }
});

Entropy.Engine.system("AlienSpawning", {
    init: function () {
        this.spawning_time = 7000;
        this.elapsed = 0;
    },
    update: function (delta) {
        this.elapsed += delta;

        if (this.elapsed >= this.spawning_time) {
            var radius = 25 + Math.random() * 27.5;
            this.game.engine.create("Alien", radius, Math.floor(Math.random()*16777215), 100 + Math.random() * 50);

            this.elapsed = 0;
        }
    }
});

Entropy.Engine.system("AlienAbsorbtion", {
    update: function (delta) {
        var player = this.game.engine.getFamily("Player")[0].components;
        var aliens = this.game.engine.getFamily("Aliens");
        var a;
        var dist;
        var p_x, p_y;

        for (var i = 0, max = aliens.length; i < max; i++) {
            a = aliens[i].components;

            dist = distance(player.position.x, player.position.y, a.position.x, a.position.y);

            if (dist < 100) {
                a.circle.radius -= 0.2;
                player.stats.points += 0.2;

                a.sprite.sprite.width = 2 * a.circle.radius;
                a.sprite.sprite.height = 2 * a.circle.radius;

                p_x = a.position.x - a.circle.radius + Math.random() * (2 * a.circle.radius);
                p_y = a.position.y - a.circle.radius + Math.random() * (2 * a.circle.radius);

                this.game.engine.create("FollowingParticle", p_x, p_y, 0x73FF00);
            }

            if (a.circle.radius <= 0) {
                this.game.engine.markForRemoval(aliens[i]);
            }
        }
    }
});

Entropy.Engine.system("AlienRotation", {
    update: function (delta) {
        var player = this.game.engine.getFamily("Player")[0].components;
        var aliens = this.game.engine.getFamily("Aliens");
        var a;
        var vector;

        for (var i = 0, max = aliens.length; i < max; i++) {
            a = aliens[i].components;

            vector = new Entropy.Vector([player.position.x - a.position.x, player.position.y - a.position.y]);

            a.rotation.vector.setAngle(vector.angle);
        }
    }
});

Entropy.Engine.system("AlienRadius", {
    init: function () {
        
    },
    beforeUpdate: function () {

    },
    update: function (delta) {
        
    },
    afterUpdate: function () {

    }
});

Entropy.Engine.system("FollowingParticleController", {
    update: function (delta) {
        var player = this.game.engine.getFamily("Player")[0].components;
        var particles = this.game.engine.getFamily("FollowingPlayer");
        var p;
        var vector;

        for (var i = 0, max = particles.length; i < max; i++) {
            p = particles[i].components;

            if (distance(player.position.x, player.position.y, p.position.x, p.position.y) < 10) {
                this.game.engine.markForRemoval(particles[i]);
            } else {
                vector = new Entropy.Vector([player.position.x - p.position.x, player.position.y - p.position.y]);

                p.velocity.v.setAngle(vector.angle);
            }
        }
    },
});

Entropy.Engine.system("FollowingParticleRenderer", {
    init: function () {
        this.graphics = new PIXI.Graphics();

        this.game.stage.addChild(this.graphics);
    },
    beforeUpdate: function () {

    },
    update: function (delta) {
        var es = this.game.engine.getFamily("FollowingPlayer");

        this.graphics.clear();

        for (var i = 0, max = es.length; i < max; i++) {
            e = es[i].components;

            /*this.graphics.beginFill();*/
            /*this.graphics.beginFill(e.circle.color);*/
            this.graphics.lineStyle(1, e.circle.color, 1);
            this.graphics.drawCircle(e.position.x, e.position.y, e.circle.radius);

            /*this.graphics.endFill();*/
        }
    },
    afterUpdate: function () {

    }
});