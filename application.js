var nextPageToken, currentQuery, playedVideo, playDuration = 120000, previdActivity, directedAction, player;
var $resultDisplay = $('#search-result'),
    $spinner = $('.spinner'),
    $loadMoreButton = $('#load-more-results'),
    $timerModal = $('#timer-modal'),
    $videoScreening = $('#video-screening');

$(document).ready(function() {
    if (localStorage.lastQuery) {
        $spinner.css('display', 'block');
        currentQuery = localStorage.lastQuery;
        $resultDisplay.html('');
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
            $spinner.hide();
            $loadMoreButton.css('display', 'block');
        });
    }

    $(document).on( 'change', '#prevideo-activity', function (event) {
        if ( event.currentTarget.checked ) {
            $('#prevideo-activity-options').html(prevideoActivityOptions);
        } else {
            $('#prevideo-activity-options').html('');
        }
    });

    $(document).on( 'submit', '#video-search', function(event) {
        event.preventDefault();
        $spinner.css('display', 'block');
        $loadMoreButton.hide();
        currentQuery = $(event.currentTarget).find('input').val();
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
            $spinner.hide();
            $loadMoreButton.css('display', 'block');
        });
    });

    $(document).on('click', '.result', function(event) {
        $timerModal.modal('show');
        playedVideo = $(event.currentTarget).attr('id');
    });

    $(document).on('click', '#load-more-results', function(event) {
        $(event.currentTarget).hide();
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
            $spinner.hide();
            $loadMoreButton.css('display', 'block');
        });
    });

    $(document).on('submit', '#timer', function(event) {
        event.preventDefault();
        $timerModal.modal('hide');
        previdActivity = $(event.currentTarget).find('input[name="prevideo-activity"]:checked').val();
        var minutesToPrevidActivity = $(event.currentTarget).find('input[name="prevideo-duration"]').val() * 60000 || 120000;
        var minutesToPlay = $(event.currentTarget).find('input[name="time-duration"]').val();
        if (minutesToPlay) playDuration = minutesToPlay * 60000;
        directedAction = $(event.currentTarget).find('input[name="directed-action"]:checked').val();
        $videoScreening.show();
        switch (previdActivity) {
            case 'Draw':
                prevideoCountDown('./img/drawing.jpg', minutesToPrevidActivity);
                break;
            case 'Eat Snack':
                prevideoCountDown('./img/snack-time.jpg', minutesToPrevidActivity);
                break;
            default:
                player();
                break;
        }
    });

});

function prevideoCountDown (imgURL, duration) {
    $videoScreening.html('<img class="img-responsive centered" src="' + imgURL + '" />');
    setTimeout(function () {
        player();
    }, duration);
}

var player = function () {
    $videoScreening.html('');
    return new YT.Player('video-screening', {
        height: '390',
        width: '640',
        videoId: playedVideo,
        playerVars: {autoplay: 1, loop: 1, playlist: playedVideo},
        events: {
            'onReady': countDown
        }
    });
};

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

function countDown() {
    setTimeout(function() {
        player.destroy();
        var imgURL;
        switch (directedAction) {
            case 'Go Home':
                imgURL = './img/go-home.jpg';
                break;
            case 'Eat Snack':
                imgURL = './img/snack-time.jpg';
                break;
            case 'Draw':
                imgURL = './img/drawing.jpg';
                break;
            default:
                imgURL = './img/go-home.jpg';
                break;
        }
        $videoScreening.html('<img class="img-responsive centered" src="' + imgURL + '" />');
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

/*jshint multistr: true */
var prevideoActivityOptions =  '<input type="radio" name="prevideo-activity" id="previd-drawing" value="Draw" checked />\
                                <label for="previd-drawing" class="radio-inline btn btn-default">Draw</label>\
                                <input type="radio" name="prevideo-activity" id="previd-eat-snack" value="Eat Snack" />\
                                <label for="previd-eat-snack" class="radio-inline btn btn-default">Eat Snack</label>\
                                <br /><br />\
                                <fieldset class="form-group">\
                                <label for="prevideo-duration">Duration to do prevideo Activity</label>\
                                <input type="number" name="prevideo-duration" class="form-control" placeholder="This will be in minutes, default to 2 mins..."/>\
                                </fieldset>';
