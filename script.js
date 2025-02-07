document.addEventListener("DOMContentLoaded", () => {
    const yearSelect = document.getElementById("year");
    const kommuneSelect = document.getElementById("kommune");
    const searchButton = document.getElementById("searchBtn");
    const businessList = document.getElementById("business-list");
    const loadingIndicator = document.getElementById("loading");
    const errorMessage = document.getElementById("error-message");
    const currentYear = new Date().getFullYear();
    const yearsToShow = 10;

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

    // Fetch business data (local JSON for testing)
    searchButton.addEventListener("click", async () => {
        const selectedKommune = kommuneSelect.value;
        const selectedYear = yearSelect.value;
        
        if (!selectedKommune || !selectedYear) {
            errorMessage.textContent = "Velg både kommune og årstall for å søke.";
            errorMessage.style.display = "block";
            return;
        }
        
        errorMessage.style.display = "none";
        businessList.innerHTML = "";
        loadingIndicator.style.display = "block";

        try {
            const useLocalData = true; // Switch to false when using real API
            let data;

            if (useLocalData) {
                const response = await fetch("assets/localdata.json");
                data = await response.json();
            } else {
                const response = await fetch(`https://data.brreg.no/enhetsregisteret/api/enheter?kommunenummer=${selectedKommune}&fraStiftelsesdato=${selectedYear}-01-01&tilStiftelsesdato=${selectedYear}-12-31&size=10`);
                data = await response.json();
            }

            loadingIndicator.style.display = "none";

            if (data.length === 0) {
                errorMessage.textContent = "Ingen bedrifter funnet for valgt kommune og årstall.";
                errorMessage.style.display = "block";
                return;
            }

            const filteredBusinesses = data.filter(business => {
                return (
                    business.forretningsadresse.kommunenummer === selectedKommune &&
                    business.stiftelsesdato.startsWith(selectedYear)
                );
            });
            
            loadingIndicator.style.display = "none";
            
            if (filteredBusinesses.length === 0) {
                errorMessage.textContent = "Ingen bedrifter funnet for valgt kommune og årstall.";
                errorMessage.style.display = "block";
                return;
            }
            
            filteredBusinesses.forEach(business => {
                const businessItem = document.createElement("div");
                businessItem.classList.add("business-item");
                businessItem.innerHTML = `
                    <h3>${business.navn}</h3>
                    <p><strong>Org.nr:</strong> ${business.organisasjonsnummer}</p>
                    <p><strong>Stiftelsesdato:</strong> ${business.stiftelsesdato}</p>
                `;
                businessList.appendChild(businessItem);
            });
            
        } catch (error) {
            console.error("Error fetching business data:", error);
            errorMessage.textContent = "Kunne ikke hente data. Prøv igjen senere.";
            errorMessage.style.display = "block";
        }
    });
});
