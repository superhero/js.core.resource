const
fs              = require('fs'),
stat            = require('util').promisify(fs.stat),
RestDispatcher  = require('@superhero/core/http/server/dispatcher/rest'),
BadRequest      = require('@superhero/core/http/server/dispatcher/error/bad-request'),
NotFound        = require('@superhero/core/http/server/dispatcher/error/page-not-found')

class ResourceEndpoint extends RestDispatcher
{
  async get()
  {
    const
    configuration = this.locator.locate('configuration'),
    path          = this.locator.locate('path')

    try
    {
      const
      filename    = this.route.filename   || this.request.url,
      directory   = this.route.directory  || configuration.find('resource.directory'),
      absolute    = path.normalize(filename),
      isAbsolute  = path.isAbsolute(absolute)

      if(!isAbsolute)
        throw new BadRequest('An absolute path is required')

      const
      resource  = path.main.dirname + '/' + directory + absolute,
      stats     = await stat(resource)

      if(!stats.isFile())
        throw new NotFound('Not found')

      const
      stream    = fs.createReadStream(resource),
      extension = path.extension(resource).toLowerCase(),
      // extension to content-type mapper
      mapper    = configuration.find('resource.content-type.mapper')

      if(extension in mapper)
        this.view.headers['Content-Type'] = mapper[extension]

      this.view.meta.view   = 'http/server/view/stream'
      this.view.meta.stream = stream
    }
    catch(error)
    {
      throw error.code === 'ENOENT'
        ? new NotFound('Not found')
        : error
    }
  }
}

module.exports = ResourceEndpoint
