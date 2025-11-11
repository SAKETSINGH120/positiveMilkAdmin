export const getCurrentLocation = () => {
    return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
            reject(new Error("Geolocation not supported"));
        }
        navigator.geolocation.getCurrentPosition(
            ({ coords }) => resolve({ latitude: coords.latitude, longitude: coords.longitude }),
            (err) => reject(err),
            { enableHighAccuracy: true }
        );
    });
};

export const getAddressFromCoordinates = async (latitude, longitude) => {
    try {
        const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`
        );
        const data = await response.json();
        
        if (data.error) {
            throw new Error(data.error);
        }

        const address = data.address;
        return {
            address: data.display_name,
            city: address.city || address.town || address.village || address.county || '',
            state: address.state || '',
            pincode: address.postcode || '',
            country: address.country || ''
        };
    } catch (error) {
        console.error('Error fetching address:', error);
        throw new Error('Unable to fetch address details');
    }
};
