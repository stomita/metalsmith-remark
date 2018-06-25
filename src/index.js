const path = require('path');
const remark = require('remark');
const html = require('remark-html');

module.exports = function metalsmithRemark (plugins, settings) {
    return function (files, metalsmith, done) {
        Object.keys(files).map(file => {
            const extension = path.extname(file);
            if (extension !== '.md' && extension !== '.markdown') {
                return true;
            }
            const markdown = String(files[file].contents);
            const result = remark().data('settings', settings || {}).use(plugins || []).use(html).process(markdown);
            files[file].contents = new Buffer(result.contents);
            const data = files[file];
            delete files[file];
            files[file.replace(extension, '.html')] = data;
        });
        setImmediate(done);
    };
}
