document.getElementById('playBtn').addEventListener('click', function() {
    var name = document.getElementById('name').value;
    var color = document.getElementById('color').value;

    if (name.length < 1)
        document.getElementById('error').innerHTML = "Your name is <a href='#'>too short</a>.";
    else if (name.length > 14)
        document.getElementById('error').innerHTML = "Your name is <a href='#'>too long</a>.";
    else if (color == "")
        document.getElementById('error').innerHTML = "Please, <a href='#'>choose a color</a>.";
    else {
        joinGame(name, color);
    }
});