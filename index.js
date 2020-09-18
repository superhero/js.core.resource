const
fs              = require('fs'),
stat            = require('util').promisify(fs.stat),
Dispatcher      = require('superhero/core/http/server/dispatcher'),
BadRequest      = require('superhero/core/http/server/dispatcher/error/bad-request'),
NotFound        = require('superhero/core/http/server/dispatcher/error/not-found')


class ResourceEndpoint extends Dispatcher
{
  async dispatch()
  {
    const
    console       = this.locator.locate('core/console'),
    configuration = this.locator.locate('core/configuration'),
    path          = this.locator.locate('core/path')

    try
    {
      const
      filename    = this.route.filename   || this.request.url,
      directory   = this.route.directory  || configuration.find('core.resource.directory'),
      absolute    = path.normalize(filename),
      isAbsolute  = path.isAbsolute(absolute)

      if(!isAbsolute)
        throw new BadRequest('An absolute path is required')

      const 
      relativeResource  = '/' + directory + absolute,
      absoluteResource  = path.main.dirname + relativeResource

      let stats

      try
      {
        stats = await stat(absoluteResource)
      }
      catch(error)
      {
        console.log('problem locating the resource file:', directory + absolute)
        throw error
      }

      if(!stats.isFile())
        throw new NotFound('Not found')

      const
      stream    = fs.createReadStream(absoluteResource),
      extension = path.extension(absoluteResource).toLowerCase(),
      // extension to content-type mapper
      mapper    = configuration.find('core.resource.content-type.mapper')

      try
      {
        if(extension in mapper)
          this.view.headers['Content-Type'] = mapper[extension]
      }
      catch(error)
      {
        if(!mapper)
          console.log('problem locating the configuration, did you add the module to the core context in the main index file?')

        throw error
      }

      this.view.meta.view   = 'core/http/server/view/stream'
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
