describe('resource dispatcher integration tests', async () =>
{
  const
  expect  = require('chai').expect,
  context = require('mochawesome/addContext'),
  Request = require('@superhero/request'),
  request = new Request({ url:'http://localhost:9001' }),
  core    = require('@superhero/core'),
  routes  =
  [
    {
      endpoint  : 'index',
      policy    : /^\/.+/
    }
  ]

  let server

  before(function(done)
  {
    require.main.filename = __filename
    context(this, { title:'routes', value:routes })
    server = core.server('http', routes, { debug:false })
    server.on('listening', () => done())
    server.listen(9001)
  })

  after(() => server.close())

  it('200 status response', async () =>
  {
    const file = await request.get('/file.jpg')
    expect(file.status).to.be.equal(200)
  })

  it('404 status response', async () =>
  {
    const file = await request.get('/none-existent.url')
    expect(file.status).to.be.equal(404)
  })

  it('jpg content-type header', async () =>
  {
    const file = await request.get('/file.jpg')
    expect(file.headers['content-type']).to.be.equal('image/jpeg')
  })

  it('gif content-type header', async () =>
  {
    const file = await request.get('/file.gif')
    expect(file.headers['content-type']).to.be.equal('image/gif')
  })

  it('png content-type header', async () =>
  {
    const file = await request.get('/file.png')
    expect(file.headers['content-type']).to.be.equal('image/png')
  })

  it('ico content-type header', async () =>
  {
    const file = await request.get('/file.ico')
    expect(file.headers['content-type']).to.be.equal('image/vnd.microsoft.icon')
  })

  it('css content-type header', async () =>
  {
    const file = await request.get('/file.css')
    expect(file.headers['content-type']).to.be.equal('text/css')
  })

  it('csv content-type header', async () =>
  {
    const file = await request.get('/file.csv')
    expect(file.headers['content-type']).to.be.equal('text/csv')
  })

  it('pdf content-type header', async () =>
  {
    const file = await request.get('/file.pdf')
    expect(file.headers['content-type']).to.be.equal('application/pdf')
  })

  it('json content-type header', async () =>
  {
    const file = await request.get('/file.json')
    expect(file.headers['content-type']).to.be.equal('application/json')
  })

  it('js content-type header', async () =>
  {
    const file = await request.get('/file.js')
    expect(file.headers['content-type']).to.be.equal('application/javascript')
  })
})
