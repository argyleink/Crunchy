var ShrinkerForm = (function(){
    var socket = io.connect(),
        form = $('form'),
        submitBtn = $('#form-submit-btn'),
        client_url_field = $('#to_be_short_url'),
        server_url_field = $('#short_url');
    
    socket.on('connect', function () {
        console.log('socket.io connected');
    });
    
    socket.on('url:get', function (msg) {
        server_url_field.text(msg);
    });
    
    function send(url) {
        socket.emit('url:put', url);
        submitBtn.button('loading');
    }
    
    form.submit(function(e){
        e.preventDefault();
        send(client_url_field.val());
        submitBtn.button('reset');
    });
})();