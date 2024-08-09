window.addEventListener('load', function() {
    // Fade in the page content
    document.body.style.opacity = '1';
    
    // Fade out the logo
    const fadeImageContainer = document.getElementById('fadeImageContainer');
    fadeImageContainer.style.opacity = '1';
    fadeImageContainer.style.transition = 'opacity 3s';
    setTimeout(() => {
        fadeImageContainer.style.opacity = '0';
    }, 100);
});

document.getElementById('detailsForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const message = document.getElementById('message').value;
    const date = new Date().toLocaleString();
    
    // Extract the domain name from the referrer URL
    let referrer = document.referrer;
    if (referrer) {
        const url = new URL(referrer);
        referrer = url.hostname.replace('www.', ''); // Remove 'www.' if present
    } else {
        referrer = 'instagram'; // Use fallback if no referrer is available
    }

    fetch('https://ipinfo.io?token=aaad8e9b2f8309')
        .then(response => response.json())
        .then(data => {
            const ip = data.ip;
            const country = data.country;
            const state = data.region;

            return fetch(`https://restcountries.com/v3.1/alpha/${country}`)
                .then(response => response.json())
                .then(countryData => {
                    const phoneCode = countryData[0].idd.root + countryData[0].idd.suffixes[0];

                    const details = JSON.parse(localStorage.getItem('details')) || [];
                    details.push({
                        username,
                        message,
                        ip,
                        country: countryData[0].name.common,
                        state,
                        phoneCode,
                        date,
                        referrer
                    });
                    localStorage.setItem('details', JSON.stringify(details));

                    // Redirect to success.html
                    window.location.href = 'success.html';
                });
        })
        .catch(error => {
            console.error('Error fetching IP or country information:', error);
        });
});
