// All rights reserved by author.

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

        var time_min = Math.floor((json[j].end - json[j].start) / 60);
        var time_sec = (json[j].end - json[j].start) % 60;
        if (time_sec < 10) {
            var time_sec_fix = "0" + time_sec;
        } else {
            time_sec_fix = time_sec;
        }

        var button_ref = ["\'" + replace_space(member_name) + "\'", "\'" + replace_space(json[j].song_name) + "\'", "\'" + replace_space(json[j].artist_name) + "\'", json[j].start, json[j].end, vid_id];
        list.innerHTML = "<button type='button' onclick=" + "javascript:add_playlist(" + button_ref +
            ");>Add</button>&nbsp;" + (j - 1) + " : " + json[j].song_name + "&nbsp;/&nbsp;" + json[j].artist_name + "&nbsp;/&nbsp;" + time_min + ":" + time_sec_fix;
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
    var del_id = song_id + "_del";
    var up_id = song_id + "_up";
    var down_id = song_id + "_down";
    var song_url = song_id + "_url";
    var song_start = song_id + "_start";
    var song_end = song_id + "_end";
    var song = document.createElement("div");
    song.setAttribute("id", song_id);
    song.innerHTML = "<img src='" + liver_thumbs_path + "' />" + "<span>&nbsp;" + (count + 1) + "&nbsp;:&nbsp;" + name + "&nbsp;/&nbsp;" + artist + "&nbsp;/&nbsp;" + time_min + ":" + time_sec_fix + "</span >" +
        "<var id='" + song_url + "'>" + vid_id + "</var>" + "<var id='" + song_start + "'>" + start + "</var>" + "<var id='" + song_end + "'>" + end + "</var>" +
        "<br><input " + "id='" + del_id + "' type='button' value='Del' onclick='del_list(this.id)' />" + "<input " + "id='" + up_id + "' type='button' value='↑' onclick='up_list(this.id)' />" + "<input " + "id='" + down_id + "' type='button' value='↓' onclick='down_list(this.id)' />";
    document.getElementById("playlist").appendChild(song);
}

//空白文字置換
function replace_space(str) {
    return str.replace(/\s+/g, "&nbsp;");
}

//再生中の曲情報格納
var now_playing = 0;
var playing_id;

//プレイリスト再生
function play_list() {
    now_playing = (now_playing == 0) ? 1 : now_playing;
    playing_id = "song" + now_playing;
    var video_url = playing_id + "_url";
    var video_start = playing_id + "_start";
    var video_end = playing_id + "_end";

    var play_elem = document.getElementById(playing_id);
    play_elem.setAttribute("class", "playing");
    player.loadVideoById({
        'videoId': document.getElementById(video_url).textContent,
        'startSeconds': document.getElementById(video_start).textContent,
        'endSeconds': document.getElementById(video_end).textContent,
        'suggestedQuality': 'medium'
    })
}

//APIロード時に自動実行
var player;
function onYouTubeIframeAPIReady() {
    player = new YT.Player('player', {
        height: '200',
        width: '480',
        videoId: 'X9zw0QF12Kc', //サクラカゼ
        playerVars: { 'rel': 0 },
        events: {
            'onStateChange': onPlayerStateChange
        }
    });
}

//再生終了時実行（次の曲）
function onPlayerStateChange(event) {
    if (event.data == YT.PlayerState.ENDED) {
        player.seekTo(0); //前曲の終了時間が次曲の開始時間を超える場合即終了処理が実行される問題に対処
        var play_elem = document.getElementById(playing_id);
        play_elem.setAttribute("class", "");

        //リスト最後尾分岐
        var elem_count = document.getElementById("playlist");
        if (elem_count.childElementCount <= now_playing) {
            player.stopVideo();
            now_playing = 0;
        } else {
            now_playing += 1;
            play_list();
        }
    }
}

//プレイリスト消去
function all_clear() {
    player.stopVideo();
    var play_elem = document.getElementById("playlist");
    play_elem.innerHTML = "";
}

//再生停止
function play_stop() {
    player.stopVideo();
    class_reset();
    now_playing = 0;
    playing_id = "";
}

//次曲
function play_next() {
    class_reset();
    var elem_count = document.getElementById("playlist");
    if (now_playing < elem_count.childElementCount) {
        now_playing += 1;
        play_list();
    } else {
        play_stop();
    }
}

//前曲
function play_previous() {
    class_reset();
    if (now_playing > 1) {
        now_playing -= 1;
        play_list();
    } else {
        play_stop();
    }
}

//再生中の色変更リセット
function class_reset() {
    if (now_playing != 0) {
        var play_elem = document.getElementById(playing_id);
        play_elem.setAttribute("class", "");
    }
}

//リスト削除
function del_list(id) {
    var elem = document.getElementById(id);
    var target = elem.parentElement;
    target.remove();
    refresh_id();
}

//リストを上へ
function up_list(id) {
    var elem = document.getElementById(id);
    var target = elem.parentElement.parentElement;
    var target_list = target.getElementsByTagName("div");
    var num = id.replace(/[^0-9]{1,}/g, '');
    var this_elem = target_list[(num - 1)];
    var above_elem = target_list[(num - 2)];
    target.insertBefore(this_elem, above_elem);
    refresh_id();
}

//リストを下へ
function down_list(id) {
    var elem = document.getElementById(id);
    var target = elem.parentElement.parentElement;
    var target_list = target.getElementsByTagName("div");
    var num = id.replace(/[^0-9]{1,}/g, '');
    var this_elem = target_list[(num - 1)];
    var below_elem = target_list[num];
    var first_elem = target_list[0];
    if (target_list.length == num) {
        target.insertBefore(this_elem, first_elem);
    } else {
        target.insertBefore(below_elem, this_elem);
    }
    refresh_id();
}

//リスト操作後IDを再設定
function refresh_id() {
    var elem = document.getElementById("playlist");
    var list = elem.getElementsByTagName("div");
    for (i = 0; i < list.length; i++) {
        var replace_head = "<span>&nbsp;" + (i + 1);
        var replace_text = "song" + (i + 1);
        var text = list[i].innerHTML;
        var pre_refreshed_text = text.replace(/song[0-9]{1,}/g, replace_text);
        var refreshed_text = pre_refreshed_text.replace(/<span>&nbsp;[0-9]{1,}/, replace_head);
        list[i].innerHTML = refreshed_text;
        list[i].setAttribute("id", replace_text);
    }
}