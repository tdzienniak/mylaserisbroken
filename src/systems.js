Entropy.Engine.System({
    name: "Render",
    initialize: function () {

        this.stage = this.game.stage;
        this.renderer = this.game.renderer;
    },
    update: function (delta, event) {
        this.renderer.render(this.stage);
    }
});

Entropy.Engine.System({
    name: "Motion",
    update: function (delta, event) {
        var moveable = this.game.engine.getFamily("Moveable");
        
        moveable.iterate(function (m, mc) {
            mc.position.x += delta / 1000 * mc.velocity.v.x;
            mc.position.y += delta / 1000 * mc.velocity.v.y;
        }, this);
    }
});

Entropy.Engine.System({
    name: "BoundingCollision",
    update: function (delta) {
        var es = this.game.engine.getEntitiesWith(["Position"]);
        var e;
        var b_i;

        for (var i = 0, max = es.length; i < max; i++) {
            e = es[i].components;
            b_i = e.position.boundings_interaction;

            if (b_i && e.position.x < 0) {
                e.position.x += Entropy.WIDTH;
            } else if (b_i && e.position.x > Entropy.WIDTH) {
                e.position.x -= Entropy.WIDTH;
            }

            if (b_i && e.position.y < 0) {
                e.position.y += Entropy.HEIGHT;
            } else if (b_i && e.position.y > Entropy.HEIGHT) {
                e.position.y -= Entropy.HEIGHT;
            }
        }
    }
});

Entropy.Engine.System({
    name: "SpritePosition",
    update: function (delta) {
        var es = this.game.engine.getEntitiesWith(["Sprite", "Position", "Rotation"]);
        var e;

        for (var i = 0, max = es.length; i < max; i++) {
            e = es[i].components;

            e.sprite.sprite.position.x = e.position.x;
            e.sprite.sprite.position.y = e.position.y;
            e.sprite.sprite.rotation = e.rotation.vector.getRadAngle(); 
        }
   }
});

Entropy.Engine.System({
    name: "PlayerShipSteering",
    update: function (delta) {
        var mouse_position = this.game.input.getMouseStagePosition();
        var player = this.game.engine.getFamily("Player").one().components;
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

Entropy.Engine.System({
    name: "PlayerShipControl",
    initialize: function () {
        this.acc = new Entropy.Vector({angle: 0, length: 10});
    },
    update: function (delta) {
        var player = this.game.engine.getFamily("Player").one().components;
        var pressedKeys = this.game.input.getPressedKeys();
        var max_speed = 250;

        if (pressedKeys["W"]) {
            player.velocity.v.add([0, -7]);
        } else if (pressedKeys["S"]) {
            player.velocity.v.add([0, 7]);
        }

        if (pressedKeys["A"]) {
            player.velocity.v.add([-7, 0]);
        } else if (pressedKeys["D"]) {
           player.velocity.v.add([7, 0]);
        }

        if (player.velocity.v.length > max_speed) {
            player.velocity.v.truncate(max_speed);
        }
    }
});

Entropy.Engine.System({
    name: "PlayerShipRotate",
    update: function (delta) {
        var mouse_position = this.game.input.getMouseStagePosition();
        var player = this.game.engine.getFamily("Player").one().components;
        var gun = this.game.engine.getFamily("PlayerGun").one().components;

        player.rotation.vector.setAngle(player.velocity.v.angle);
    }
});

Entropy.Engine.System({
    name: "PlayerGunPosition",
    update: function (delta) {
        var mouse_position = this.game.input.getMouseStagePosition();
        var player = this.game.engine.getFamily("Player").one().components;
        var gun = this.game.engine.getFamily("PlayerGun").one().components;

        gun.position.x = player.position.x;
        gun.position.y = player.position.y;

        var vector = new Entropy.Vector([mouse_position.x - player.position.x, mouse_position.y - player.position.y]);

        gun.rotation.vector.setAngle(vector.angle);
    }
});

Entropy.Engine.System({
    name: "Weapon",
    update: function (delta) {
        var player = this.engine.getFamily("Player").one().components;
        var gun = this.engine.getFamily("PlayerGun").one().components;
        var bullet_lifetime = player.stats.bullet_lifetime;
        var bullet_velocity = player.stats.bullet_velocity;
        var reload = 1000 / player.stats.rps;

        player.weapon.loading_progress += delta;

        if (player.weapon.loading_progress >= reload) {
            var x = player.position.x + gun.rotation.vector.x;
            var y = player.position.y + gun.rotation.vector.y;

            this.game.engine.create("Bullet", x, y, gun.rotation.vector.angle, bullet_lifetime, bullet_velocity);

            player.weapon.loading_progress = 0;
        }
    }
});

Entropy.Engine.System({
    name: "BulletLife",
    update: function (delta) {
        var bullets = this.engine.getFamily("Bullets");

        bullets.iterate(function (be, bc) {
            var b = bc.bullet;

            b.lived_so_far += delta;

            if (b.lived_so_far > b.lifetime) {
                this.engine.markForRemoval(be);
                this.engine.create("BulletExplosion", bc.position.x, bc.position.y);
            }
        }, this);
    }
});

Entropy.Engine.System({
    name: "EmitterController",
    update: function (delta) {
        var es = this.game.engine.getFamily("Emitters");
        var options = {};
        var angle, velocity;
        var emitter, cps;

        var node = es.head;
        while (node) {
            emitter = node.data.components.particleemitter;
            cps = node.data.components;

            options.lifetime = emitter.particle_lifetime;
            options.color = emitter.color;

            options.start_length = emitter.start_length;
            options.end_length = emitter.end_length;

            options.start_alpha = 1;            
            options.end_alpha = emitter.end_alpha;

            options.end_velocity = emitter.end_velocity;

            options.length_easing = emitter.length_easing;
            options.velocity_easing = emitter.velocity_easing;
            options.alpha_easing = emitter.alpha_easing;

            for (var i = 0; i < emitter.ppf; i += 1) {

                angle = emitter.angle_from + (Math.random() * (emitter.angle_to - emitter.angle_from));
                velocity = emitter.velocity_from + (Math.random() * (emitter.velocity_to - emitter.velocity_from));

                options.start_velocity = velocity;

                this.engine.create("Particle", cps.position.x, cps.position.y, angle, velocity, options);
            }

            //if emitter is not eternal
            if (emitter.lifetime !== -1) {
                emitter.lived_so_far += delta;

                if (emitter.lived_so_far > emitter.lifetime) {
                    this.engine.markForRemoval(node.data);
                }
            }

            node = node.next;
        }
    }
});

/*Entropy.Engine.System({
name: "ParticleRenderer", {
    initialize: function () {
        this.graphics = new PIXI.Graphics();

        this.game.stage.addChild(this.graphics);
    },
    update: function (delta) {
        window.performance.mark('render_start');
        var particles = this.engine.getFamily("Particles");
        var length;
        var cps;

        this.graphics.clear();

        var node = particles.head;
        while (node) {
            cps = node.data.components;

            length = cps.velocity.v.truncate(cps.particle.current_length, true);

            this.graphics.lineStyle(2, cps.particle.color, cps.particle.current_alpha);
            this.graphics.moveTo(cps.position.x, cps.position.y);
            this.graphics.lineTo(cps.position.x + length.x, cps.position.y + length.y);

            node = node.next;
        }

        window.performance.mark('render_end');

        window.performance.measure('render', 'render_start', 'render_end');
    }
});*/

Entropy.Engine.System({
    name: "ParticleRenderer",
    initialize: function () {
        this.graphics = new PIXI.Graphics();

        this.game.stage.addChild(this.graphics);
    },
    update: function (delta) {
        var particles = this.engine.getFamily("Particles");

        this.graphics.clear();

        particles.iterate(function (p, pc) {
            var length = pc.velocity.v.truncate(pc.particle.current_length, true);

            this.graphics.lineStyle(2, pc.particle.color, pc.particle.current_alpha);
            this.graphics.moveTo(pc.position.x, pc.position.y);
            this.graphics.lineTo(pc.position.x + length.x, pc.position.y + length.y);
        }, this);
    },
    remove: function () {
        this.game.stage.removeChild(this.graphics);
    }
});

Entropy.Engine.System({
    name: "ParticleController",
    update: function (delta) {
        var particles = this.engine.getFamily("Particles");
        var cps;
        var t, d, c;

        var node = particles.head;
        while (node) {
            cps = node.data.components;

            cps.particle.lived_so_far += delta;

            if (cps.particle.lived_so_far > cps.particle.lifetime) {
                this.engine.markForRemoval(node.data);
                
                //continue;
            }

            t = cps.particle.lived_so_far;
            d = cps.particle.lifetime;

            if (typeof cps.particle.alpha_easing === "function") {
                c = cps.particle.end_alpha - cps.particle.start_alpha;
                
                cps.particle.current_alpha = cps.particle.alpha_easing(t, cps.particle.start_alpha, c, d);
            }

            if (typeof cps.particle.length_easing === "function") {
                c = cps.particle.end_length - cps.particle.start_length;

                cps.particle.current_length = cps.particle.length_easing(t, cps.particle.start_length, c, d);
            }

            if (typeof cps.particle.velocity_easing === "function") {
                c = cps.particle.end_velocity - cps.particle.start_velocity;

                cps.velocity.v.truncate(cps.particle.velocity_easing(t, cps.particle.start_velocity, c, d));
            }

            node = node.next;
        }
    }
});


Entropy.Engine.System({
    name: "EngineController",
    update: function (delta) {
        var engines = this.engine.getFamily("Engines");
        var player = this.engine.getFamily("Player").one().components;

        var rotation_vector = player.rotation.vector.negate(true);

        engines.iterate(function (e, ec) {
            var vector = new Entropy.Vector([ec.position.offset_x, ec.position.offset_y]);
            vector.rotate(rotation_vector.angle);

            ec.position.x = player.position.x + vector.x;
            ec.position.y = player.position.y + vector.y;

            ec.particleemitter.angle_from = rotation_vector.angle - 45;
            ec.particleemitter.angle_to = rotation_vector.angle + 45;
        }, this);
    }
});

Entropy.Engine.System({
    name: "AlienBoundingsCollision",
    update: function (delta) {
        var aliens = this.engine.getFamily("Aliens");

        aliens.iterate(function (a, ac) {
            if (ac.position.x > 0 && 
                ac.position.x < Entropy.WIDTH && 
                ac.position.y > 0 && 
                ac.position.y < Entropy.HEIGHT) {

                ac.position.boundings_interaction = true;

            }
        }, this);
    }
});

Entropy.Engine.System({
    name: "LevelManagement",
    initialize: function () {
        this.points_field = $("#ui-points");
        this.level_field = $("#ui-level-name");
    },
    update: function (delta) {
        var player = this.game.engine.getFamily("Player").one().components;
        var level = this.game.engine.getFamily("Levels").one().components.level;

        this.points_field.html("Punkty: " + Math.round(player.stats.points, 2) + "/" + level.points_to_earn +
        "<br />Punkty stracone: " + player.stats.points_lost + "/" + level.loseable);

        if (player.stats.points >= level.points_to_earn) {
            this.game.pause();
            this.game.changeState("level_intro", level.next_lvl_title, level.next_lvl_subtitle, level.next_lvl_state);
        }

        if (player.stats.points_lost >= level.loseable) {
            this.game.changeState("gameover");
        }
    }
});


Entropy.Engine.System({
    name: "AlienSpawning",
    initialize: function () {
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

Entropy.Engine.System({
    name: "AlienAbsorbtion",
    update: function (delta) {
        var player = this.game.engine.getFamily("Player").one().components;
        var aliens = this.game.engine.getFamily("Aliens");

        aliens.iterate(function (a, ac) {
            var dist = distance(player.position.x, player.position.y, ac.position.x, ac.position.y);

            if (dist < 100) {
                var drain = delta / 1000 * player.stats.teleport_speed;
                ac.circle.radius -= drain;
                player.stats.points += drain;

                ac.sprite.sprite.width = 2 * ac.circle.radius;
                ac.sprite.sprite.height = 2 * ac.circle.radius;

                var p_x = ac.position.x - ac.circle.radius + Math.random() * (2 * ac.circle.radius);
                var p_y = ac.position.y - ac.circle.radius + Math.random() * (2 * ac.circle.radius);

                this.game.engine.create("FollowingParticle", p_x, p_y, 0x73FF00);
            }

            if (ac.circle.radius <= 0) {
                this.game.engine.markForRemoval(a);
            }
        }, this);
    }
});

Entropy.Engine.System({
    name: "AlienRotation",
    update: function (delta) {
        var player = this.game.engine.getFamily("Player").one().components;
        var aliens = this.game.engine.getFamily("Aliens");

        aliens.iterate(function (a, ac) {
            var vector = new Entropy.Vector([player.position.x - ac.position.x, player.position.y - ac.position.y]);

            ac.rotation.vector.setAngle(vector.angle);
        }, this);
    }
});

Entropy.Engine.System({
    name: "AlienRadius",
    initialize: function () {
        
    },
    beforeUpdate: function () {

    },
    update: function (delta) {
        
    },
    afterUpdate: function () {

    }
});

Entropy.Engine.System({
    name: "FollowingParticleController",
    update: function (delta) {
        var player = this.engine.getFamily("Player").one().components;
        var particles = this.engine.getFamily("FollowingPlayer");

        particles.iterate(function (p, pc) {
            if (distance(player.position.x, player.position.y, pc.position.x, pc.position.y) < 10) {
                this.game.engine.markForRemoval(p);
            } else {
                var vector = new Entropy.Vector([player.position.x - pc.position.x, player.position.y - pc.position.y]);

                pc.velocity.v.setAngle(vector.angle);
            }
        }, this);
    },
});


Entropy.Engine.System({
    name: "FollowingParticleRenderer",
    initialize: function () {
        this.graphics = new PIXI.Graphics();

        this.game.stage.addChild(this.graphics);
    },
    update: function (delta) {
        var es = this.engine.getFamily("FollowingPlayer");

        this.graphics.clear();

        es.iterate(function (e, c) {
            this.graphics.lineStyle(1, c.circle.color, 1);
            this.graphics.drawCircle(c.position.x, c.position.y, c.circle.radius);
        }, this);
    },
    remove: function () {
        this.game.stage.removeChild(this.graphics);
    }
});

Entropy.Engine.System({
    name: "AlienBulletCollision",
    update: function (delta) {
        var player = this.engine.getFamily("Player").one().components;
        var aliens = this.engine.getFamily("Aliens");
        var bullets = this.game.engine.getFamily("Bullets");

        bullets.iterate(function (b, bc) {
            aliens.iterate(function (a, ac) {
                var dist = distance(ac.position.x, ac.position.y, bc.position.x, bc.position.y);

                if (dist <= ac.circle.radius) {
                    ac.circle.radius -= 2;

                    this.engine.markForRemoval(b);

                    ac.sprite.sprite.width = 2 * ac.circle.radius;
                    ac.sprite.sprite.height = 2 * ac.circle.radius;
                    
                    player.stats.points_lost += 2;
                    //debugger;
                    this.engine.create("BulletExplosion", bc.position.x, bc.position.y, 0xFF002F);
                    aliens.breakIteration();
                }

                
                if (ac.circle.radius <= 0) {
                    this.game.engine.markForRemoval(a);

                    aliens.breakIteration();
                }
            }, this);
        }, this);
    }
});

Entropy.Engine.System({
    name: "PowerUpSpawning",
    initialize: function () {
        this.time_from_last_spawn = 0;
    },
    update: function (delta) {
        var level = this.engine.getFamily("Levels").one().components.level;

        if (this.time_from_last_spawn <= 0) {
            var type_num = Math.floor(Math.random() * level.available_powerups.length);

            var x = 50 + (Math.random() * (Entropy.WIDTH - 100));
            var y = 50 + (Math.random() * (Entropy.HEIGHT - 100));

            this.engine.create("PowerUp", x, y, level.available_powerups[type_num]);
            this.time_from_last_spawn = level.powerup_interval;
        } else {
            this.time_from_last_spawn -= delta;
        }
    }
});