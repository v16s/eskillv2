module.exports = {
    client: {
      service: {
        name: 'eskillv2',
        url: 'http://localhost:5000/graphql',
        // optional headers
        headers: {
          authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiQWRtaW4iLCJlbWFpbCI6ImFkbWluQGVza2lsbC5jb20iLCJ1c2VybmFtZSI6ImFkbWluIiwiZG9iIjpudWxsLCJkZXBhcnRtZW50IjpudWxsLCJpZCI6IjVjZjAwY2VkMDI3NDM5MDAwN2I4MmI4ZSIsImNhbXB1cyI6bnVsbCwibGV2ZWwiOjAsInBhc3N3b3JkIjoiJDJhJDEwJEtzV0x3NUxmVC9OdG1nMGp0Tnl3anVSYmhNM3F1aVgvODViR3EyUDJrT0tMazlkZjlrT1dtIiwiaWF0IjoxNTU5MjM1ODQ5fQ.ygbL3yw0gDCCFm6ujQT-U36Fh0K3ipPA7nW2EceE5VY'
        },
        // optional disable SSL validation check
        skipSSLValidation: true
      }
    }
  };