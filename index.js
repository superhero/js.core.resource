const
  fs          = require('fs'),
  stat        = require('util').promisify(fs.stat),
  Dispatcher  = require('superhero/core/http/server/dispatcher'),
  BadRequest  = require('superhero/core/http/server/dispatcher/error/bad-request'),
  NotFound    = require('superhero/core/http/server/dispatcher/error/not-found')


class ResourceEndpoint extends Dispatcher
{
  async dispatch()
  {
    const
      console       = this.locator.locate('core/console'),
      configuration = this.locator.locate('core/configuration'),
      path          = this.locator.locate('core/path'),
      filename      = this.route.filename   || this.request.url,
      directory     = this.route.directory  || configuration.find('core.resource.directory'),
      dirname       = this.route.dirname    || path.dirname(filename),
      basename      = require('path').basename(filename),
      absolute      = path.normalize(dirname + '/' + basename),
      isAbsolute    = path.isAbsolute(absolute)

    if(!isAbsolute)
    {
      const error = new BadRequest('An absolute path is required')
      error.chain = { filename, dirname, absolute }
      throw error
    }

    const 
      relativeResource  = '/' + directory + absolute,
      absoluteResource  = path.main.dirname + relativeResource

    let stats

    try
    {
      stats = await stat(absoluteResource)

      if(!stats.isFile())
      {
        const error = new NotFound('Not found')
        error.code  = 'E_CORE_RESOURCE_IS_NOT_A_FILE'
        throw error
      }
    }
    catch(previousError)
    {
      console.log('problem locating the resource file:', directory + absolute)
      switch(previousError.code)
      {
        case 'ENOENT':
        case 'E_CORE_RESOURCE_IS_NOT_A_FILE':
        {
          const error = new NotFound('Not found')
          error.chain = { previousError, relativeResource, absoluteResource }
          throw error
        }
        default:
        {
          throw previousError
        }
      }
    }

    const
      stream    = fs.createReadStream(absoluteResource),
      extension = path.extension(absoluteResource).toLowerCase(),
      mapper    = configuration.find('core.resource.content-type.mapper')

    try
    {
      if(extension in mapper)
      {
        this.view.headers['content-type'] = mapper[extension]
      }
    }
    catch(error)
    {
      if(!mapper)
      {
        console.log('problem locating the configuration, did you add the module to the core context in the main index file?')
      }

      throw error
    }

    this.view.meta.view   = 'core/http/server/view/stream'
    this.view.meta.stream = stream
  }
}

module.exports = ResourceEndpoint
