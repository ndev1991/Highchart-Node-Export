## Highchart Node Service to generate images on server side

- Simple node.js service that generate PNG, JPG, SVG format and Base64 data on server side.

### Install

```
npm install
npm run dev

http://localhost:8000
```

- To avoid any interaction installing on local machine

```
npm install < input.txt
```

### Docker

```
docker build . -t <your username>/highchart-node-app

docker run -p 49160:8000 -d <your username>/highchart-node-app

http://localhost:49160
```
