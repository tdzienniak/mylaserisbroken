Entropy.Game.State({
    name: "level1gameplay",
    onEnter: function (game, done) {
        this.screen = $("#game-screen");

        var player_x = Entropy.WIDTH / 2;
        var player_y = Entropy.HEIGHT / 2;

        var level = {
            lvl_name: "Poziom 1",
            next_lvl_state: "level2",
            next_lvl_title: "Poziom 2",
            next_lvl_subtitle: "\"Niech moc będzie z tobą!\"",
            points_to_earn: 10,
            loseable: 40
        };

        var stats = {
            bullet_lifetime: 2000,
            rps: 1.5
        };

        //compose player ship
        game.engine.create("PlayerShip", player_x, player_y, stats);
        game.engine.create("PlayerGun", player_x, player_y);
        game.engine.create("EngineFlame", player_x, player_y, 23, -3, 0, 90);
        game.engine.create("EngineFlame", player_x, player_y, 23, 3, 0, 90);
        game.engine.create("Level", level);

        //prepare game systems
        /** rendering systems **/
        game.engine.addSystem("FollowingParticleRenderer", 2);
        game.engine.addSystem("ParticleRenderer", 2);

        game.engine.addSystem("Render", 3);
        
        game.engine.addSystem("LevelManagement", 3);
        
        game.engine.addSystem("Motion", 4);

        game.engine.addSystem("BoundingCollision", 4);
        game.engine.addSystem("AlienBoundingsCollision", 4);

        game.engine.addSystem("PlayerShipControl", 4);
        game.engine.addSystem("PlayerShipRotate", 4);
        game.engine.addSystem("PlayerGunPosition", 4);

        game.engine.addSystem("SpritePosition", 4);
        
        game.engine.addSystem("Weapon", 4);
        game.engine.addSystem("BulletLife", 4);

        game.engine.addSystem("FollowingParticleController", 4);

        game.engine.addSystem("EmitterController", 4);
        game.engine.addSystem("ParticleController", 4);
        game.engine.addSystem("EngineController", 4);

        game.engine.addSystem("AlienSpawning", 4);
        game.engine.addSystem("AlienBulletCollision", 4);
        game.engine.addSystem("AlienAbsorbtion", 4);
        game.engine.addSystem("AlienRotation", 4);

        this.screen.fadeIn(500, function () {
            game.start();
            done();    
        });
    },
    onExit: function (game, done) {
        game.engine.clear();
        this.screen.fadeOut(500, function () {
            done();
        });
    },
    transitions: {
        
    }
});

Entropy.Game.State({
    name: "level2gameplay",
    onEnter: function (game, done) {
        this.screen = $("#game-screen");

        var player_x = Entropy.WIDTH / 2;
        var player_y = Entropy.HEIGHT / 2;

        var level = {
            lvl_name: "Poziom 1",
            next_lvl_state: "level2",
            next_lvl_title: "Poziom 2",
            next_lvl_subtitle: "\"Niech moc będzie z tobą!\"",
            points_to_earn: 100,
            loseable: 40,
            available_powerups: [
                {
                    type: "RPSPowerUp",
                    percent: 0.5,
                    duration: 7000,
                    lifetime: 7000
                }
            ]
        };

        var stats = {
            bullet_lifetime: 2000,
            rps: 1.5
        };

        //compose player ship
        game.engine.create("PlayerShip", player_x, player_y, stats);
        game.engine.create("PlayerGun", player_x, player_y);
        game.engine.create("EngineFlame", player_x, player_y, 23, -3, 0, 90);
        game.engine.create("EngineFlame", player_x, player_y, 23, 3, 0, 90);
        game.engine.create("Level", level);

        //prepare game systems
        game.engine.addSystems(
            ["FollowingParticleRenderer", 2],
            ["ParticleRenderer", 2],

            ["Render", 3],

            ["LevelManagement", 3],

            ["Motion", 4],

            ["BoundingCollision", 4],
            ["AlienBoundingsCollision", 4],

            ["PlayerShipControl", 4],
            ["PlayerShipRotate", 4],
            ["PlayerGunPosition", 4],

            ["SpritePosition", 4],

            ["Weapon", 4],
            ["BulletLife", 4],

            ["FollowingParticleController", 4],

            ["EmitterController", 4],
            ["ParticleController", 4],
            ["EngineController", 4],

            ["AlienSpawning", 4],
            ["AlienBulletCollision", 4],
            ["AlienAbsorbtion", 4],
            ["AlienRotation", 4],

            ["PowerUpSpawning", 4]
        );

        this.screen.fadeIn(500, function () {
            game.start();
            done();
        });
    },
    onExit: function (game, done) {
        game.engine.clear();
        this.screen.fadeOut(500, function () {
            done();
        });
    }
});

Entropy.Game.State({
    name: "initialize",
    initialize: function (game, done) {
        Entropy.Const("WIDTH", 800);
        Entropy.Const("HEIGHT", 600);

        var interactive = true;
        var stage = new PIXI.Stage(0x1E006B, interactive);
        var renderer = new PIXI.autoDetectRenderer(Entropy.WIDTH, Entropy.HEIGHT, null, false, true);

        stage.mousemove = function (e) {
            game.input.setMouseStagePosition(e.global);
        };
  
        game.setRenderer(renderer);
        game.setStage(stage);

        $("#game-screen").append(renderer.view);

        $("#loading-screen").fadeOut(500, function () {
            game.changeState("menu");
            done();
        });
    }
});

Entropy.Game.State({
    name: "intro",
    initialize: function (game, done) {
        this.screen = $("#intro-screen");
    
        this.console_window = this.screen.find(".console");
        done();
    },
    onEnter: function (game, done) {
        this.screen.fadeIn(500);

        var screen = this.screen;

        queue(1)
            .defer(delay, 500)
            .defer(writeText, "Rozruch systemu za: 3", this.console_window, 0)
            .defer(delay, 1000)
            .defer(writeText, " 2", this.console_window, 0)
            .defer(delay, 1000)
            .defer(writeText, " 1", this.console_window, 0)
            .defer(delay, 1000)
            .defer(writeText, "\n0%.............50%.............100%", this.console_window, 150)
            .defer(delay, 500)
            .defer(writeText, " [DONE]\n", this.console_window, 0)
            .defer(delay, 1500)
            .defer(writeText, "System L.E.M. 500 zakończył procedurę rozruchu.\n", this.console_window, 70)
            .defer(delay, 1000)
            .defer(writeText, "Teraz nastąpi inicjalizacja podstawowych modułów:\n", this.console_window, 70)
            .defer(delay, 1000)
            .defer(writeText, "* Ładowanie katalogu 'ASCII porn'...", this.console_window, 70)
            .defer(delay, 1000)
            .defer(writeText, " [OK]\n", this.console_window, 0)
            .defer(delay, 500)
            .defer(writeText, "* Przygotowywanie ataku DDoS na serwer gamedev.pl...", this.console_window, 70)
            .defer(delay, 1000)
            .defer(writeText, " [OK]\n", this.console_window, 0)
            .defer(delay, 500)
            .defer(writeText, "* Ugniatanie ciasta na pizze dla Obcych...", this.console_window, 70)
            .defer(delay, 1000)
            .defer(writeText, " [OK]\n", this.console_window, 0)
            .defer(delay, 500)
            .defer(writeText, "* Odpalanie rakiet nuklearnych w kierunku ul. Wiejskiej...", this.console_window, 70)
            .defer(delay, 1000)
            .defer(writeText, " [OK]\n", this.console_window, 0)
            .defer(delay, 500)
            .defer(writeText, "* Wypuszczanie z klatki upośledzonych jednorożców...", this.console_window, 70)
            .defer(delay, 1000)
            .defer(writeText, " [OK]\n", this.console_window, 0)
            .defer(delay, 500)
            .defer(writeText, "* Unieszkodliwianie laserów...", this.console_window, 70)
            .defer(delay, 500)
            .defer(writeText, " [FAIL]\n", this.console_window, 0)
            .defer(delay, 1000)
            .defer(writeText, "FATAL ERROR: nie można wyłączyć laserów, są spieprzone.\n", this.console_window, 70)
            .defer(delay, 1000)
            .defer(writeText, "Pamiętaj o celu misji - nie możesz skrzywdzić obcych.\nStaraj się podlecieć jak najbliżej i zabrać ich na pokład statku. Powodzenia!\n", this.console_window, 50)
            .defer(delay, 500).await(function () {
                screen.fadeOut(500, function () {
                    game.changeState("level1gameplay");
                    //game.changeState("level_intro", "Poziom 1", "\"Bliskie spotkania trzeciego stopnia\"", "level1");
                    done();
                });
            });
    }
});

Entropy.Game.State({
    name: "menu",
    initialize: function (game, done) {
        this.screen = $("#menu-screen");
        done();
    },
    onEnter: function (game, done) {
        this.screen.fadeIn(500);
        var screen = this.screen;

        this.screen.find(".new-game").click(function () {
            screen.fadeOut(500, function () {
                game.changeState("intro");
                done();
            });
        });
    }
});

Entropy.Game.State({
    name: "level_intro",
    initialize: function (game, done) {
        this.screen = $("#level-screen");
        this.lvl_title = this.screen.find(".level-title");
        this.lvl_subtitle = this.screen.find(".level-subtitle");
        done();
    },
    onEnter: function (game, title, subtitle, next, done) {
        this.lvl_title.html(title);
        this.lvl_subtitle.html(subtitle);

        this.screen.fadeIn(500).delay(1000).fadeOut(500, (function () {
            game.changeState(next + "gameplay");
            done();
        }).bind(this));
    }
});

/*Entropy.Game.State("credits", {
    onEnter: function (game, done) {
        this.screen = $("#credits-screen")[0];
        this.screen.fadeIn(500);
    },
    onReturn: function (game, done) {
        this.screen.style.display = "block";
    },
    onExit: function (game, done) {
        this.screen.style.display = "none";
    }
});*/

Entropy.Game.State({
    name: "win",
    initialize: function (game, done) {
        this.screen = $("#winner-screen");
        done();
    },
    onEnter: function (game, done) {
        game.pause();

        this.screen.fadeIn(500, function () {
            done();
        });
    }
});

Entropy.Game.State({
    name: "gameover",
    initialize: function (game, done) {
        this.screen = $("#gameover-screen");
        done();
    },
    onEnter: function (game, done) {
        game.pause();

        this.screen.fadeIn(500, function () {
            done();
        });
    }
});