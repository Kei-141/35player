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

//DB読み込み＆表示関数呼び出し
function load_db(member_name) {
    var url = "https://raw.githubusercontent.com/Kei-141/35player/master/db/" + member_name + ".json"
    fetch(url)
        .then(function (response) {
            return response.json();
        })
        .then(function (json) {
            for (i = 0; i < json.length; i++) {
                var div_list = document.createElement("div");
                var div_id = "song_list_child_" + i;
                div_list.setAttribute("id", div_id);
                div_list.setAttribute("class", "song_list_child");
                document.getElementById("selected_member").appendChild(div_list);
                gen_songlist(json[i], div_id, member_name);
            }
        });
}

//曲リスト生成
function gen_songlist(json, div_id, member_name) {
    var title = document.createElement("div");
    title.innerHTML = json[0];
    document.getElementById(div_id).appendChild(title);

    var thumbs = document.createElement("img");
    var thumbs_url = "https://i.ytimg.com/vi/" + json[1] + "/hq720.jpg";
    thumbs.setAttribute("src", thumbs_url);
    document.getElementById(div_id).appendChild(thumbs);

    for (j = 2; j < json.length; j++) {
        var list = document.createElement("div");
        var button_ref = ["\'" + member_name + "\'", "\'" + json[j].song_name + "\'", "\'" + json[j].artist_name + "\'", json[j].start, json[j].end];
        list.innerHTML = "<button type='button' onclick=" + "javascript:add_playlist(" + button_ref +
            ");>Add</button>&nbsp;" + (j - 1) + " : " + json[j].song_name + "&nbsp;/&nbsp;" + json[j].artist_name;
        document.getElementById(div_id).appendChild(list);
    }
}

//プレイリスト登録
function add_playlist(liver, name, artist, start, end) {
    alert(liver);
    alert(name);
    alert(artist);
    alert(start);
    alert(end);
}