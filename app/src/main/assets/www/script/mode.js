var prefixStorage = 'abcgame_';
function readStorage()
{
    var key = prefixStorage+'mode'
    var mode = window.localStorage.getItem(key) || 'spell';
    return mode;
}
function setMode(mode, item)
{
    var key = prefixStorage+'mode'
    window.localStorage.setItem(key, mode);
    updateUI(mode, item);
}
function getMode(selector)
{
    var obj = $(selector);
    var modes = obj.attr('data-mode-list').split(',');
    var mode = '';
    if(obj.find('li.active').length)
    {
        mode = obj.find('li.active').find('a').attr('data-mode');
    }
    else
    {
        mode = modes[0];
    }
    return mode;
}
function initMode(selector)
{
    $(document).on('click', selector+' li a', function(e){
        e.preventDefault();
        var mode2 = $(this).attr('data-mode');
        setMode(mode2, e.target);
    });
    var mode1 = readStorage();
    createUI(selector, mode1);
}
function createUI(selector, mode)
{
    var map = {'spell':'EJA', 'read':'BACA', 'game':'CARI'};
    var obj = $(selector);
    var modes = obj.attr('data-mode-list').split(',');
    if($.inArray(mode, modes) == -1)
    {
        mode = modes[0];
    }
    var active = '';
    for(var i = 0; i<modes.length; i++)
    {
        if(mode == modes[i])
        {
            active = ' class="active"';
        }
        else
        {
            active = '';
        }
        obj.append('<li'+active+'><a href="#" data-mode="'+modes[i]+'">'+map[modes[i]]+'</a></li> ');
    }
}
function updateUI(mode, item)
{
    $('.menu .mode li').removeClass('active');
    if(typeof item != 'undefined')
    {
        $(item).closest('li').addClass('active');
    }
}
function shuffle(array) 
{
    var currentIndex = array.length, temporaryValue, randomIndex;
    while (0 !== currentIndex) 
    {  
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }  
    return array;
}
var lastText = '';
var gameTimeout = setTimeout('', 100);
var soundTimeout1 = setTimeout('', 100);
var soundTimeout2 = setTimeout('', 100);
var allowAnswer = false;
function startGame()
{
    $('#player').empty();
    clearTimeout(gameTimeout);
    clearTimeout(soundTimeout1);
    allowAnswer = true;
    var list = [];
    $('.content-wrapper').find('.content-item').each(function(e){
        var txt = $(this).find('a').attr('data-sound');
        if(typeof txt != 'undefined')
        {
            list.push(txt);
        }
    });
    list = shuffle(list);
    var nextText;
    var i = 0;
    do{
        nextText = list[i];
        i++;
    }
    while(typeof nextText == 'undefined');
    playSound('tunjukkan');
    soundTimeout1 = setTimeout(function(){
        lastText = nextText;
        playSound(lastText);
    }, 2400)
    gameTimeout = setTimeout(function(){
        playSound('waktuhabis');
        allowAnswer = false;
    }, 12000);
    
}
function answerQuestion(text)
{
    clearTimeout(gameTimeout);
    clearTimeout(soundTimeout1);
    if(allowAnswer)
    {
        if(lastText != '')
        {
            if(text == lastText)
            {
                playSound('benar');
                allowAnswer = false;
            }
            else
            {
                playSound('salah');
                allowAnswer = false;
            }
            setTimeout(function(){
                allowAnswer = false;
                startGame();
            }, 4400);
        }
    }
    else
    {
        startGame();
    }
    
    
}
function splitTextToSpell()
{
    $('.content-wrapper').find('.content-item span').each(function(e){
        var text = $(this).text();
        text = text.trim();
        var arr = text.split('');
        var spans = [];
        for(var i = 0; i<arr.length; i++)
        {
            spans.push('<span data-index="'+i+'">'+arr[i]+'</span>');
        }
        $(this).empty().append(spans.join(''));
    });
}
function playSound(dataSound)
{
    if(soundObject.hasSound(dataSound))
    {
        soundObject.playSound(dataSound);
    }
    else
    {
        soundObject.createAndPlaySound(dataSound);
    }
}
function playSquence(dataSounds, callback)
{
    soundObject.playSquence(dataSounds, callback);
}
function createSequence(dataSounds)
{
    var sequence = [];
    var letters = dataSounds.split('');
    var i;
    for(i = 0; i<letters.length; i++)
    {
        sequence.push({'text':letters[i], 'after':20});
    }
    sequence.push({'text':'dibaca', 'after':200});
    sequence.push({'text':dataSounds, 'after':50});
    return sequence;
}
