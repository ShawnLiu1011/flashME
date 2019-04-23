window.onload = function() {
    var num = -1;
    var card_num = 0;
    var box_num = 0;
    var list = [];
    var time = 0;
    var flag = document.getElementById("start_button").getAttribute("flag");
    if(flag == 1) {
        document.getElementById("start_button").style.display = "none";
    }
    document.getElementById("set_box_num").style.display = "none";
    document.getElementById("set_time").style.display = "none";
    document.getElementById("message").style.display = "none";
    var setid = document.getElementById("card").getAttribute("setid");

    function gebi(id) {
        return document.getElementById(id);
    }

    var card = gebi("card");
    var button = card.getElementsByTagName("button");
    button[0].style.display = "none";
    button[1].style.display = "none";

    function start() {
        document.getElementById("start_button").style.display = "none";
        document.getElementById("set_time").style.display = "none";
        if(flag == 2) {
            console.log(flag);
            new SimpleAjax('box_initial.php', 'GET', "setid=001&card_num="+card_num, box);
        } else {
            console.log(flag);
            new SimpleAjax('box_initial.php', 'GET', "setid="+setid+"&card_num="+card_num, box);
        }
    }

    function box(request) {
        console.log(request.responseText);
        var set_box = gebi("set_box_num");
        set_box.style.display = "block";
        var front = gebi("front");
        var back = gebi("back");
        var arr = request.responseText.split("/");
        front.innerHTML = arr[0];
        back.innerHTML = arr[1];
        console.log("box " + box_num);
        var obj = {};
        obj["card_num"] = card_num;
        obj["front"] = arr[0];
        obj["back"] = arr[1];
        obj["sort_num"] = 1;
        obj["vis"] = 0;
        list.push(obj);
        console.log(list);
        card_num ++;
    }

    function set_box() {
        if(flag == 2) {
            new SimpleAjax('box_initial.php', 'GET', "setid=001&card_num="+card_num, box_initial);
        } else {
            new SimpleAjax('box_initial.php', 'GET', "setid="+setid+"&card_num="+card_num, box_initial);
        }
    }

    function box_initial(request) {
        console.log(request.responseText);
        var set_box = gebi("set_box_num");
        set_box.style.display = "block";
        var front = gebi("front");
        var back = gebi("back");
        var arr = request.responseText.split("/");
        box_num = document.getElementById("box_num").value;
        list[list.length-1]["box_num"] = box_num;
        console.log("box " + box_num);
        var obj = {};
        obj["card_num"] = card_num;
        obj["front"] = arr[0];
        obj["back"] = arr[1];
        obj["vis"] = 0;
        var max = 0;
        for(var i = 0; i < list.length-1; i ++) {
            if(list[i]["box_num"] == box_num) {
                max = list[i]["sort_num"];
            }
        }
        list[list.length-1]["sort_num"] = max + 1;
        if(request.responseText == "0/0") {
            console.log(list);
            write_user();
        }
        front.innerHTML = arr[0];
        back.innerHTML = arr[1];
        list.push(obj);
        card_num ++;
    }

    function write_user() {
        var set_box = gebi("set_box_num");
        set_box.style.display = "none";
        alert("Start the first day's game.")
        document.getElementById("set_time").style.display = "block";
        if(flag == 2) {
            init();
        } else {
            flag = 1;
            var parameters = "setid=" + setid + "&list=" + JSON.stringify(list);
            new SimpleAjax('box_initial.php', 'POST', parameters);
            new SimpleAjax('card_action.php', 'GET', "setid="+setid+"&num=0", init);
        }
    }

    function init(request) {
        var set_time = gebi("set_time");
        set_time.style.display = "block";
        console.log(list);
        if(flag != 2) {
            console.log(request.responseText);
            var arr = request.responseText.split(" ");
            list = eval(arr[0]);
            time = arr[1];
        } else {
            time = 1;
        }
        console.log("time " + time);
        var card = gebi("card");
        var button = card.getElementsByTagName("button");
        button[0].style.display = "none";
        button[1].style.display = "none";
        var p = card.getElementsByTagName("p");
        var asc = function(x, y) {
            return (x["sort_num"] > y["sort_num"]) ? 1 : -1
        };
        var asc2 = function(x, y) {
            return (x["box_num"] > y["box_num"]) ? 1 : -1
        };
        list.sort(asc);
        list.sort(asc2);
        var no_cards = 1;
        for(var i = num+1; i < list.length; i ++) {
            if(time % Math.pow(2, list[i]["box_num"]-1) == 0 && list[i]["vis"] == 0) {
                p[0].innerHTML = list[i]["front"];
                list[i]["vis"] = 1;
                num = i;
                no_cards = 0;
                break;
            }
        }
        if(no_cards == 1) {
            card.style.display = "none";
            // alert("Today, you don't need check the theme's cards.");
            var message = gebi("message");
            message.innerHTML = "Today, you don't need check the theme's cards.";
            message.style.display = "block";
            finish();
        }
        card.onclick = show_answer;
    }

    function show() {
        var card = gebi("card");
        var button = card.getElementsByTagName("button");
        button[0].style.display = "none";
        button[1].style.display = "none";
        var p = card.getElementsByTagName("p");
        console.log("show num " + num);
        var no_cards = 1;
        for(var i = num+1; i < list.length; i ++) {
            if(time % Math.pow(2, parseInt(list[i]["box_num"])-1) == 0 && list[i]["vis"] == 0) {
                p[0].innerHTML = list[i]["front"];
                list[i]["vis"] = 1;
                num = i;
                no_cards = 0;
                break;
            }
        }
        if(no_cards == 1) {
            card.style.display = "none";
            // alert("You have check all cards.");
            var message = gebi("message");
            message.innerHTML = "You have check all cards.";
            message.style.display = "block";
            finish();
        }
        console.log(list);
        card.onclick = show_answer;
    }

    function show_answer() {
        var card = gebi("card");
        var p = card.getElementsByTagName("p");
        p[0].innerHTML = list[num]["back"];
        var button = card.getElementsByTagName("button");
        button[0].onclick = right;
        button[0].style.display = "block";
        button[1].onclick = wrong;
        button[1].style.display = "block";
        card.onclick = null;
    }

    function right(event) {
        event.stopPropagation();
        console.log("yes");
        list[num]["box_num"] ++;
        var tmp = list[num]["sort_num"];
        list[num]["sort_num"] = 0;
        var max = 0;
        for(var i = 0; i < list.length; i ++) {
            if(list[num]["box_num"] == list[i]["box_num"] && list[i]["sort_num"] > max) {
                max = list[i]["sort_num"];
                console.log("max " + max);
            }
            if(list[num]["box_num"]-1 == list[i]["box_num"] && list[i]["sort_num"] > tmp) {
                list[i]["sort_num"] --;
            }
        }
        list[num]["sort_num"] = parseInt(max) + 1;
        console.log("num " + num);
        show();
    }

    function wrong(event) {
        event.stopPropagation();
        console.log("no");
        var max = 1;
        for(var i = 0; i < list.length; i ++) {
            if(i == num) continue;
            if(list[num]["box_num"] == list[i]["box_num"] && list[i]["sort_num"] > max) {
                max = list[i]["sort_num"];
                console.log("max " + max);
            }
            if(list[num]["box_num"] == list[i]["box_num"] && list[i]["sort_num"] > list[num]["sort_num"]) {
                list[i]["sort_num"] --;
            }
        }
        list[num]["sort_num"] = max;
        show();
    }

    function finish() {
        var asc = function(x, y) {
            return (x["card_num"] > y["card_num"]) ? 1 : -1
        };
        list.sort(asc);
        if(flag == 2) {
            alert("You have tried our demo, please go back to the register page to register.");
            window.location.href = "register.php";
        } else {
            var parameters = "setid=" + setid + "&list=" + JSON.stringify(list);
            new SimpleAjax('box_initial.php', 'POST', parameters);
            // window.location.href = "index.php";
        }
    }

    if(flag == 1) {
        new SimpleAjax('card_action.php', 'GET', "setid="+setid+"&num=0", init);
    }
    document.getElementById("start_button").onclick=start;
    document.getElementById("set_box").onclick=set_box;
}