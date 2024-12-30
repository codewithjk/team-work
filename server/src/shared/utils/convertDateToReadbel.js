function convertToHumanReadableDate(isoDate) {
    const date = new Date(isoDate);

    // Format date to a human-readable format
    const options = {
        weekday: 'long', // "Monday"
        year: 'numeric', // "2024"
        month: 'long',   // "September"
        day: 'numeric',  // "16"
        hour: '2-digit', // "12"
        minute: '2-digit', // "00"
        second: '2-digit', // "00"
    };

    return date.toLocaleString('en-US', options);
}

module.exports = convertToHumanReadableDate
