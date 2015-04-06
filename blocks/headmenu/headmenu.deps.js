({
    mustDeps : [
        { block :'i-bem', elems : 'dom' },
        { block : 'jquery', elem : 'events', mods : { type : 'pointer' } }
    ],
    shouldDeps : [
        { elems : ['item', 'more'] },
        { block : 'stacked-layout', mods : { reflowable : true } }
    ]
})
