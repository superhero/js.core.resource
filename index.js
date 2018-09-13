const
fs          = require('fs'),
path        = require('path'),
stat        = require('util').promisify(fs.stat),
base        = path.dirname(require.main.filename),
config      = require('./config_module'),
Dispatcher  = require('@superhero/core/controller/dispatcher')

module.exports = class extends Dispatcher
{
  async dispatch()
  {
    try
    {
      const
      pathname  = this.request.url.pathname,
      directory = this.route.directory || config.directory,
      resource  = base + '/' + directory + path.normalize(pathname),
      stats     = await stat(resource)

      if(!stats.isFile())
        throw 404

      const
      stream    = fs.createReadStream(resource),
      extension = path.extname(resource).toLowerCase(),
      headers   = {}

      if(extension in config.contentTypeMapper)
        headers['Content-Type'] = config.contentTypeMapper[extension]

      return { view:'stream', headers, stream }
    }
    catch(error)
    {
      if(error.code === 'ENOENT')
        throw 404
    }
  }
}
