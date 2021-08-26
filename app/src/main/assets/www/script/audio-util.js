function AudioUtil()
{
    this.soundList = {};
    this.createAndPlaySound = function(dataSound)
    {
        var file = 'sounds/'+dataSound+'.mp3';
        var sound = new Audio();
        sound.onloadeddata = function()
        {
            _this.playSound(dataSound);
        }
        sound.src = file;
        _this.soundList[dataSound] = sound;
    }
    this.createSound = function(dataSound)
    {
        var file = 'sounds/'+dataSound+'.mp3';
        var sound = new Audio();
        sound.src = file;
        _this.soundList[dataSound] = sound;
    }
    this.playSound = function(dataSound){
        var sound = _this.soundList[dataSound];
        if(typeof sound != 'undefined')
        {
            sound.play();
        }
        else
        {
            this.createAndPlaySound(dataSound);
        }
    }
    this.hasSound = function(dataSound)
    {
        var has = this.soundList[dataSound];
        var ok = false;
        if(typeof has != 'undefined')
        {
            ok = true;
        }
        return ok;
    }
    this.getTextFromArray = function(dataSounds)
    {
        var list = [];
        var i;
        for(i = 0; i<dataSounds.length; i++)
        {
            list.push(dataSounds[i].text);
        }
        return list;
    }
    this.geTimeAfterFromArray = function(dataSounds)
    {
        var list = [];
        var i;
        for(i = 0; i<dataSounds.length; i++)
        {
            list.push(dataSounds[i].after);
        }
        return list;
    }
    this.playSquence = function(dataSounds, callback)
    {
        var textList = this.getTextFromArray(dataSounds);
        if(!this.allLoaded(textList))
        {
            this.prepareSquence(dataSounds, function(list){
                _this.doPlaySquence(dataSounds, callback);
            });
        }
        else
        {
            _this.doPlaySquence(dataSounds, callback);
        }
    }
    this.doPlaySquence = function(dataSounds, callback)
    {
        var textList = this.getTextFromArray(dataSounds);
        var after = this.geTimeAfterFromArray(dataSounds);
        var container = document.getElementById('player');
        container.innerHTML = '';
        var sounds = [];
        var i;
        for(i = 0; i<textList.length; i++)
        {
            sounds[i] = new Audio(_this.soundList[textList[i]].src);
        }
        for(i = 0; i<sounds.length; i++)
        {
            var curSound = sounds[i];
            curSound.setAttribute('id', 'sound-'+i);
            curSound.setAttribute('data-index', i);
            curSound.setAttribute('data-after', after[i]);
            if(typeof callback != 'undefined')
            {
                curSound.addEventListener('play', function(e){
                    callback(e);
                });
            }
            if(i == sounds.length - 1)
            {
                /**
                 * Do nothink
                 */
            }
            else
            {
               curSound.addEventListener('ended', _this.playNext, true);                  
            }          
            container.appendChild(curSound);
        }
        document.getElementById('sound-'+0).play();
    }
    this.playNext = function(e){
        setTimeout(function(){
            var idx0 = parseInt(e.target.getAttribute('data-index'));
            var after = parseInt(e.target.getAttribute('data-after'));
            var idx1 = idx0 + 1;
            var nextSound = document.getElementById('sound-'+idx1);
            if(typeof nextSound != 'undefined')
            {
                setTimeout(function(){
                    nextSound.play();
                }, after);               
            }
            setTimeout(function(){
                document.getElementById('sound-'+idx0).removeEventListener('ended', _this.playNext, true);
            }, 10);
        }, 0);
    }
    
    this.allLoaded = function(dataSounds)
    {
        var i;
        for(i in dataSounds)
        {
            var dataSound = dataSounds[i];
            if(!_this.hasSound(dataSound))
            {
                return false;
            }
        }
        return true;
    }
    this.prepareSquence = function(dataSounds, callback)
    {
        var textList = this.getTextFromArray(dataSounds);
        var toBeLoaded = [];
        var i;
        for(i in dataSounds)
        {
            var dataSound = textList[i];
            if(!_this.hasSound(dataSound))
            {
                toBeLoaded.push(dataSound);
            }
        }
        this.load(toBeLoaded, 0, callback);   
    }

    this.load = function(toBeLoaded, index, callback)
    {
        var file = '';
        var dataSound = toBeLoaded[index];
        file = 'sounds/'+dataSound+'.mp3';

        var sound = new Audio();
        sound.onloadeddata = function()
        {
            if(index >= toBeLoaded.length - 1)
            {
                callback();
            }
            else
            {
                _this.load(toBeLoaded, index+1, callback)
            }
        }
        sound.src = file;
        _this.soundList[dataSound] = sound;
    }
    var _this = this;
}