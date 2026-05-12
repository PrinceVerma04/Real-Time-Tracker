const sessionId =
    new URLSearchParams(window.location.search).get("session")?.trim() || "default";

// Initialize Socket.io with a room/session id.
const socket = io({
    query: { sessionId },
});

if (navigator.geolocation) {
    navigator.geolocation.watchPosition(
        (position) => {
            const { latitude, longitude } = position.coords;
            console.log("Client location:", latitude, longitude);
            socket.emit("send-location", { latitude, longitude });
        },
        (error) => {
            console.error(error);
        },

        {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0,
        }
    );
}

const map = L.map("map").setView([0, 0], 16);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; OpenStreetMap contributors",
}).addTo(map);

const markers = {};
const statusEl = document.getElementById("statusText");
const sessionEl = document.getElementById("sessionText");
const onlineEl = document.getElementById("onlineCount");

sessionEl.textContent = sessionId;

function createLottieMarker(id, lat, lng) {
    const containerId = "lottie-marker-" + id;

    const icon = L.divIcon({
        html: `<div id="${containerId}" class="lottie-marker"></div>`,
        iconSize: [50, 50],
        className: "",
    });

    const marker = L.marker([lat, lng], { icon }).addTo(map);

    lottie.loadAnimation({
        container: document.getElementById(containerId),
        renderer: "svg",
        loop: true,
        autoplay: true,
        path: "/animation/marker.json",
    });

    return marker;
}

function updateOnlineCount() {
    onlineEl.textContent = String(Object.keys(markers).length);
}

socket.on("session-joined", ({ sessionId: joinedSession }) => {
    statusEl.textContent = "Connected";
    sessionEl.textContent = joinedSession;
});

socket.on("receive-location", (data) => {
    const { id, latitude, longitude } = data;

    if (markers[id]) {
        markers[id].setLatLng([latitude, longitude]);
    } else {
        markers[id] = createLottieMarker(id, latitude, longitude);
    }

    const allCoords = Object.values(markers).map((marker) => marker.getLatLng());
    if (allCoords.length > 0) {
        map.fitBounds(allCoords, { padding: [50, 50] });
    }
    updateOnlineCount();
});

socket.on("user-disconnected", (id) => {
    if (markers[id]) {
        map.removeLayer(markers[id]);
        delete markers[id];
        updateOnlineCount();
    }
});
