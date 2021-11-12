module.exports = function(source) {
  try {
    let entryValues = Object.values(this._compiler.options.entry)
    let entryArr = []
    entryValues.forEach(entryValue => {
      entryArr.push(entryValue.import[0])
    });
  
  
    if (entryArr.includes(this.resourcePath)) {
      return `
        import {run} from '@hummer/tenon-dev-tool/dist/tenon-dev-tool.es';
        
        ${source}
        
        setTimeout(() => {
          __GLOBAL__.Hummer.getRootView().dbg_getDescription((res)=> {
            console.log(res)
            run(res, 'hummer')
          }, 0)
        }, 0);
      `;
    } else {
      return source
    }
    
  } catch (error) {
    return source
  }

	
}