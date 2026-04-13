// strava.js

// Utility functions for Strava API integration

// Automatic token refresh flow
async function fetchWithTokenRefresh(url, accessToken, refreshToken) {
    let response = await fetch(url, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
        },
    });

    // Check for token expiration and refresh if necessary
    if (response.status === 401) {
        const refreshedTokens = await refreshAccessToken(refreshToken);
        accessToken = refreshedTokens.access_token;
        refreshToken = refreshedTokens.refresh_token;

        response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
            },
        });
    }

    return response;
}

async function refreshAccessToken(refreshToken) {
    const response = await fetch('https://www.strava.com/oauth/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            client_id: 'YOUR_CLIENT_ID',
            client_secret: 'YOUR_CLIENT_SECRET',
            grant_type: 'refresh_token',
            refresh_token: refreshToken
        }),
    });
    return await response.json();
}

// CORS proxy handling
async function fetchWithCORSProxy(url, accessToken) {
    const proxyUrl = 'https://corsproxy.io/?';
    const response = await fetch(`${proxyUrl}${url}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
        },
    });
    return response;
}

// Fetching activities from Strava API
async function fetchActivities(accessToken, refreshToken) {
    const url = 'https://api.strava.com/v3/athlete/activities';
    const response = await fetchWithTokenRefresh(url, accessToken, refreshToken);
    return await response.json();
}

export { fetchActivities };
