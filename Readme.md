# Real-Time Tracker

A real-time location sharing app built with Node.js, Express, Socket.io, Leaflet and Lottie markers.

## Highlights

- Live geolocation updates from browser devices
- Real-time marker sync using Socket.io
- Session-based tracking rooms using `?session=<id>`
- Auto fit-bounds for all active participants
- Minimal UI panel showing session, status and online count

## Tech Stack

- Backend: Node.js, Express, Socket.io
- Frontend: EJS, vanilla JavaScript, CSS
- Maps: Leaflet + OpenStreetMap
- Animation: lottie-web

## Run Locally

```bash
npm install
npm start
```

Open: [http://localhost:3000](http://localhost:3000)

## Multi-device Test

Open the app in two browsers/devices with the same session id:

- `http://localhost:3000/?session=team-alpha`
- `http://localhost:3000/?session=team-alpha`

If session ids differ, their markers are isolated in separate rooms.

## Optional Public Testing (ngrok)

```bash
ngrok http 3000
```

Use the generated URL with the same `?session=` value on multiple devices.

## Environment

- `PORT` (optional): server port, default `3000`

## Notes

- Browser geolocation permission is required.
- For desktop simulation, use Chrome DevTools -> Sensors.

## Credits

Inspired by public real-time tracker demos and adapted with room-based sessions and UI refinements for this project.

## License

MIT
