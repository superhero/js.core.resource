module.exports =
{
  core:
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
            method    : 'get',
            endpoint  : '/',
            input     : false
          }
        }
      }
    }
  }
}
