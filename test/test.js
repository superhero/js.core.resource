describe('resource dispatcher integration tests', async () =>
{
  const
  expect  = require('chai').expect,
  context = require('mochawesome/addContext'),
  Request = require('@superhero/request'),
  request = new Request({ url:'http://localhost:9001' }),
  Core    = require('@superhero/core'),
  config  =
  {
    routes:
    [
      {
        endpoint  : 'index',
        policy    : /^\/.+/
      }
    ]
  },
  core = new Core(config)

  let server

  before(function(done)
  {
    require.main.filename = __filename
    context(this, { title:'routes', value:config.routes })
    server = core.server('http', config.routes, { debug:false })
    server.on('listening', () => done())
    server.listen(9001)
  })

  after(() => server.close())

  it('404 status response', async () =>
  {
    const file = await request.get('/none-existent.url')
    expect(file.status).to.be.equal(404)
  })

  it('jpg content-type header', async () =>
  {
    const file = await request.get('/file.jpg')
    expect(file.headers['content-type']).to.be.equal('image/jpeg')
    expect(file.status).to.be.equal(200)
  })

  it('gif content-type header', async () =>
  {
    const file = await request.get('/file.gif')
    expect(file.headers['content-type']).to.be.equal('image/gif')
    expect(file.status).to.be.equal(200)
  })

  it('png content-type header', async () =>
  {
    const file = await request.get('/file.png')
    expect(file.headers['content-type']).to.be.equal('image/png')
    expect(file.status).to.be.equal(200)
  })

  it('ico content-type header', async () =>
  {
    const file = await request.get('/file.ico')
    expect(file.headers['content-type']).to.be.equal('image/vnd.microsoft.icon')
    expect(file.status).to.be.equal(200)
  })

  it('css content-type header', async () =>
  {
    const file = await request.get('/file.css')
    expect(file.headers['content-type']).to.be.equal('text/css')
    expect(file.status).to.be.equal(200)
  })

  it('csv content-type header', async () =>
  {
    const file = await request.get('/file.csv')
    expect(file.headers['content-type']).to.be.equal('text/csv')
    expect(file.status).to.be.equal(200)
  })

  it('pdf content-type header', async () =>
  {
    const file = await request.get('/file.pdf')
    expect(file.headers['content-type']).to.be.equal('application/pdf')
    expect(file.status).to.be.equal(200)
  })

  it('json content-type header', async () =>
  {
    const file = await request.get('/file.json')
    expect(file.headers['content-type']).to.be.equal('application/json')
    expect(file.status).to.be.equal(200)
  })

  it('js content-type header', async () =>
  {
    const file = await request.get('/file.js')
    expect(file.headers['content-type']).to.be.equal('application/javascript')
    expect(file.status).to.be.equal(200)
  })
})
