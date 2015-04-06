module.exports = function(bh) {
    bh.match('headmenu', function(ctx, json) {
        ctx
            .js(true)
            .mix({ block : 'stacked-layout', mods : { reflowable : true }, js : true });
    });
};
