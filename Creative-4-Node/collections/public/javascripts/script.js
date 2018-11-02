$(document).ready(function() {

    var color = "black";
    var colorName = "Black";

    function renderTable(players) {
        var myhtml = '<table class="table table-sm table-bordered table-light player-table">' +
            '<thead class="table-header">' +
            '<tr>' +
            '<th scope="col">Player</th>' +
            '<th scope="col">Color</th>' +
            '<th scope="col">Score</th>' +
            '</tr>' +
            '</thead>' +
            '<tbody>';
        for (var id in players) {
            var player = players[id];
            myhtml += '<tr><td>';
            myhtml += player["nickname"];
            myhtml += '</td><td>';
            myhtml += player["colorName"];
            myhtml += '</td><td>';
            myhtml += player["numPoints"];
            myhtml += '</td></tr>';
        }
        myhtml += '</tbody></table>'
        $("#playerTable").html(myhtml);
    }

    $("#aquadot").click(function() {
        color = "#00ccff";
        colorName = "Light Blue";
        if ($("#aquadot").hasClass("selected-dot")) {
            $("#aquadot").removeClass("selected-dot");
            color = "black";
            colorName = "Black";
        }
        else {
            $("#aquadot").addClass("selected-dot");
        }
    })

    $("#pinkdot").click(function() {
        color = "#990073";
        colorName = "Pink";
        if ($("#pinkdot").hasClass("selected-dot")) {
            $("#pinkdot").removeClass("selected-dot");
            color = "black";
            colorName = "Black";
        }
        else {
            $("#pinkdot").addClass("selected-dot");
        }
    })
    
    $("#greendot").click(function() {
        color = "#2eb82e";
        colorName = "Green";
        if ($("#greendot").hasClass("selected-dot")) {
            $("#greendot").removeClass("selected-dot");
            color = "black";
            colorName = "Black";
        }
        else {
            $("#greendot").addClass("selected-dot");
        }
    })
    
    $("#bluedot").click(function() {
        color = "#1E90FF";
        colorName = "Blue";
        if ($("#bluedot").hasClass("selected-dot")) {
            $("#bluedot").removeClass("selected-dot");
            color = "black";
            colorName = "Black";
        }
        else {
            $("#bluedot").addClass("selected-dot");
        }
    })
    
    $("#reddot").click(function() {
        color = "#ff1a1a";
        colorName = "Red";
        if ($("#reddot").hasClass("selected-dot")) {
            $("#reddot").removeClass("selected-dot");
            color = "black";
            colorName = "Black";
        }
        else {
            $("#reddot").addClass("selected-dot");
        }
    })
    
    $("#orangedot").click(function() {
        color = "#ff9900";
        colorName = "Orange";
        if ($("#orangedot").hasClass("selected-dot")) {
            $("#orangedot").removeClass("selected-dot");
            color = "black";
            colorName = "Black";
        }
        else {
            $("#orangedot").addClass("selected-dot");
        }
    })
    
    $('#musicOptionOn').click(function() {
        var song = document.getElementById("game-song");
        song.play();
    })
    
    $('#musicBackOn').click(function() {
        var song = document.getElementById("game-song");
        song.play();
    })
    
    $('#musicBackOff').click(function() {
        var song = document.getElementById("game-song");
        song.pause();
    })
    
    $('#musicOptionOff').click(function() {
        var song = document.getElementById("game-song");
        song.pause();
    })

    $("#submitNickname").click(function() {
        var canvas = '<canvas id="rupeeCanvas" width="50" height="50" style="z-index: 1;"></canvas><canvas id="gameCanvas" width="50" height="50" style="z-index: 2;">Sorry, it looks like your brower does not support canvas!</canvas>';
        $("#mainContent").html(canvas);
        var nickname = $("#nickname").val();
        if (nickname === "") {
            nickname = "Anonymous Dodongo"
        }

        var socket = io();
        var info = {
            "colorDot": color,
            "colorName": colorName,
            "nickname": nickname
        };

        socket.emit('new player', info);

        socket.on('message', function(data) {
            console.log(data);
        });

        var movement = {
            up: false,
            down: false,
            left: false,
            right: false
        }
        document.addEventListener('keydown', function(event) {
            switch (event.keyCode) {
                case 37: // left arrow
                    movement.left = true;
                    break;
                case 38: // up arrow
                    movement.up = true;
                    break;
                case 39: // right arrow
                    movement.right = true;
                    break;
                case 40: // down arrow
                    movement.down = true;
                    break;
            }
        });
        document.addEventListener('keyup', function(event) {
            switch (event.keyCode) {
                case 37: // left arrow
                    movement.left = false;
                    break;
                case 38: // up arrow
                    movement.up = false;
                    break;
                case 39: // right arrow
                    movement.right = false;
                    break;
                case 40: // down arrow
                    movement.down = false;
                    break;
            }
        });

        setInterval(function() {
            socket.emit('movement', movement);
        }, 1000 / 60);

        function calculateAspectRatioFit(srcWidth, srcHeight, maxWidth, maxHeight) {
            var ratio = Math.min(maxWidth / srcWidth, maxHeight / srcHeight);
            var rtnWidth = srcWidth * ratio;
            var rtnHeight = srcHeight * ratio;
            return {
                width: rtnWidth,
                height: rtnHeight
            };
        }

        var gameCanvas = document.getElementById('gameCanvas');
        gameCanvas.width = 800;
        gameCanvas.height = 600;
        var context = gameCanvas.getContext('2d');

        var rupeeCanvas = document.getElementById('rupeeCanvas');
        rupeeCanvas.width = 800;
        rupeeCanvas.height = 600;
        var rupeeContext = rupeeCanvas.getContext('2d');

        function removeRupeeFromCanvas(xval, yval) {
            rupeeContext.clearRect(xval, yval, 50, 50);
        };

        socket.on('clearRupees', function() {
            rupeeContext.clearRect(0, 0, 800, 600);
        });

        socket.on('state', function(players, rupees) {
            context.clearRect(0, 0, 800, 600);
            for (var id in players) {
                var player = players[id];
                context.fillStyle = player["color"];
                context.beginPath();
                context.arc(player.x, player.y, 20, 0, 2 * Math.PI);
                context.fill();
            }
            for (var item in rupees) {
                var rupee = rupees[item];
                var image = new Image();
                image.src = rupee["source"];
                image.onload = function() {
                    var imgSize = calculateAspectRatioFit(image.width, image.height, 40, 40);
                    rupeeContext.drawImage(image, rupee.x, rupee.y, imgSize.width, imgSize.height);
                }
            }
        });

        socket.on('collectedRupee', function(rupee) {
            removeRupeeFromCanvas(rupee.x, rupee.y);
        })

        socket.on('updateTable', function(players) {
            renderTable(players);
        })

    });
});
