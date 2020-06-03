function handlePermission() {
    var ua = navigator.userAgent.toLowerCase();
    console.log('User Agent: ' + ua);
    if (ua.indexOf('safari') != -1) { 
        if (ua.indexOf('chrome') > -1) {
            console.log('Browser: Chrome')
        } else {
            console.log('Browser: Safari')
            return
        }
    }
    if (ua.indexOf('firefox') != -1) {
        console.log('Browser: Firefox')
        return
    }
    navigator.permissions.query({name:'clipboard-read'}).then(function(result) {
        if (result.state == 'granted') {
        report(result.state);
        } else if (result.state == 'prompt') {
        report(result.state);
        } else if (result.state == 'denied') {
        report(result.state);
        }
        result.onchange = function() {
        report(result.state);
        }
    });
}

function report(state) {
    console.log('Permission ' + state);
}

handlePermission();

var i = 0;
var wps = 300;
var speed = 200;

function changeWPS(delta) {
    wps += delta
    speed = 60000 / wps
    document.getElementById('wps').innerHTML = wps
}

function renderText(text) {
  setTimeout(function() {
    word = text.split(' ')[i]
    document.getElementById('word').innerHTML = word
    i++;
    if (i < text.split(' ').length) {
      renderText(text);
    } else {
        i = 0
    }
  }, speed)
}


function clipboardPaste() {
    if (navigator.clipboard.readText) {
        navigator.clipboard.readText()
        .then(text => {
            console.log('Pasted content: ', text);
            document.getElementById("content").innerHTML = text;
            renderText(text);
        })
        .catch(err => {
            console.error('Failed to read clipboard contents: ', err);
        });
    } else {
        // не работает в мозиле, мб через экстеншен проканает
        document.designMode = "on"
        var pasteText = document.querySelector("#output");
        pasteText.contentEditable = true;
        pasteText.focus();
        document.execCommand("paste");
        console.log('Pasted content: ', pasteText.textContent);
        document.getElementById("content").innerHTML = pasteText.textContent;
        var text = pasteText.textContent;
        renderText(text);
    }
}
document.getElementById('wps').innerHTML = wps
document.querySelector("#paste").addEventListener("click", clipboardPaste);