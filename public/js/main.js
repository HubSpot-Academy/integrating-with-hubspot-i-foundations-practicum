window.addEventListener("load", (event) => {
    // Get the query string from the URL.
    // Search for id parameter in the query string.
    // If it exists, prefill the record_id input field with the id value.
    const paramsString = window.location.search;
    const queryParams = new URLSearchParams(paramsString);
    const recordId = queryParams.get('id');
    const countrySelect = document.getElementById('country');
    if (recordId) {
        countrySelect.value = countrySelect.dataset.value;
    }
});