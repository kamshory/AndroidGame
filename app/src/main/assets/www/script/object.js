var soundContainer = null;
var soundObject = {};
$(document).ready(function(evt){
    initMode('.menu .mode');
    soundObject = new AudioUtil();
    soundContainer = $('.sound-container');
    $(document).on('click', '.spell', function(e){
        e.preventDefault();
        var dataSound = $(this).attr('data-sound');
        var mode = getMode('.menu .mode');
        if(mode == 'spell')
        {
            var sequence = createSequence(dataSound);
            $(this).closest('.content-wrapper').find('.content-item').removeClass('item-played');
            $(this).closest('.content-wrapper').find('.content-hilight').removeClass('content-hilight');
            $(this).closest('.content-wrapper').find('.content-item span > span').removeClass('text-hilight')
            $(this).closest('.content-item').removeClass('item-played').addClass('item-played');
            playSquence(sequence, function(e2){
                var index = e2.target.getAttribute('data-index');
                var obj2 = $('.item-played .spell span > span').filter('[data-index="'+index+'"]');
                if(obj2.length)
                {
                    obj2.siblings().removeClass('text-hilight');
                    obj2.removeClass('text-hilight').addClass('text-hilight');
                }
                else
                {
                    $('.spell span > span').removeClass('text-hilight');
                    setTimeout(function(){
                        $('.item-played').addClass('content-hilight');
                        setTimeout(function(){
                            $('.item-played').removeClass('content-hilight');
                        }, 2400);
                    }, 1000);
                    
                }
            });
        }
        else if(mode == 'read')
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
        else if(mode == 'game')
        {
            answerQuestion(dataSound);
        }
    });
    var obj = JSON.parse(JSON.stringify(objectData));
    obj = shuffle(obj);
    buildUI(obj);
    splitTextToSpell();
});

function buildUI(objectData){
    var obj2 = [];
    var i;
    var k = 0;
    var textLower = '';
    var textUpper = '';
    var emoji = '';
    var line = '';
    var maxObj = 15;
    for(i = 0; i<objectData.length && i < maxObj; i++)
    {
        k = Math.floor(i/5);
        textLower = objectData[i].text.toLowerCase();
        textUpper = objectData[i].text.toUpperCase();
        emoji = objectData[i].emoji;
        line = '<div class="content-item object shake"><a href="#" class="spell" data-sound="'+textLower+'"><div class="emoji">'+emoji+'</div><span>'+textUpper+'</span></a></div>';
        if(typeof obj2[k] == 'undefined')
        {
            obj2[k] = [];
        }
        obj2[k].push(line);
    }
    var lines = [];
    for(i = 0; i<obj2.length; i++)
    {
        lines[i] = obj2[i].join('\r\n');
    }
    var content = '<div class="content-row">'+lines.join('</div><div class="content-row">')+'</div>';
    $('.content-wrapper').html(content);

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
