export function initAuth() {
    // If already authenticated and on a public page, redirect to Dashboard
    if (localStorage.getItem('oai_user') && window.location.pathname !== '/dashboard.html') {
        window.location.href = '/dashboard.html';
        return;
    }

    // Helper function for the redirect
    function triggerOrcidLogin() {
        // ORCiD Public API Configuration (Sandbox or Production)
        // For production this usually requires registering your app and domain.
        // Using public sandbox URL as an example implementation setup.
        const clientId = 'APP-E5T5KROSCZAJNFFZ'; // Replace with actual Client ID
        const redirectUri = encodeURIComponent(window.location.origin + '/auth-callback.html');
        // Request the "openid" scope to get an OpenID Connect JWT containing the user's name and ORCiD.
        const scope = encodeURIComponent('openid');
        // Request both an access_token and an id_token (the JWT)
        const responseType = encodeURIComponent('token id_token');
        // OpenID Connect Implicit flow requires a nonce
        const nonce = encodeURIComponent(Math.random().toString(36).substring(2, 15));

        // Construct the ORCiD Auth URL
        const authUrl = `https://orcid.org/oauth/authorize?client_id=${clientId}&response_type=${responseType}&scope=${scope}&redirect_uri=${redirectUri}&nonce=${nonce}`;

        // Redirect
        window.location.href = authUrl;
    }

    const signinButtons = document.querySelectorAll('a[href="#signin"], a[href="#orcid-login"]');

    signinButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            triggerOrcidLogin();
        });
    });
}
