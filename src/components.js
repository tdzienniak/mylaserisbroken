Entropy.Engine.component("Position", {
    init: function (x, y, offset_x, offset_y, boundings_interaction) {
        this.x = x;
        this.y = y;
        this.offset_x = offset_x || 0;
        this.offset_y = offset_y || 0;
        this.boundings_interaction = (typeof boundings_interaction !== "undefined") ? boundings_interaction : true;
    }
});

Entropy.Engine.component("Velocity", {
    init: function (v) {
        this.v = v;
    }
});

Entropy.Engine.component("Collision", {
    init: function (radius, mass) {
        this.radius = radius;
        this.mass = mass;
    }
});

Entropy.Engine.component("Circle", {
    init: function (radius, color) {
        this.radius = radius;
        this.color = color;
    }
});

Entropy.Engine.component("Stats", {
    init: function (options) {
        this.points = options.points || 0;
        this.aliens_harmed = options.aliens_harmed || 0;
        this.points_lost = options.points_lost || 0;
        this.teleport_speed = options.teleport_speed || 5;
        this.gun_damage = options.gun_damage || 5;
        this.bullet_lifetime = options.bullet_lifetime || 2;
        this.rps = options.rps  || 1; 
    }
});

Entropy.Engine.component("Sprite", {
    init: function (sprite) {
        this.sprite = sprite;
    }
});

Entropy.Engine.component("Rotation", {
    init: function (vector, by) {
        this.vector = vector;
        this.desired = vector.angle;
        this.by = by || 0;
    }
});

Entropy.Engine.component("Weapon", {
    init: function (rps, bullet_lifetime) {
        /*bullets per second*/
        this.rps = rps;
        this.reload = 1000 / rps;
        this.loading_progress = 0;
        this.bullet_lifetime = bullet_lifetime * 1000;
    }
});

Entropy.Engine.component("Bullet", {
    init: function (lifetime, damage) {
        this.lifetime = lifetime;
        this.lived_so_far = 0;
        this.damage = damage;
    }
});

Entropy.Engine.component("ParticleEmitter", {
    init: function (options) {

        this.ppf = options.ppf || 10; //particles per frame

        this.lifetime = options.lifetime || -1; //emitter lifetime
        this.lived_so_far = 0;

        this.particle_lifetime = options.particle_lifetime || 1000;

        this.color = options.color || 0xFFFFFF; //color of particles

        this.length = options.length || 8; //initial length of particles
        this.end_length = options.end_length || 8;

        this.velocity_from = options.velocity_from || 200;
        this.velocity_to = options.velocity_to || 250;
        this.end_velocity = options.end_velocity || 0;

        this.alpha = options.alpha || 1; //initial alpha of particles
        this.end_alpha = options.end_alpha || 0;

        this.angle_from = options.angle_from || 0;
        this.angle_to = options.angle_to || 360;

        this.length_easing = options.length_easing || "none";
        this.velocity_easing = options.velocity_easing || "none";
        this.alpha_easing = options.alpha_easing || "none";
    }
});

Entropy.Engine.component("Particle", {
    init: function (options) {
        this.lifetime = options.lifetime || 200;
        this.lived_so_far = 0;
        this.color = options.color || 0xffffff;
        this.alpha = options.alpha || 1;
        this.length = options.length || 5;
        this.velocity = options.velocity;
        this.end_length = options.end_length || 0;
        this.end_velocity = options.end_velocity || 0;
        this.end_alpha = options.end_alpha || 0;

        this.length_easing = options.length_easing || "none";
        this.velocity_easing = options.velocity_easing || "none";
        this.alpha_easing = options.alpha_easing || "none";
    }
});

Entropy.Engine.component("FollowingParticle", {
    init: function (color) {
        this.color = color;
        this.alpha = alpha || 1;
    }
});

Entropy.Engine.component("Level", {
    init: function (options) {
        this.name = options.name || "Poziom";
        this.points_to_earn = options.points_to_earn || 1000;
        this.loseable = options.loseable || 40;
    }
});