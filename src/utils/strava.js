// strava.js

// Utility functions for Strava API integration

const CLIENT_ID = process.env.REACT_APP_STRAVA_CLIENT_ID || '224374';
const CLIENT_SECRET = process.env.REACT_APP_STRAVA_CLIENT_SECRET || '0e930f4a5e450d85d616578eb99d753cceca1db4';
const REDIRECT_URI = process.env.REACT_APP_REDIRECT_URI || window.location.origin;
const CORS_PROXY = 'https://corsproxy.io/?';

// Returns the Strava OAuth authorization URL for a given profile
function getStravaAuthUrl(profile) {
    const params = new URLSearchParams({
        client_id: CLIENT_ID,
        redirect_uri: REDIRECT_URI,
        response_type: 'code',
        approval_prompt: 'auto',
        scope: 'read,activity:read_all',
        state: profile,
    });
    return `https://www.strava.com/oauth/authorize?${params.toString()}`;
}

// Handles OAuth callback: exchanges code for tokens and persists them
async function initializeStravaOAuth(code, profile, profileData, setProfileData) {
    try {
        const response = await fetch(`${CORS_PROXY}https://www.strava.com/oauth/token`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                client_id: CLIENT_ID,
                client_secret: CLIENT_SECRET,
                code,
                grant_type: 'authorization_code',
            }),
        });
        const data = await response.json();
        if (data.access_token) {
            const updatedProfileData = {
                ...profileData,
                profiles: {
                    ...profileData.profiles,
                    [profile]: {
                        ...profileData.profiles[profile],
                        strava: {
                            accessToken: data.access_token,
                            refreshToken: data.refresh_token,
                            expiresAt: data.expires_at,
                        },
                    },
                },
            };
            setProfileData(updatedProfileData);
        }
    } catch (error) {
        console.error('Strava OAuth error:', error);
    }
}

// Refreshes an expired Strava access token using the refresh token
async function refreshStravaToken(refreshToken) {
    const response = await fetch(`${CORS_PROXY}https://www.strava.com/oauth/token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            client_id: CLIENT_ID,
            client_secret: CLIENT_SECRET,
            grant_type: 'refresh_token',
            refresh_token: refreshToken,
        }),
    });
    return await response.json();
}

// Automatic token refresh flow
async function fetchWithTokenRefresh(url, accessToken, refreshToken) {
    let response = await fetch(`${CORS_PROXY}${url}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
        },
    });

    // Check for token expiration and refresh if necessary
    if (response.status === 401) {
        const refreshedTokens = await refreshStravaToken(refreshToken);
        accessToken = refreshedTokens.access_token;

        response = await fetch(`${CORS_PROXY}${url}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
            },
        });
    }

    return response;
}

// Fetching activities from Strava API
async function fetchActivities(accessToken, refreshToken) {
    const url = 'https://www.strava.com/api/v3/athlete/activities';
    const response = await fetchWithTokenRefresh(url, accessToken, refreshToken);
    return await response.json();
}

export { getStravaAuthUrl, initializeStravaOAuth, refreshStravaToken, fetchActivities };
