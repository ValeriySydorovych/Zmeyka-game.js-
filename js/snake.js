$(function() {
    var $tds = $("td"),
        $start = $("#start"),
        $name = $("#name"),
        $records = $(".records"),
        $length = 1,
        $carrot = 0,
        $count = -1,
        $upping, $lefting, $righting, $downing, $head;
    $("tr td:first-child").addClass("stop");
    $("tr td:last-child").addClass("stop");
    $("tr:first-child td").addClass("stop");
    $("tr:last-child td").addClass("stop");
    $name.text(localStorage.getItem('name'));
    $records.text(localStorage.getItem('record'));
    if (localStorage.getItem('name') == null) $name.text("Anonymous");
    if (localStorage.getItem('record') == null) $records.text(0);

    function startRender() {
        for ($i = 230; $i <= 370; $i += 20) { // добавляем порядковые номера к змейке
            $tds.eq($i).addClass("black").attr("id", "length" + $length);
            $length++;
        };
    };

    function moving() {
        $("html").on("keydown", changeDir);
        $("#totalCarrots").text($carrot);
    };

    function upping() {
        snakeRun();
        $tds.eq($head -= 20).addClass("black").attr("id", "length1");
    };

    function lefting() {
        snakeRun();
        $tds.eq(--$head).addClass("black").attr("id", "length1");
    };

    function righting() {
        snakeRun();
        $tds.eq(++$head).addClass("black").attr("id", "length1");
    };

    function downing() {
        snakeRun();
        $tds.eq($head += 20).addClass("black").attr("id", "length1");
    };

    function snakeRun() {
        putTrap();
        if ($("#length1").hasClass("bonus")) destroyTrap();
        if ($("#length1").hasClass("stop")) {
            clearIntervals();
            soundEnd();
            setTimeout(function() {
                location.reload();
            },2500);
            $("html").off("keydown", changeDir);
            if ($records.text() < $carrot) storage();
        };
        $head = $tds.index($("#length1"));
        $("#length8").removeClass("black").removeAttr("id");
        var $rename = 8;
        for (var $i = 7; $i >= 1; $i--) {
            $("#length" + $i).attr("id", "length" + $rename);
            $rename--;
        };
    };

    function storage() {
        localStorage.setItem('name', prompt("Ваше имя", ""));
        localStorage.setItem('record', $carrot);
        $name.text(localStorage.getItem("name"));
        $records.text(localStorage.getItem("record"));
    };

    function clearIntervals() {
        clearInterval($lefting);
        clearInterval($upping);
        clearInterval($righting);
        clearInterval($downing);
    };

    function changeDir(e) {
        clearInterval($upping);
        if (e.keyCode == 37) {
            clearIntervals();
            $lefting = setInterval(lefting, 100);
        };
        if (e.keyCode == 38) {
            clearIntervals();
            $upping = setInterval(upping, 100);
        };
        if (e.keyCode == 39) {
            clearIntervals();
            $righting = setInterval(righting, 100);
        };
        if (e.keyCode == 40) {
            clearIntervals();
            $downing = setInterval(downing, 100);
        };
    };

    function putTrap() {
        $empty = $tds.not(".black").not(".stop");
        if ($("#length1").hasClass("carrot")) {
            $("#length1").removeClass("carrot");
        }
        if ($(".carrot").length == 1) {
            soundEat();
            $carrot++;
            $("#totalCarrots").html($carrot);
            $(".carrot").removeClass("carrot").addClass("stop").addClass("face");
        }
        if ($(".carrot").length == 0) {
            $count++;
            if ($count == 10) bonus();
            for (var $i = 0; $i < 2; $i++) {
                var $random = Math.floor(Math.random() * $empty.length);
                if ($empty.eq($random).hasClass("carrot")) {
                    $i--;
                    continue;
                };
                $empty.eq($random).addClass("carrot");
            };
        };
    };

    function soundEat() {
        var audio = new Audio();
        audio.src = 'sound/eatCarrot.mp3';
        audio.autoplay = true;
    };

    function soundEnd() {
        var audio = new Audio();
        audio.src = 'sound/end.mp3';
        audio.autoplay = true;
    };

    function soundBonus() {
        var audio = new Audio();
        audio.src = 'sound/bonus.mp3';
        audio.autoplay = true;
    };

    function bonus() {
        var $collect = $tds.not(".black").not(".stop").not("carrot");
        $collect.eq(Math.floor(Math.random() * $collect.length)).addClass("bonus");
        $count = 0;
    };

    function destroyTrap() {
        for (var $i = 0; $i < 3; $i++) {
            var $faces = $(".face");
            $faces.eq(Math.floor(Math.random() * $faces.length)).removeClass("stop face").addClass("red");
            setTimeout(noFace, 1000);
        };
        $(".bonus").removeClass("bonus");
    };

    function noFace() {
        $(".red").removeClass("red");
    };

    $("#erase").on("click", function() {
        localStorage.clear();
        $name.text("Anonymous");
        $records.text(0);
    });

    startRender();
    $start.on("click", moving);
});