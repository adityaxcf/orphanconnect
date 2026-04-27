const API = "http://localhost:3001/api";

function getToken() {
    return localStorage.getItem("token") || "";
}

function getUser() {
    return JSON.parse(localStorage.getItem("currentUser") || "{}");
}

function authHeaders() {
    return {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + getToken()
    };
}

async function apiGet(path) {
    const res = await fetch(API + path, { headers: authHeaders() });
    return res.json();
}

async function apiPost(path, body) {
    const res = await fetch(API + path, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify(body)
    });
    return res.json();
}

async function apiPatch(path, body) {
    const res = await fetch(API + path, {
        method: "PATCH",
        headers: authHeaders(),
        body: JSON.stringify(body)
    });
    return res.json();
}
