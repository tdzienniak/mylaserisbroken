Entropy.Game.addState("gameplay", {
    onEnter: function (game) {
        var interactive = true;
        var stage = new PIXI.Stage(0x1E006B, interactive);
        var renderer = new PIXI.WebGLRenderer(Entropy.Game.WIDTH, Entropy.Game.HEIGHT, null, false, true);

        stage.mousemove = function (e) {
            game.input.setMouseStagePosition(e.global);
        };
 
        // set renderer and stage        
        game.setRenderer(renderer);
        game.setStage(stage);
        
        //show the screen
        this.screen = $("#game-screen");
        this.screen.delay(2500).fadeIn(500);

        //append canvas to the screen
        this.screen.append(renderer.view);

        var player_x = Entropy.Game.WIDTH / 2;
        var player_y = Entropy.Game.HEIGHT / 2;

        //compose player ship
        game.engine.create("PlayerShip", player_x, player_y);
        game.engine.create("PlayerGun", player_x, player_y);
        game.engine.create("EngineFlame", player_x, player_y, 23, -3, 0, 90);
        game.engine.create("EngineFlame", player_x, player_y, 23, 3, 0, 90);

        //prepare game systems
        /** rendering systems **/
        game.engine.addSystem("FollowingParticleRenderer", 2);
        game.engine.addSystem("ParticleRenderer", 2);
        game.engine.addSystem("AlienRenderer", 2);

        game.engine.addSystem("Render", 3);
        
        game.engine.addSystem("LevelManagement", 3);

        //game.engine.addSystem("PlayerShipSteering", 4);
        game.engine.addSystem("Motion", 4);
        game.engine.addSystem("BoundingCollision", 4);

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

        
        //game.ticker.useRAF(false);
        game.start();
    },
    onReturn: function (game) {
        this.screen.style.display = "block";

        game.resume();
    },
    onExit: function (game) {
        this.screen.fadeOut(500);
    }
});

Entropy.Game.addState("initialize", {
    onEnter: function (game) {
        Entropy.Game.constans("WIDTH", 800);
        Entropy.Game.constans("HEIGHT", 600);

        $("#loading-screen").fadeOut(500);

        //screen.style.display = "none";

        game.changeState("menu");
    },
    onReturn: function (game) {

    },
    onExit: function (game) {
        console.log("lol");
    }
});

Entropy.Game.addState("intro", {
    onEnter: function (game) {
        this.screen = $("#intro-screen");
        this.screen.delay(500).fadeIn(500);

        this.console_window = this.screen.find(".console");

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
            .defer(writeText, "* Ładowanie katalogu ASCII porn...", this.console_window, 70)
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
            .defer(writeText, "* Odpalanie rakiet nuklearnych w kirunku ul. Wiejskiej...", this.console_window, 70)
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
            .defer(delay, 500)
    },
    onReturn: function (game) {

    },
    onExit: function (game) {

    }
});

Entropy.Game.addState("menu", {
    onEnter: function (game) {

        this.screen = $("#menu-screen");

        this.screen.delay(500).fadeIn(500);

        this.screen.find(".new-game").click(function () {
            game.changeState("level1");
        });

        /*game.changeState("gameplay");*/
    },
    onReturn: function (game) {
        this.screen.delay(500).fadeIn(500);
    },
    onExit: function (game) {

        this.screen.fadeOut(500);
    }
});

Entropy.Game.addState("level1", {
    onEnter: function (game) {
        this.screen = $("#level1-screen");

        this.screen.delay(500).fadeIn(500).delay(1000).fadeOut(500);

        game.changeState("gameplay");
    },
    onReturn: function (game) {

    },
    onExit: function (game) {

    }
});

Entropy.Game.addState("credits", {
    onEnter: function (game) {
        this.screen = $("#credits-screen")[0];
        this.screen.fadeIn(500);
    },
    onReturn: function (game) {
        this.screen.style.display = "block";
    },
    onExit: function (game) {
        this.screen.style.display = "none";
    }
});

Entropy.Game.addState("win", {
    onEnter: function (game) {
        game.pause();

        this.screen = $("#winner-screen");

        this.screen.delay(500).fadeIn(500);
    },
    onReturn: function (game) {

    },
    onExit: function (game) {

    }
});

Entropy.Game.addState("gameover", {
    onEnter: function (game) {
        game.pause();

        this.screen = $("#gameover-screen");

        this.screen.delay(500).fadeIn(500);
    },
    onReturn: function (game) {

    },
    onExit: function (game) {

    }
});