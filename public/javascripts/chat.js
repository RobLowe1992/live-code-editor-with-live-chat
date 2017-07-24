//Connection
const socket = io.connect('http://localhost:7000');

//jQuery Variables
const $message = $('#message'),
    $username = $('#username'),
    $send = $('#send'),
    $output = $('#output'),
    $feedback = $('#feedback');

//Event Listeners
$send.click(()=>{
    socket.emit('live-chat', {
        message: $message.val(),
        username: $username.val()
    });
    $message.val('');
});

$message.keypress(()=>{
    socket.emit('typing', $username.val())
});

socket.on('live-chat', (response)=>{
    let date = new Date().toString();
    let dateSplit = date.split(' ');
    let time = dateSplit[4].split('').splice(0,5).join('');
    $output.append(`<p class="comment"><strong class="users">${response.username}:</strong>${response.message}\n</p><br><p><em class="time">${time}</em></p>` );
    $feedback.css('display','none')
});

socket.on('typing', (response)=>{
    $feedback.css('display', 'initial')
    $feedback.html(`<p><em>${response} is typing a message...</em></p>`)
})

