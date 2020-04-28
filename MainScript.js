// JavaScript source code

//テーマ切替
function changeStyle(style) {
    var linkstyle = document.getElementById("darkmode");
    linkstyle.href = style;
}

//コンテンツ切替
function toggle_contents(dom_id) {
    var childsAll = document.getElementById("contents").children;
    for (i = 0; i < childsAll.length; i++) {
        if (childsAll[i].id == dom_id) {
            document.getElementById(childsAll[i].id).style.display = "block";
        } else if (childsAll[i].id == "viewer") {
            continue;
        } else {
            document.getElementById(childsAll[i].id).style.display = "none";
        }
    }
}

//メンバーリスト表示切替
function toggle_memberlist() {
    if (document.getElementById("member").style.display == "block") {
        document.getElementById("member").style.display = "none";
        document.getElementById("toggle_button").value = "Show Member List";
    } else {
        document.getElementById("member").style.display = "block";
        document.getElementById("toggle_button").value = "Hide Member List";
    }
}

//DB読み込み＆表示
function load_db(member_name) {
    fetch("db/" + member_name + ".json")
        .then(function (response) {
            return response.text;
        })
        .then(function (text) {
            alert(text);
        });
}