# Example MCP Servers

This directory contains two example [Model Context Protocol](https://modelcontextprotocol.io) servers that may help civil site engineers:

- `google-maps-server.js` – exposes a tool for geocoding addresses using the Google Maps Geocoding API. Set the `GOOGLE_MAPS_API_KEY` environment variable before running.
- `file-management-server.js` – provides simple tools to read and write UTF-8 text files on the local file system.

Run either server with Node.js:

```bash
node servers/google-maps-server.js
# or
node servers/file-management-server.js
```

Both servers communicate over stdio and can be plugged into any MCP-compatible client.
