var nextPageToken, currentQuery, playedVideo, playDuration = 120000, player;
var $resultDisplay = $('#search-result'),
    $spinner = $('.spinner'),
    $loadMoreButton = $('#load-more-results'),
    $timerModal = $('#timer-modal'),
    $videoScreening = $('#video-screening');

$(document).ready(function() {
    if (localStorage.lastQuery) {
        $spinner.css('display', 'block');
        currentQuery = localStorage.lastQuery;
        performVideosSearch(currentQuery, null, function(err, res) {
            if (err) {
                $spinner.hide();
                return $resultDisplay.html('<h4 class="text-center">Fail to search! Please check your Internet connection and try again!</h4>');
            }
            nextPageToken = res.nextPageToken;
            $resultDisplay.append('<h4>Suggestions based on your most recent search:</h4>');
            res.items.forEach(function(item) {
                $resultDisplay.append(searchResult(item.snippet, item.id.videoId));
            });
            $resultDisplay.show();
            bindResultClickEvent();
            $spinner.hide();
            $loadMoreButton.css('display', 'block');
        });
    }

    $('#video-search').on( 'submit', function() {
        event.preventDefault();
        $spinner.css('display', 'block');
        $loadMoreButton.hide();
        currentQuery = $(this).find('input').val();
        localStorage.lastQuery = currentQuery;
        $resultDisplay.html('');
        performVideosSearch(currentQuery, null, function(err, res) {
            // console.log(res)
            if (err) {
                $spinner.hide();
                return $resultDisplay.html('<h4 class="text-center">Fail to search! Please check your Internet connection and try again!</h4>');
            }
            nextPageToken = res.nextPageToken;
            res.items.forEach(function(item) {
                $resultDisplay.append(searchResult(item.snippet, item.id.videoId));
            });
            $resultDisplay.show();
            bindResultClickEvent();
            $spinner.hide();
            $loadMoreButton.css('display', 'block');
        });
    });

    $loadMoreButton.click(function() {
        $(this).hide();
        $spinner.css('display', 'block');
        performVideosSearch(currentQuery, nextPageToken, function(err, res) {
            if (err) {
                $spinner.hide();
                $loadMoreButton.show();
                $resultDisplay.find('h4.text-center').remove();
                return $resultDisplay.append('<h4 class="text-center">Fail to load! Please check your Internet connection and try again!</h4>');
            }
            nextPageToken = res.nextPageToken;
            res.items.forEach(function(item) {
                $resultDisplay.append(searchResult(item.snippet, item.id.videoId));
            });
            bindResultClickEvent();
            $spinner.hide();
            $loadMoreButton.css('display', 'block');
        });
    });

    $('#timer').submit(function() {
        event.preventDefault();
        $timerModal.modal('hide');
        var minutesToPlay = $timerModal.find('input').val();
        if (minutesToPlay) playDuration = minutesToPlay * 60000;
        $videoScreening.show();
        player = new YT.Player('video-screening', {
            height: '390',
            width: '640',
            videoId: playedVideo,
            playerVars: {autoplay: 1, loop: 1, playlist: playedVideo},
            events: {
                'onReady': countDown
            }
        });
    });

});

function performVideosSearch(query, token, callback) {
    var data = {
        key: 'AIzaSyDZYAKp1cVowIRmnV4jXh_C2x0vDVLHvYU',
        part: 'snippet',
        type: 'video',
        q: query,
        videoDimension: '2d',
        videoEmbeddable: 'true'
    };
    if (token) data.pageToken = token;
    $.ajax({
        url: 'https://www.googleapis.com/youtube/v3/search',
        type: 'GET',
        data: data
    }).done(function(res) {
        callback(null, res);
    }).fail(function(res) {
        callback(true);
    });
}

function bindResultClickEvent() {
    $('.result').click(function() {
        $timerModal.modal('show');
        playedVideo = $(this).attr('id');
    });
}

function countDown() {
    setTimeout(function() {
        player.destroy();
        $videoScreening.html('<img class="img-responsive center-block ending-image" src="img/snack-time.jpg" />');
    }, playDuration);
}

//design
var searchResult = function(videoData, playId) {
    /*jshint multistr: true*/
    return '<div id="' + playId + '" class="row result">\
              <div class="col-sm-3 col-xs-12">\
                <img class="img-responsive" src="' + videoData.thumbnails.medium.url + '" />\
              </div>\
              <div class="col-sm-9 col-xs-12">\
                <h4>' + videoData.title + '</h4>\
                <p class="text-muted">' + videoData.channelTitle + '</p>\
                <p>' + videoData.description + '</p>\
              </div>\
            </div>';
};
