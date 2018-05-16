const
fs          = require('fs'),
path        = require('path'),
readFile    = require('util').promisify(fs.readFile),
base        = path.dirname(require.main.filename),
config      = require('./config'),
Dispatcher  = require('@superhero/core/controller/dispatcher')

module.exports = class extends Dispatcher
{
  async dispatch()
  {
    try
    {
      require('@superhero/debug').log(base + '/' + config.directory + path.normalize(this.request.url.pathname))

      const
      pathname  = this.request.url.pathname,
      resource  = base + '/' + config.directory + path.normalize(pathname),
      extension = path.extname(resource).toLowerCase(),
      headers   = { 'Content-Type' : config.contentTypeMapper[extension] },
      body      = await readFile(resource, 'utf-8')

      return { view:'raw', headers, body }
    }
    catch(error)
    {
      throw 404
    }
  }
}
