Entropy.Engine.Component({
    name: "Position",
    initialize: function (x, y, offset_x, offset_y, boundings_interaction) {
        this.x = x;
        this.y = y;
        this.offset_x = offset_x || 0;
        this.offset_y = offset_y || 0;
        this.boundings_interaction = (typeof boundings_interaction !== "undefined") ? boundings_interaction : true;
    }
});

Entropy.Engine.Component({
    name: "Velocity",
    initialize: function (v) {
        this.v = v;
    }
});

Entropy.Engine.Component({
    name: "Collision",
    initialize: function (radius, mass) {
        this.radius = radius;
        this.mass = mass;
    }
});

Entropy.Engine.Component({
    name: "Circle",
    initialize: function (radius, color) {
        this.radius = radius;
        this.color = color;
    }
});



Entropy.Engine.Component({
    name: "Sprite",
    initialize: function (sprite) {
        this.sprite = sprite;
    }
});

Entropy.Engine.Component({
    name: "Rotation",
    initialize: function (vector, by) {
        this.vector = vector;
        this.desired = vector.angle;
        this.by = by || 0;
    }
});

Entropy.Engine.Component({
    name: "Weapon",
    initialize: function (rps, bullet_lifetime) {
        /*bullets per second*/
        this.rps = rps;
        this.reload = 1000 / rps;
        this.loading_progress = 0;
        this.bullet_lifetime = bullet_lifetime * 1000;
    }
});

Entropy.Engine.Component({
    name: "Bullet",
    initialize: function (lifetime, damage) {
        this.lifetime = lifetime;
        this.lived_so_far = 0;
        this.damage = damage;
    }
});

Entropy.Engine.Component({
    name: "ParticleEmitter",
    initialize: function (options) {

        this.ppf = options.ppf || 10; //particles per frame

        this.lifetime = options.lifetime || -1; //emitter lifetime
        this.lived_so_far = 0;

        this.particle_lifetime = options.particle_lifetime || 1000;

        this.color = options.color || 0xFFFFFF; //color of particles

        this.start_length = options.start_length || 8; //initial length of particles
        this.end_length = options.end_length || 8;

        this.velocity_from = options.velocity_from || 200;
        this.velocity_to = options.velocity_to || 250;

        this.start_velocity = options.start_velocity || 500;
        this.end_velocity = options.end_velocity || 0;

        this.start_alpha = options.alpha || 1; //initial alpha of particles
        this.end_alpha = options.end_alpha || 0;

        this.angle_from = options.angle_from || 0;
        this.angle_to = options.angle_to || 360;

        this.length_easing = options.length_easing || "none";
        this.velocity_easing = options.velocity_easing || "none";
        this.alpha_easing = options.alpha_easing || "none";
    }
});

Entropy.Engine.Component({
    name: "Particle",
    initialize: function (options) {
        this.lifetime = options.lifetime || 200;
        this.lived_so_far = 0;

        this.color = options.color || 0xffffff;

        this.start_alpha = options.start_alpha || 1;
        this.end_alpha = options.end_alpha || 0;
        this.current_alpha = this.start_alpha;

        this.start_length = options.start_length || 5;
        this.end_length = options.end_length || 0;
        this.current_length = this.start_length;

        this.start_velocity = options.start_velocity || 500;
        this.end_velocity = options.end_velocity || 0;

        this.length_easing = options.length_easing || "none";
        this.velocity_easing = options.velocity_easing || "none";
        this.alpha_easing = options.alpha_easing || "none";
    }
});

Entropy.Engine.Component({
    name: "FollowingParticle",
    initialize: function (color) {
        this.color = color;
        this.alpha = alpha || 1;
    }
});

Entropy.Engine.Component({
    name: "Stats",
    initialize: function (options) {
        this.points = options.points || 0;
        this.aliens_harmed = options.aliens_harmed || 0;
        this.points_lost = options.points_lost || 0;

        this.teleport_speed = options.teleport_speed || 5;
        this.initial_teleport_speed = this.teleport_speed;

        this.gun_damage = options.gun_damage || 5;
        this.initial_gun_damage = this.gun_damage;

        this.bullet_lifetime = options.bullet_lifetime || 2;
        this.initial_bullet_lifetime = this.bullet_lifetime;

        this.rps = options.rps || 1;
        this.initial_rps = this.rps;

        this.bullet_velocity = options.bullet_velocity || 500;
        this.initial_bullet_velocity = this.bullet_velocity;
    }
});

Entropy.Engine.Component({
    name: "Level",
    initialize: function (options) {
        this.lvl_name = options.name || "Poziom";
        this.next_lvl_state = options.next_lvl_state || "gameover";
        this.next_lvl_title = options.next_lvl_title || "dummy";
        this.next_lvl_subtitle = options.next_lvl_subtitle || "dummy";
        this.points_to_earn = options.points_to_earn || 1000;
        this.loseable = options.loseable || 6;
        this.available_powerups = options.available_powerups || [];
        this.powerup_interval = options.powerup_interval || 10000;
    }
});

Entropy.Engine.Component({
    name: "BulletDamagePowerUp",
    initialize: function (percent, duration) {
        this.percent = percent || 0.5;
        this.duration = duration || 5000;
        this.lifetime = lifetime || 10000;
        this.lived_so_far = 0;
    }
});

Entropy.Engine.Component({
    name: "TeleportSpeedPowerUp",
    initialize: function (percent, duration) {
        this.percent = percent || 1.5;
        this.duration = duration || 5000;
        this.lifetime = lifetime || 10000;
        this.lived_so_far = 0;
    }
});

Entropy.Engine.Component({
    name: "BulletLifetimePowerUp",
    initialize: function (percent, duration) {
        this.percent = percent || 0.7;
        this.duration = duration || 5000;
        this.lifetime = lifetime || 10000;
        this.lived_so_far = 0;
    }
});

Entropy.Engine.Component({
    name: "BulletVelocityPowerUp",
    initialize: function (percent, duration) {
        this.percent = percent || 0.7;
        this.duration = duration || 5000;
        this.lifetime = lifetime || 10000;
        this.lived_so_far = 0;
    }
});

Entropy.Engine.Component({
    name: "RPSPowerUp",
    initialize: function (percent, duration, lifetime) {
        this.percent = percent || 0.7;
        this.duration = duration || 5000;
        this.lifetime = lifetime || 10000;
        this.lived_so_far = 0;
    }
});

Entropy.Engine.Component({
    name: "PowerUp",
    initialize: function (type, percent, duration, lifetime) {
        

        return this;
    }
});