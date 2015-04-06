var fs = require('fs'),
    path = require('path'),
    glob = require('glob'),
    mkdirp = require('mkdirp'),
    techs = require('enb-bem-techs'),
    fileProvider = require('enb/techs/file-provider'),
    fileCopy = require('enb/techs/file-copy'),
    deps = require('enb-modules/techs/deps-with-modules'),
    stylus = require('enb-stylus/techs/css-stylus'),
    autoprefixer = require('enb-autoprefixer'),
    bh = require('enb-bh/techs/bh-server'),
    html = require('enb-bh/techs/html-from-bemjson'),
    browserJs = require('enb-diverse-js/techs/browser-js'),
    modules = require('enb-modules/techs/prepend-modules'),
    borschik = require('enb-borschik/techs/borschik'),
    TESTS_PATH_RE = /(\w+)\.(tests|examples)\/(\w+)\.bemjson\.js$/;

module.exports = function(config) {
    createTestsNodes(config);
};

function createTestsNodes(config) {
    // TODO: make it sync
    glob('blocks/**/*.tests/*.bemjson.js', function(err, files) {
        if(err) throw err;
        files.forEach(bemjsonNodeFactory(config));
    });
    //bemjsonNodeFactory(config)('blocks/headmenu/headmenu.tests/simple.bemjson.js')

    config.nodes('tests/*/*', function(nodeConfig) {
        var tech = techFactory(nodeConfig);

        tech(techs.levels, { levels : getLevels(config) });
        tech(techs.bemjsonToBemdecl);
        tech(deps);
        tech(techs.files);
        tech(bh, { jsAttrName : 'data-bem', jsAttrScheme : 'json', sourceSuffixes : ['bh.js'] });
        tech(html);

        tech(stylus, { target : '?.css' });
        tech(autoprefixer, { sourceTarget : '?.css', destTarget : '_?.css' });

        tech(browserJs);
        tech(modules, { source : '?.browser.js', target : '?.js' });
        tech(borschik, { sourceTarget : '?.js', destTarget : '_?.js', minify : false });

        nodeConfig.addTargets(['?.html', '_?.css', '_?.js']);
    });
}

function techFactory(nodeConfig) {
    return function(tech, opts) {
        nodeConfig.addTech(opts? [tech, opts] : tech);
    };
}

function bemjsonNodeFactory(config) {
    return function(src) {
        var nodeName = '';
        src.replace(TESTS_PATH_RE, function(_, bemItem, type, name) {
            nodeName = [type, bemItem, name].join(path.sep);
        });

        mkdirp.sync(config.resolvePath(nodeName));

        config.node(nodeName, function(nodeConfig) {
            var tech = techFactory(nodeConfig),
                destDir = nodeConfig.getNodePath(),
                srcTarget = resolveSrcTarget(config, src, destDir);

            tech(fileProvider, { target : srcTarget });
            tech(fileCopy, { sourceTarget : srcTarget, destTarget : '?.bemjson.js' });

            nodeConfig.addTargets(['?.bemjson.js']);
        });
    };
}

function resolveSrcTarget(config, src, dest) {
    return path.relative(dest, config.resolvePath(src));
}

function getLevels(config) {
    return [
        'libs/bem-core/common.blocks',
        'libs/bem-core/desktop.blocks',
        'libs/bem-components/common.blocks',
        'libs/bem-components/desktop.blocks',
        'blocks'
    ].map(config.resolvePath.bind(config));
}
