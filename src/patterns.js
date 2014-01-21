Entropy.Engine.entity("PlayerShip", "Player|Moveable", {
    create: function (game, x, y) {
        var velocity = new Entropy.Vector([0, 0]);

        var sprite = new PIXI.Sprite(PIXI.TextureCache["PlayerShip"]);
        sprite.anchor.x = 0.53;
        sprite.anchor.y = 0.5;
        sprite.position.x = x;
        sprite.position.y = y;
        sprite.rotation = 0;
        sprite.tint = 0xFFFB00;

        game.stage.addChild(sprite);

        var stats = {

        };

        this.add("Position", x, y)
            .add("Velocity", velocity)
            .add("Sprite", sprite)
            .add("Rotation", new Entropy.Vector({length: 1, angle: 0}), 100)
            .add("Stats", {})
            .add("Level", {})
            .add("Weapon", 1, 1.5);
    }
});

Entropy.Engine.entity("PlayerGun", "PlayerGun", {
    create: function (game, x, y) {
        var sprite = new PIXI.Sprite(PIXI.TextureCache["PlayerGun"]);
        sprite.anchor.x = 0.25;
        sprite.anchor.y = 0.5;
        /*sprite.pivot.x = 0.1;
        sprite.pivot.y = 0.5;*/
        sprite.position.x = x;
        sprite.position.y = y;
        sprite.rotation = 0;
        sprite.tint = 0xFF00DD;

        game.stage.addChild(sprite);

        this.add("Position", x, y)
            .add("Sprite", sprite)
            .add("Rotation", new Entropy.Vector({length: 50, angle: 0}), 100);
            
    }
});

Entropy.Engine.entity("Bullet", "Bullets|Moveable", {
    create: function (game, x, y, angle, lifetime) {
        var velocity = new Entropy.Vector({length: 500, angle: angle});

        var sprite = new PIXI.Sprite(PIXI.TextureCache["Bullet"]);
        sprite.anchor.x = 0.5;
        sprite.anchor.y = 0.5;
        sprite.position.x = x;
        sprite.position.y = y;
        sprite.rotation = velocity.getRadAngle();

        game.stage.addChild(sprite);

        this.add("Position", x, y)
            .add("Velocity", velocity)
            .add("Sprite", sprite)
            .add("Rotation", new Entropy.Vector({length: 1, angle: angle}), 100)
            .add("Bullet", lifetime, 10);
    },
    remove: function (game) {
        game.stage.removeChild(this.components.sprite.sprite);
    }
});

Entropy.Engine.entity("BulletExplosion", "Emitters", {
    create: function (game, x, y, color) {
        var options = {
            ppf: 20,
            color: color || 0x00F2FF,
            lifetime: 200,
            particle_lifetime: 1000,
            length: 10,
            end_length: 1,
            end_alpha: 0.0,
            end_velocity: 0,
            velocity_from: 50,
            velocity_to: 150,
            length_easing: Entropy.Easing.Sine.In,
            velocity_easing: Entropy.Easing.Sine.In,
            alpha_easing: Entropy.Easing.Sine.In
        };

        this.add("Position", x, y)
            .add("ParticleEmitter", options);
    }
});

Entropy.Engine.entity("Particle", "Moveable|Particles", {
    create: function (game, x, y, angle, v, options) {
        var velocity = new Entropy.Vector({angle: angle, length: v});

        this.add("Position", x, y)
            .add("Velocity", velocity)
            .add("Particle", options);
    }
});

Entropy.Engine.entity("EngineFlame", "Emitters|Engines", {
    create: function (game, x, y, offset_x, offset_y, angle_from, angle_to) {

        var options = {
            ppf: 1,
            color: 0xFFFF00,
            lifetime: -1,
            particle_lifetime: 200,
            length: 5,
            angle_from: angle_from,
            angle_to: angle_to,
            end_length: 0,
            end_alpha: 0.2,
            end_velocity: 10,
            velocity_from: 50,
            velocity_to: 100,
            length_easing: Entropy.Easing.Cubic.Out,
            velocity_easing: Entropy.Easing.Cubic.Out,
            alpha_easing: Entropy.Easing.Quadratic.Out
        };

        this.add("Position", x, y, offset_x, offset_y)
            .add("ParticleEmitter", options, "eternal");
    }
});

Entropy.Engine.entity("Alien", "Moveable|Aliens", {
    create: function (game, radius, color, velocity) {
        var x, y;

        var v = new Entropy.Vector({
            length: velocity,
            angle: Math.round(Math.random() * 360)
        });

        if (v.angle <= 45 || v.angle > 315) {
            //left
            x = -radius;
            y = 100 + Math.random() * 400;    
        } else if (v.angle <= 135 && v.angle > 45) {
            //top
            x = 100 + Math.random() * 600;
            y = -radius;
        } else if (v.angle <= 225 && v.angle > 135) {
            //right
            x = Entropy.Game.WIDTH + radius;
            y = 100 + Math.random() * 400;
        } else if (v.angle <= 315 && v.angle > 225) {
            //bottom
            x = 100 + Math.random() * 600;
            y = Entropy.Game.HEIGHT + radius; 
        }

        var sprite = new PIXI.Sprite(PIXI.TextureCache["Alien"]);
        sprite.anchor.x = 0.5;
        sprite.anchor.y = 0.5;
        sprite.position.x = x;
        sprite.position.y = y;
        sprite.rotation = 0;
        sprite.tint = color;
        sprite.width = 2 * radius;
        sprite.height = 2 * radius;

        game.stage.addChild(sprite);
        
        this.add("Position", x, y, 0, 0, false)
            .add("Velocity", v)
            .add("Circle", radius, color)
            .add("Rotation", new Entropy.Vector({length: 1, angle: 0}))
            .add("Sprite", sprite);
    },
    remove: function (game) {
        //game.stage.removeChild(this.components.sprite.sprite);
    }
});

Entropy.Engine.entity("FollowingParticle", "Moveable|FollowingPlayer", {
    create: function (game, x, y, color) {

        var v = new Entropy.Vector({
            length: 400,
            angle: Math.round(Math.random() * 360)
        });

        this.add("Position", x, y, 0, 0, false)
            .add("Velocity", v)
            .add("Circle", 1, color);
    }
});