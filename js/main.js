// All rights reserved by author.

//テーマ切替
function changeStyle(state) {
    if (state == 2) {
        $('.theme').css({ 'color': '#ffffff', 'background-color': '#282828', 'border-color': '#ffffff' });
    } else {
        $('.theme').css({ 'color': '#000000', 'background-color': '#fafafa', 'border-color': '#000000' });
    }
    menu_img_toggle(state);
    repeat_button_img_toggle();
    playlist_img_toggle();
}

//画像テーマ切替
function menu_img_toggle(state) {
    var html_menu = $('#menu_list').html();
    var html_control = $('#play_control').html();
    var html_list = $('#playlist').html();
    var html_song = $('#selected_member').html();
    if (state == 2) {
        $('#menu_list').html(html_menu.replace(/_light.png/g, '_dark.png'));
        $('#play_control').html(html_control.replace(/_light.png/g, '_dark.png'));
        $('#playlist').html(html_list.replace(/_light.png/g, '_dark.png'));
        $('#selected_member').html(html_song.replace(/_light.png/g, '_dark.png'));
    } else {
        $('#menu_list').html(html_menu.replace(/_dark.png/g, '_light.png'));
        $('#play_control').html(html_control.replace(/_dark.png/g, '_light.png'));
        $('#playlist').html(html_list.replace(/_dark.png/g, '_light.png'));
        $('#selected_member').html(html_song.replace(/_dark.png/g, '_light.png'));
    }
}

//プレイリスト用画像テーマ切替
function playlist_img_toggle() {
    var html_list = $('#playlist').html();
    if (localStorage.getItem("theme_num") != null) {
        if (localStorage.getItem("theme_num") == 2) {
            $('#playlist').html(html_list.replace(/_light.png/g, '_dark.png'));
        } else {
            $('#playlist').html(html_list.replace(/_dark.png/g, '_light.png'));
        }
    } else {
        $('#playlist').html(html_list.replace(/_dark.png/g, '_light.png'));
    }

    var html_target = $('#playlist').find('.playing');
    if (html_target[0] != undefined) {
        var id = html_target[0].id;
        $('#' + id).html(html_target[0].innerHTML.replace(/_dark.png/g, '_light.png'));
    }
}

//コンテンツ切替
function toggle_contents(dom_id) {
    var childsAll = document.getElementById("contents").children;
    document.getElementById("contents").scrollTop = 0;
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

//メニューボタン動作
$(document).on('click', '.menu_list', function () {
    var selected_id = $(this).attr('id');
    if (selected_id == 'viewer_button') {
        toggle_viewer();
    } else {
        toggle_contents(selected_id.replace(/_button/, ""));
    }
});

//リピートボタン切替
function repeat_toggle() {
    if ($('input[id="loop"]').is(':checked')) {
        $('input[id="loop"]').prop('checked', false);
    } else {
        $('input[id="loop"]').prop('checked', true);
    }
    repeat_button_img_toggle();
    change_loop();
}

//リピートボタン画像切替
function repeat_button_img_toggle() {
    if ($('input[id="loop"]').is(':checked')) {
        $('#repeat_img').attr('src', 'img/repeat_active.png');
    } else {
        if (localStorage.getItem("theme_num") != null) {
            if (localStorage.getItem("theme_num") == 2) {
                $('#repeat_img').attr('src', 'img/repeat_dark.png');
            } else {
                $('#repeat_img').attr('src', 'img/repeat_light.png');
            }
        } else {
            $('#repeat_img').attr('src', 'img/repeat_light.png');
        }
    }
}

//メンバーリスト並び替え
function sort_member() {

}

//メンバーリスト選択
$(document).on('click', '.member_list', function () {
    var selected_id = $(this).attr('id');
    load_db(selected_id);
});

//プレイヤー表示切替
function toggle_viewer() {
    if ($('#viewer').is(':visible') == true) {
        $('#home').css('height', '100%');
        $('#song_list').css('height', '100%');
        $('#search').css('height', '100%');
        $('#settings').css('height', '100%');
    }
    $('#viewer').slideToggle(function () {
        if ($(this).is(':visible')) {
            $('#home').css('height', 'calc(100% - 201px)');
            $('#song_list').css('height', 'calc(100% - 201px)');
            $('#search').css('height', 'calc(100% - 201px)');
            $('#settings').css('height', 'calc(100% - 201px)');
        }
    });
}

//DB読み込み＆表示関数呼び出し
var processing_flag = false;
function load_db(member_name) {
    if (processing_flag == true) {
        return;
    } else {
        processing_flag = true;
    }
     
    var ele = document.getElementById("selected_member");
    ele.innerHTML = "";
    var url = location.protocol + "//" + location.host + "/db/" + member_name + ".json"
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
    processing_flag = false;
}

//曲リスト生成
function gen_songlist(json, div_id, member_name) {
    var title = document.createElement("div");
    title.innerHTML = json[0];
    document.getElementById(div_id).appendChild(title);

    var thumbs = document.createElement("img");
    var thumbs_url = "https://i.ytimg.com/vi/" + json[1] + "/mqdefault.jpg";
    thumbs.setAttribute("src", thumbs_url);
    thumbs.setAttribute("class", "thumbs");
    document.getElementById(div_id).appendChild(thumbs);

    var vid_id = "\'" + json[1] + "\'"

    var add_img_src = "";
    if (localStorage.getItem("theme_num") != null) {
        if (localStorage.getItem("theme_num") == 2) {
            add_img_src = "img/add_dark.png";
        } else {
            add_img_src = "img/add_light.png";
        }
    } else {
        add_img_src = "img/add_light.png";
    }

    for (j = 2; j < json.length; j++) {
        var list = document.createElement("div");

        var num1 = Number(json[j].end);
        var num2 = Number(json[j].start);
        var time_min = Math.floor((num1 - num2) / 60);
        var time_sec = (json[j].end - json[j].start) % 60;
        if (time_sec < 10) {
            var time_sec_fix = "0" + time_sec;
        } else {
            time_sec_fix = time_sec;
        }

        var button_ref = ["\'" + replace_space(member_name) + "\'", "\'" + replace_space(json[j].song_name) + "\'", "\'" + replace_space(json[j].artist_name) + "\'", json[j].start, json[j].end, vid_id];
        list.innerHTML = '<a href="javascript:add_playlist(' + button_ref + ');"' + "><img class='add_button' src='" + add_img_src + "'></a>&nbsp;" + 
            (j - 1) + " : " + json[j].song_name + "&nbsp;/&nbsp;" + json[j].artist_name + "&nbsp;/&nbsp;" + time_min + ":" + time_sec_fix;
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

    var img_type = "";
    if (localStorage.getItem("theme_num") != null) {
        if (localStorage.getItem("theme_num") == 2) {
            img_type = "_dark.png";
        } else {
            img_type = "_light.png";
        }
    } else {
        img_type = "_light.png";
    }

    var song_id = "song" + (count + 1);
    var song_url = song_id + "_url";
    var song_start = song_id + "_start";
    var song_end = song_id + "_end";
    var song = document.createElement("div");
    song.setAttribute("id", song_id);
    song.innerHTML = "<img class='liver_img' src='" + liver_thumbs_path + "' />" + "<span>&nbsp;" + (count + 1) + "&nbsp;:&nbsp;" + name + "&nbsp;/&nbsp;" + artist + "&nbsp;/&nbsp;" + time_min + ":" + time_sec_fix + "&nbsp;</span>" +
        "<var id='" + song_url + "'>" + vid_id + "</var>" + "<var id='" + song_start + "'>" + start + "</var>" + "<var id='" + song_end + "'>" + end + "</var>" +
        "<br>" + "<a href=\"javascript:del_list(\'" + song_id + "\');\"><img class=\'list_control_img\' src=\'img/del" + img_type + "\'></a><a href=\"javascript:down_list(\'" + song_id + "\');\"><img class=\'list_control_img\' src=\'img/down" + img_type + "\'></a><a href=\"javascript:up_list(\'" + song_id + "\');\"><img class=\'list_control_img\' src=\'img/up" + img_type + "\'></a>";
    document.getElementById("playlist").appendChild(song);
    save_playlist();
}

//空白文字置換
function replace_space(str) {
    return str.replace(/\s+/g, "&nbsp;");
}

//再生中の曲情報格納
var now_playing = 0;
var playing_id;

//プレイリスト再生
var slp_chk;
function play_list() {
    var chk_elem = document.getElementById("playlist")
    if (chk_elem.innerHTML == "") {
        return false;
    }

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
        'endSeconds': document.getElementById(video_end).textContent
    })
    playlist_img_toggle();
}

//APIロード時に自動実行
var player;
function onYouTubeIframeAPIReady() {
    player = new YT.Player('player', {
        height: '200',
        width: '356',
        videoId: 'X9zw0QF12Kc', //サクラカゼ
        playerVars: {
            'rel': 0,
        },
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
        var elem_loop = document.getElementById("loop");
        //ループ設定分岐
        if (elem_count.childElementCount <= now_playing && elem_loop.checked) {
            now_playing = 0;
        }

        if (elem_count.childElementCount <= now_playing) {
            player.stopVideo();
            now_playing = 0;
            playlist_img_toggle();
        } else {
            now_playing += 1;
            play_list();
        }
    }
}

//プレイリスト消去
function all_clear() {
    play_stop();
    var play_elem = document.getElementById("playlist");
    play_elem.innerHTML = "";
    save_playlist();
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
    var elem_loop = document.getElementById("loop");
    //ループ設定分岐
    if (elem_count.childElementCount <= now_playing && elem_loop.checked) {
        now_playing = 0;
    }
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
    var elem_count = document.getElementById("playlist");
    var elem_loop = document.getElementById("loop");
    //ループ設定分岐
    if (now_playing == 1 && elem_loop.checked) {
        now_playing = elem_count.childElementCount + 1;
    }
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
    playlist_img_toggle();
}

//リスト削除
function del_list(id) {
    var target = document.getElementById(id);
    target.remove();
    refresh_id();
    refresh_playing();
    save_playlist();
}

//リストを上へ
function up_list(id) {
    var elem = document.getElementById(id);
    var target = elem.parentElement;
    var target_list = target.getElementsByTagName("div");
    var num = id.replace(/[^0-9]{1,}/g, '');
    var this_elem = target_list[(num - 1)];
    var above_elem = target_list[(num - 2)];
    target.insertBefore(this_elem, above_elem);
    refresh_id();
    refresh_playing();
    save_playlist();
}

//リストを下へ
function down_list(id) {
    var elem = document.getElementById(id);
    var target = elem.parentElement;
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
    refresh_playing();
    save_playlist();
}

//リスト操作後IDを再設定
function refresh_id() {
    var elem = document.getElementById("playlist");
    var list = elem.getElementsByTagName("div");
    for (i = 0; i < list.length; i++) {
        var replace_head = "<span>&nbsp;" + (i + 1);
        var replace_text = "song" + (i + 1);
        var text = list[i].innerHTML;
        text = text.replace(/song[0-9]{1,}/g, replace_text);
        text = text.replace(/<span>&nbsp;[0-9]{1,}/, replace_head);
        list[i].innerHTML = text;
        list[i].setAttribute("id", replace_text);
    }
}

//再生中にプレイリストを操作した場合のグローバル変数修正
function refresh_playing() {
    var elem = document.getElementById("playlist");
    var list = elem.getElementsByTagName("div");
    var flag = false;
    for (i = 0; i < list.length; i++) {
        if (list[i].className == "playing") {
            now_playing = i + 1;
            playing_id = "song" + now_playing;
            flag = true;
        }
    }
    //再生中のリストが削除された場合の動作（再生停止）
    if (flag == false) {
        play_stop();
    }
    playlist_img_toggle();
}

//テーマ変更＆LocalStrageに設定を保存
function change_theme(state) {
    localStorage.setItem('theme_num', state);
    changeStyle(state);
}

//Loop設定変更＆LocalStrageに設定を保存
function change_loop() {
    if ($('input[id="loop"]').prop('checked') == true) {
        localStorage.setItem('loop', 1);
    } else {
        localStorage.setItem('loop', 0);
    }
}

//プレイリスト変更時LocalStrageに保存
function save_playlist() {
    var text = $('#playlist').html();
    localStorage.setItem("playlist", text);
}

//初期設定（LocalStrage読み込み）
function initialize() {
    //Player非表示
    $('#viewer').hide();

    //Loop設定読み込み＆チェックボタン設定
    if (localStorage.getItem("loop") != null) {
        if (localStorage.getItem("loop") == 1) {
            $('input[id="loop"]').prop('checked', true);
            repeat_button_img_toggle();
        }
    }

    //プレイリスト読み込み
    var text = localStorage.getItem("playlist");
    if (text != null) {
        $('#playlist').html(text.replace(/ class="playing"/, ""));
    }

    //テーマ読み込み＆ラジオボタン設定
    if (localStorage.getItem("theme_num") != null) {
        if (localStorage.getItem("theme_num") == 2) {
            changeStyle(localStorage.getItem("theme_num"));
            $('input[id="dark"]').prop('checked', true);
        }
    }
}