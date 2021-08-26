var soundContainer = null;
var soundObject = {};
$(document).ready(function(evt){
    initMode('.menu .mode');
    soundObject = new AudioUtil();
    soundContainer = $('.sound-container');
    $('.content-item').each(function(e){
        if($(this).find('a').length)
        {
            if($(this).find('a span').length)
            {

            }
            else
            {
                var text = $(this).find('a').text();
                $(this).find('a').empty().append('<span>'+text+'</span>');
            }
        }       
    });
    $(document).on('click', '.play-sound', function(e){
        e.preventDefault();
        var dataSound = $(this).attr('data-sound');
 
        if(soundObject.hasSound(dataSound))
        {
            soundObject.playSound(dataSound);
        }
        else
        {
            soundObject.createAndPlaySound(dataSound);
        }
    });
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
    $(document).on('click', '.touppercase', function(e){
        e.preventDefault();
        $(this).closest('.content-wrapper').removeClass('lowercase').addClass('uppercase');
    });
    $(document).on('click', '.tolowercase', function(e){
        e.preventDefault();
        $(this).closest('.content-wrapper').removeClass('uppercase').addClass('lowercase');
    });
});
