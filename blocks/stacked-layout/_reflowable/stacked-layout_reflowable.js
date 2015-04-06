modules.define('stacked-layout',
    ['i-bem__dom', 'functions__debounce'],
    function(provide, BemDom, debounce) {

var instances = [];
//function handleScroll(begin) {
//    var i = 0, instance;
//    requestAnimationFrame(function() {
//        while(instance = instances[i++]) {
//            instance._onScroll(begin);
//        }
//    });
//}

provide(BemDom.decl({ block : this.name, modName : 'reflowable', modVal : true }, {
    onSetMod : {
        'js' : {
            'inited' : function() {
                this._index = instances.push(this) - 1;

                this._items = this.domElem.children().get();
                this._offsetFirst = this._items[0].offsetLeft;
                this._lastIndex = this._items.length;

                //this.setMod('dirty', true);
                this._recalcLayout();
            },

            '' : function() {
                // TODO: remove me from `instances`
            }
        }
    },

    _recalcLayout : function() {
        var i = 1, item;
        while(item = this._items[i]) {
            if(item.offsetLeft === this._offsetFirst) {
                i--;
                break;
            }
            i++;
        }

        if(i !== this._lastIndex) {
            var prev = this._lastIndex;
            this._lastIndex = i;
            this.emit('reflow', { trailing : this._lastIndex, prevTrailing : prev });
        }

        this.delMod('dirty');
    },

    _onStartScroll : function() {
        this.setMod('dirty');
    },

    _onStopScroll : function() {
        this._recalcLayout();
    }
}, {
    live : function() {
        var onRequestScroll = debounce(this.handleScroll, 150, true),
            onScroll = debounce(this.handleScroll, 250);

        BemDom.win.on('resize', function() {
            onRequestScroll(true);
            onScroll();
        });

        return false;
    },

    handleScroll : function(start) {
        var i = 0, instance;
        requestAnimationFrame(function() {
            while(instance = instances[i++]) {
                start? instance._onStartScroll() : instance._onStopScroll();
            }
        });
    }
}));

});
