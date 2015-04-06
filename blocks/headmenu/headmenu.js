modules.define('headmenu', ['i-bem__dom', 'jquery', 'stacked-layout'], function(provide, BemDom, $, _) {

var undef;

provide(BemDom.decl(this.name, {
    onSetMod : {
        'js' : {
            'inited' : function() {
                this._firstTrailing = undef;
                this._moreSwitcher = $('<span class="' + this.__self.buildClass('more') + '">···</span>');
                this._morePopup = null;

                this
                    .findBlockOn('stacked-layout')
                    .on({ modName : 'dirty', modVal : 'true' }, this._onLayoutDirty, this);

            },

            '' : function() {
                this._morePopup && this._morePopup.remove();
            }
        },

        'has-more' : {
            'true' : function() {
                this.bindTo(this._moreSwitcher, 'pointerclick', this._onMoreClick);
            },

            '' : function() {
                this.unbindFrom(this._moreSwitcher, 'pointerclick', this._onMoreClick);
            }
        }
    },

    _getMorePopup : function() {
        return this._morePopup ||
            // TODO: use `popup`
            (this._morePopup = $('<div class="popup"></div>').appendTo(BemDom.scope));
    },

    _onLayoutReflow : function(e, data) {
        var items = this.elem('item');

        if(items.length === data.trailing) {
            this.delMod('has-more');
            this._firstTrailing = undef;
        } else {
            this._moreSwitcher.insertAfter(items[data.trailing]);
            this._firstTrailing = data.trailing + 1;
            this.setMod('has-more');
        }
    },

    _onLayoutDirty : function() {
        this.delMod('has-more');
    },

    _onMoreClick : function() {
        if(this.hasMod(this._moreSwitcher, 'opened')) {
            return;
        }

        var cls = this.__self.buildClass('item'),
            items = this.elem('item')
                .slice(this._firstTrailing)
                .map(function(i, item) {
                    return '<span class="' + cls + '">' + item.innerHTML + '</span>';
                })
                .get();
        this._getMorePopup().html(items);
    }
}, {
    live : function() {
        this.liveInitOnBlockEvent('reflow', 'stacked-layout', this.prototype._onLayoutReflow);
    }
}));

});
