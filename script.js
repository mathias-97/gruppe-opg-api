document.addEventListener("DOMContentLoaded", () => {
    const yearSelect = document.getElementById("year");
    const kommuneSelect = document.getElementById("kommune");
    const currentYear = new Date().getFullYear();
    const yearsToShow = 20;
    
    // Populate year dropdown dynamically
    for (let i = 0; i < yearsToShow; i++) {
        const yearOption = document.createElement("option");
        yearOption.value = currentYear - i;
        yearOption.textContent = currentYear - i;
        yearSelect.appendChild(yearOption);
    }

    // Fetch municipalities from local JSON file
    fetch("assets/1847.json")
        .then(response => response.json())
        .then(data => {
            const municipalities = data.classificationItems;
            municipalities.forEach(municipality => {
                const option = document.createElement("option");
                option.value = municipality.code;
                option.textContent = municipality.name;
                kommuneSelect.appendChild(option);
            });
        })
        .catch(error => console.error("Error fetching municipality data:", error));
});