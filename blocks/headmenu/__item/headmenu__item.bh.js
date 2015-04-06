module.exports = function(bh) {
    bh.match('headmenu__item', function(ctx, json) {
        if(json.url) {
            return {
                block : 'link',
                mix : [
                    { block : json.block, elem : json.elem },
                    { block : 'stacked-layout', elem : 'item' }
                ],
                url : json.url,
                content : json.text
            };
        }

        ctx
            .tag('span')
            .mix({ block : 'stacked-layout', elem : 'item' })
            .content(json.text)
    });
};
