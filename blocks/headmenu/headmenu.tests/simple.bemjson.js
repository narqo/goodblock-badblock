({
    block : 'page',
    head : [
        { elem : 'css', url : '_simple.css' },
        { elem : 'js', url : '_simple.js' }
    ],
    content : {
        block : 'headmenu',
        content: [
            { elem : 'item', url : '/', text : 'File' },
            { elem : 'item', url : '/', text : 'Edit' },
            { elem : 'item', url : '/', text : 'View' },
            { elem : 'item', url : '/', text : 'Navigate' },
            { elem : 'item', url : '/', text : 'Code' },
            { elem : 'item', url : '/', text : 'Refactor' },
            { elem : 'item', url : '/', text : 'Run' },
            { elem : 'item', url : '/', text : 'Tools' },
            { elem : 'item', url : '/', text : 'VCS' },
            { elem : 'item', url : '/', text : 'Window' },
            { elem : 'item', url : '/', text : 'Help' },
            //{ elem : 'item', mix : { elem : 'more' }, text : '···' }
        ]
    }
})
