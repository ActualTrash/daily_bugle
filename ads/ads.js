ads = [
    {
        name: 'Oscorp Industries',
        image: 'images/oscorp.webp',
        alt: 'oscorp',
        times_clicked: 0
    },
    {
        name: 'Stark Industries',
        image: 'images/stark.jpeg',
        alt: 'stark',
        times_clicked: 0
    },
    {
        name: 'S.H.I.E.L.D.',
        image: 'images/shield.png',
        alt: 'shield',
        times_clicked: 0
    }
];

function trackClick(adName) {
    // You can use JavaScript to track clicks, for example, by sending data to a server
    console.log(`Ad clicked: ${adName}`);

    ads.forEach(ad => {
        if (ad.alt === adName) {
            ad.times_clicked++;
        }
    });

    clicked = document.getElementById('clicks');
    clicked.innerHTML = "<u>Clicks</u>";
    ads.forEach(ad => {
        clicked.innerHTML += `<br>${ad.name}: ${ad.times_clicked}`;
    });
}

function getAds() {
    return JSON.stringify(ads);
}