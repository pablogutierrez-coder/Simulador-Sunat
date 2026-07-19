import { mkdir, writeFile } from 'node:fs/promises'

const worker = `const assetRequest = (request, pathname) => {
  const url = new URL(request.url)
  url.pathname = pathname
  return new Request(url, request)
}

export default {
  async fetch(request, env) {
    const response = await env.ASSETS.fetch(request)
    if (response.status !== 404) {
      return response
    }

    return env.ASSETS.fetch(assetRequest(request, '/index.html'))
  },
}
`

await mkdir('dist/server', { recursive: true })
await writeFile('dist/server/index.js', worker)
