// strava.js

// Utility functions for Strava API integration

const CLIENT_ID = process.env.REACT_APP_STRAVA_CLIENT_ID || '224374';
const CLIENT_SECRET = process.env.REACT_APP_STRAVA_CLIENT_SECRET || '0e930f4a5e450d85d616578eb99d753cceca1db4';
const CORS_PROXY = 'https://corsproxy.io/?';

function resolveRedirectUri() {
    const { hostname, origin } = window.location;
    const isLocalHost = hostname === 'localhost' || hostname === '127.0.0.1';
    const isGitHubPreview = hostname.endsWith('.app.github.dev') || hostname.endsWith('.github.dev');

    if (isGitHubPreview) {
        return origin;
    }

    const envRedirect = process.env.REACT_APP_REDIRECT_URI?.trim();

    if (!envRedirect) {
        if (process.env.NODE_ENV !== 'production' && isLocalHost) {
            return 'http://localhost:3000';
        }

        return origin;
    }

    try {
        const envUrl = new URL(envRedirect);
        const currentHost = window.location.hostname;
        const envIsLocal = envUrl.hostname === 'localhost' || envUrl.hostname === '127.0.0.1';
        const currentIsLocal = currentHost === 'localhost' || currentHost === '127.0.0.1';

        // If env points to localhost but app runs on another host (e.g. codespaces), prefer the live origin.
        if (envIsLocal && !currentIsLocal) {
            return window.location.origin;
        }

        return `${envUrl.origin}${envUrl.pathname}`.replace(/\/$/, '');
    } catch {
        return window.location.origin;
    }
}

// Returns the Strava OAuth authorization URL for a given profile
function getStravaAuthUrl(profile) {
    const redirectUri = resolveRedirectUri();
    const params = new URLSearchParams({
        client_id: CLIENT_ID,
        redirect_uri: redirectUri,
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
        const redirectUri = resolveRedirectUri();
        const response = await fetch(`${CORS_PROXY}https://www.strava.com/oauth/token`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                client_id: CLIENT_ID,
                client_secret: CLIENT_SECRET,
                code,
                grant_type: 'authorization_code',
                redirect_uri: redirectUri,
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
