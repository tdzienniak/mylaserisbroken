function writeText (text, element, interval, callback) {
    var i = 0;

    var interval_id = window.setInterval(function () {
        if (i < text.length) {
            element.append((text[i] == "\n") ? "<br />" : text[i]);
        } else {
            window.clearInterval(interval_id)
            callback();
        }

        if (game.input.isPressed("S")) {
            callback("skip");
        }

        i++;
    }, interval);
}

function writeLines (lines, element, interval, callback) {
    var i = 0;

    var interval_id = window.setInterval(function () {
        if (i < lines.length) {
            //element
            if ("innerText" in element) {
                element.innerText += lines[i] + "\n";
            } else {
                element.textContent += lines[i] + "\n";
            }
        } else {
            window.clearInterval(interval_id);
            callback();
        }

        i++;
    }, interval);   
}

function delay (time, callback) {
    setTimeout(function () {
        callback();
    }, time);
}

function distance(x1, y1, x2, y2) {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}