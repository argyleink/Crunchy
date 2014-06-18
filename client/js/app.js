var ShrinkerForm = (function(){
    var socket = io.connect(),
        customDomain = 'http://url-crunchy.herokuapp.com/',
        form = $('form'),
        submitBtn = $('#form-submit-btn'),
        client_url_field = $('#to_be_short_url'),
        server_url_field = $('#short_url');
    
    socket.on('connect', function () {
        console.log('socket.io connected');
    });
    
    socket.on('url:get', function (msg) {
        var crunchedUrl = customDomain + msg[0]._id;
        submitBtn.button('reset');
        submitBtn
            .attr('data-content', '<a href="'+crunchedUrl+'">'+crunchedUrl+'</a>')
            .popover('show');
    });
    
    function send(url) {
        socket.emit('url:put', url);
        submitBtn.button('loading');
    }
    
    form.submit(function(e){
        e.preventDefault();
        send(client_url_field.val());
    });
})();