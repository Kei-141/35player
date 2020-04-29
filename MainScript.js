// All rights reserved by author/

//デバッグ用
function test() {
    var str = document.getElementById("song1_url").textContent;
    alert(str);
}

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
    var ele = document.getElementById("selected_member");
    ele.innerHTML = "";
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

    var vid_id = "\'" + json[1] + "\'"

    for (j = 2; j < json.length; j++) {
        var list = document.createElement("div");
        var button_ref = ["\'" + replace_space(member_name) + "\'", "\'" + replace_space(json[j].song_name) + "\'", "\'" + replace_space(json[j].artist_name) + "\'", json[j].start, json[j].end, vid_id];
        list.innerHTML = "<button type='button' onclick=" + "javascript:add_playlist(" + button_ref +
            ");>Add</button>&nbsp;" + (j - 1) + " : " + json[j].song_name + "&nbsp;/&nbsp;" + json[j].artist_name;
        document.getElementById(div_id).appendChild(list);
    }
}

//プレイリスト登録
function add_playlist(liver, name, artist, start, end, vid_id) {
    var list_elem = document.getElementById("playlist");
    var count = list_elem.childElementCount;

    var liver_thumbs_path = "img/" + liver + ".jpg";

    var time_min = Math.floor((end - start) / 60);
    var time_sec = (end - start) % 60;
    if (time_sec < 10) {
        var time_sec_fix = "0" + time_sec;
    } else {
        time_sec_fix = time_sec;
    }

    var song_id = "song" + (count + 1);
    var song_url = song_id + "_url";
    var song_start = song_id + "_start";
    var song_end = song_id + "_end";
    var song = document.createElement("div");
    song.setAttribute("id", song_id);
    song.innerHTML = "<img src='" + liver_thumbs_path + "' />&nbsp;" + "<span>" + (count + 1) + "&nbsp;:&nbsp;</span>" + name + "&nbsp;/&nbsp;" + artist + "&nbsp;/&nbsp;" + time_min + ":" + time_sec_fix +
        "<var id='" + song_url + "'>" + vid_id + "</var>" + "<var id='" + song_start + "'>" + start + "</var>" + "<var id='" + song_end + "'>" + end + "</var>";
    document.getElementById("playlist").appendChild(song);
}

//空白文字置換
function replace_space(str) {
    return str.replace(/\s+/g, "&nbsp;");
}

//プレイリスト再生
function play_list() {
    player.loadVideoById({
        'videoId': document.getElementById("song1_url").textContent,
        'startSeconds': document.getElementById("song1_start").textContent,
        'endSeconds': document.getElementById("song1_end").textContent,
    })
}

//APIロード時に自動実行
var player;
function onYouTubeIframeAPIReady() {
    player = new YT.Player('player', {
        height: '200',
        width: '480',
        videoId: '0o3VrBLh8jI', //この動画IDは公式チャンネルから適当に設定
        events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
        }
    });
}

function onPlayerReady(event) {
    event.target.playVideo();
}

var done = false;
function onPlayerStateChange(event) {
    if (event.data == YT.PlayerState.PLAYING && !done) {
        setTimeout(stopVideo, 6000);
        done = true;
    }
}

function stopVideo() {
    player.stopVideo();
}