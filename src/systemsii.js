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
        var c;

        var node = es.head;
        while (node) {
            c = node.data.components;

            c.position.x += delta / 1000 * c.velocity.v.x;
            c.position.y += delta / 1000 * c.velocity.v.y;
            
            node = node.next;
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
            //debugger;
            e.sprite.sprite.position.x = e.position.x;
            e.sprite.sprite.position.y = e.position.y;
            e.sprite.sprite.rotation = e.rotation.vector.getRadAngle(); 
        }
   }
});

Entropy.Engine.system("PlayerShipSteering", {
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

Entropy.Engine.system("PlayerShipControl", {
    init: function () {
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

Entropy.Engine.system("PlayerShipRotate", {
    update: function (delta) {
        var mouse_position = this.game.input.getMouseStagePosition();
        var player = this.game.engine.getFamily("Player").one().components;
        var gun = this.game.engine.getFamily("PlayerGun").one().components;

        player.rotation.vector.setAngle(player.velocity.v.angle);
    }
});

Entropy.Engine.system("PlayerGunPosition", {
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

Entropy.Engine.system("Weapon", {
    update: function (delta) {
        var player = this.engine.getFamily("Player").one().components;
        var gun = this.engine.getFamily("PlayerGun").one().components;
        var bullet_lifetime = player.weapon.bullet_lifetime;
        var x, y;

        player.weapon.loading_progress += delta;// * player.weapon.gain;

        if (player.weapon.loading_progress >= player.weapon.reload) {
            x = player.position.x + gun.rotation.vector.x;
            y = player.position.y + gun.rotation.vector.y;

            this.game.engine.create("Bullet", x, y, gun.rotation.vector.angle, bullet_lifetime);

            player.weapon.loading_progress = 0;
        }
    }
});

Entropy.Engine.system("BulletLife", {
    update: function (delta) {
        var bullets = this.engine.getFamily("Bullets");

        var node = bullets.head;
        while (node) {
            var b = node.data.components.bullet;
            var bc = node.data.components;

            //debugger;

            b.lived_so_far += delta;

            if (b.lived_so_far > b.lifetime) {
                this.engine.markForRemoval(node.data);
                //debugger;
                this.engine.create("BulletExplosion", bc.position.x, bc.position.y);
            }

            node = node.next;
        }
    }
});

Entropy.Engine.system("EmitterController", {
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
            options.alpha = 1;
            options.length = emitter.length;
            options.end_length = emitter.end_length;
            options.end_alpha = emitter.end_alpha;
            options.end_velocity = emitter.end_velocity;

            options.length_easing = emitter.length_easing;
            options.velocity_easing = emitter.velocity_easing;
            options.alpha_easing = emitter.alpha_easing;

            for (var i = 0; i < emitter.ppf; i += 1) {

                angle = emitter.angle_from + (Math.random() * (emitter.angle_to - emitter.angle_from));
                velocity = emitter.velocity_from + (Math.random() * (emitter.velocity_to - emitter.velocity_from));

                options.velocity = velocity;

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

Entropy.Engine.system("ParticleRenderer", {
    init: function () {
        this.graphics = new PIXI.Graphics();

        this.game.stage.addChild(this.graphics);
    },
    update: function (delta) {
        var particles = this.engine.getFamily("Particles");
        var t, d, c;
        var alpha, length;
        var cps;

        this.graphics.clear();

        var node = particles.head;
        while (node) {
            cps = node.data.components;

            t = cps.particle.lived_so_far;
            d = cps.particle.lifetime;

            if (typeof cps.particle.alpha_easing === "function") {
                c = cps.particle.end_alpha - cps.particle.alpha;
                
                alpha = cps.particle.alpha_easing(t, cps.particle.alpha, c, d);
            } else {
                alpha = cps.particle.alpha;
            }

            if (typeof cps.particle.length_easing === "function") {
                c = cps.particle.end_length - cps.particle.length;

                length = cps.particle.length_easing(t, cps.particle.length, c, d);
            } else {
                length = cps.particle.length;
            }

            length = cps.velocity.v.truncate(length, true);

            this.graphics.lineStyle(2, cps.particle.color, alpha);
            this.graphics.moveTo(cps.position.x, cps.position.y);
            this.graphics.lineTo(cps.position.x + length.x, cps.position.y + length.y);

            node = node.next;
        }
    }
});

Entropy.Engine.system("ParticleController", {
    update: function (delta) {
        var particles = this.engine.getFamily("Particles");
        var cps;

        var node = particles.head;
        while (node) {
            cps = node.data.components;

            cps.particle.lived_so_far += delta;

            if (cps.particle.lived_so_far > cps.particle.lifetime) {
                this.engine.markForRemoval(node.data);
                //debugger;
                //continue;
            }

            if (cps.particle.velocity_easing !== "none") {
                var t = cps.particle.lived_so_far;
                var d = cps.particle.lifetime;
                var c = cps.particle.end_velocity - cps.particle.velocity;

                cps.velocity.v.truncate(cps.particle.velocity_easing(t, cps.particle.velocity, c, d));
            }

            node = node.next;
        }
    }
});


Entropy.Engine.system("EngineController", {
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

Entropy.Engine.system("AlienBoundingsCollision", {
    update: function (delta) {
        var aliens = this.engine.getFamily("Aliens");

        aliens.iterate(function (a, ac) {
            if (ac.position.x > 0 && 
                ac.position.x < Entropy.Game.WIDTH && 
                ac.position.y > 0 && 
                ac.position.y < Entropy.Game.HEIGHT) {

                ac.position.boundings_interaction = true;

            }
        }, this);
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
        var player = this.game.engine.getFamily("Player").one().components;

        this.points.html("Punkty: " + Math.round(player.stats.points, 2) + "/" + player.level.points_to_earn +
        "<br />Punkty stracone: " + player.stats.points_lost + "/" + player.level.loseable);

        if (player.stats.points >= player.level.points_to_earn) {
            this.game.changeState("win");
        }

        if (player.stats.points_lost >= player.level.loseable) {
            this.game.changeState("gameover");
        }
    }
});

// Entropy.Engine.system("AlienBulletCollision", {
//     update: function (delta) {
//         var player = this.game.engine.getFamily("Player")[0].components;
//         var aliens = this.game.engine.getFamily("Aliens");
//         var bullets = this.game.engine.getFamily("Bullets");
//         var a, b;

//         for (var j = 0, max2 = bullets.length; j < max2; j++) {
//             b = bullets[j].components;

//             for (var i = 0, max = aliens.length; i < max; i++) {
//                 a = aliens[i].components;

//                 var dist = distance(a.position.x, a.position.y, b.position.x, b.position.y);

//                 if (dist <= a.circle.radius) {
//                     a.circle.radius -= 2;
//                     this.game.engine.markForRemoval(bullets[j]);

//                     a.sprite.sprite.width = 2 * a.circle.radius;
//                     a.sprite.sprite.height = 2 * a.circle.radius;
                    
//                     player.stats.points_lost += 2;

//                     this.game.engine.create("BulletExplosion", b.position.x, b.position.y, 0xFF002F);

//                     break;
//                 }

//                 if (a.circle.radius <= 0) {
//                     this.game.engine.markForRemoval(aliens[i]);

//                     break;
//                 }
//             }
//         }
//     }
// });

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

                //this.game.engine.create("FollowingParticle", p_x, p_y, 0x73FF00);
            }

            if (ac.circle.radius <= 0) {
                this.game.engine.markForRemoval(a);
            }
        }, this);
    }
});

Entropy.Engine.system("AlienRotation", {
    update: function (delta) {
        var player = this.game.engine.getFamily("Player").one().components;
        var aliens = this.game.engine.getFamily("Aliens");

        aliens.iterate(function (a, ac) {
            var vector = new Entropy.Vector([player.position.x - ac.position.x, player.position.y - ac.position.y]);

            ac.rotation.vector.setAngle(vector.angle);
        }, this);
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
        var player = this.engine.getFamily("Player").one().components;
        var particles = this.engine.getFamily("FollowingPlayer");

        particles.iterate(function (p, cps) {
            if (distance(player.position.x, player.position.y, pc.position.x, pc.position.y) < 10) {
                this.game.engine.markForRemoval(p);
            } else {
                var vector = new Entropy.Vector([player.position.x - pc.position.x, player.position.y - pc.position.y]);

                pc.velocity.v.setAngle(vector.angle);
            }
        }, this);
    },
});

// Entropy.Engine.system("FollowingParticleRenderer", {
//     init: function () {
//         this.graphics = new PIXI.Graphics();

//         this.game.stage.addChild(this.graphics);
//     },
//     beforeUpdate: function () {

//     },
//     update: function (delta) {
//         var es = this.game.engine.getFamily("FollowingPlayer");

//         this.graphics.clear();

//         for (var i = 0, max = es.length; i < max; i++) {
//             e = es[i].components;

//             /*this.graphics.beginFill();*/
//             /*this.graphics.beginFill(e.circle.color);*/
//             this.graphics.lineStyle(1, e.circle.color, 1);
//             this.graphics.drawCircle(e.position.x, e.position.y, e.circle.radius);

//             /*this.graphics.endFill();*/
//         }
//     },
//     afterUpdate: function () {

//     }
// });

Entropy.Engine.system("FollowingParticleRenderer", {
    init: function () {
        this.graphics = new PIXI.Graphics();

        this.game.stage.addChild(this.graphics);
    },
    update: function (delta) {
        var es = this.game.engine.getFamily("FollowingPlayer");

        this.graphics.clear();

        es.iterate(function (e, c) {
            this.graphics.lineStyle(1, c.circle.color, 1);
            this.graphics.drawCircle(c.position.x, c.position.y, c.circle.radius);
        }, this);
    }
});

Entropy.Engine.system("AlienBulletCollision", {
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
                    debugger;
                    //this.engine.create("BulletExplosion", bc.position.x, bc.position.y, 0xFF002F);
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