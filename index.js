const sourceMap = require('source-map')
module.exports = function(source, map, meta) {
  try {
    let entryValues = Object.values(this._compiler.options.entry)
    let entryArr = []
    entryValues.forEach(entryValue => {
      entryArr.push(entryValue.import[0])
    });
  
    let content = source
    if (entryArr.includes(this.resourcePath)) {

      content = `
        import { run } from '@hummer/tenon-dev-tool/dist/tenon-dev-tool.es';
        ${source}
        setTimeout(() => {
          try {
            __GLOBAL__.Hummer.getRootView().dbg_getDescription((res)=> {
              run(res, 'hummer')
            }, 0)
          } catch () {
            console.log('[DEVTOOL]: fail to get tree view')
          }
        }, 0);
      `;

      let originMap = new sourceMap.SourceMapGenerator({})
      const lines = content.split('\n')
      lines.forEach((line, index) => {
        for (let i = 0; i < line.length; i++) {
          if (!/\s/.test(line[i])) {
            originMap.addMapping({
              source: this.resourcePath,
              original: {
                  line: index + 1,
                  column: i
              },
              generated: {
                  line: index + 1 + 2,
                  column: i
              }
            });
          }
        }
      });
      this.callback(null, content, originMap, meta);
    } else {
      this.callback(null, content, map, meta);
    }
  } catch (error) {
    this.callback(null, source, map, meta);
  }
}