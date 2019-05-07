module.exports =
{
  resource:
  {
    'directory'     : 'test/public',
  },
  http:
  {
    server:
    {
      routes:
      {
        resource:
        {
          url       : '/resource/.+',
          method    : 'GET',
          allowed   : ['GET'],
          endpoint  : '/'
        }
      }
    }
  }
}
