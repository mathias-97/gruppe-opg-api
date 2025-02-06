document.addEventListener("DOMContentLoaded", () => {
    const yearSelect = document.getElementById("year");
    const currentYear = new Date().getFullYear();
    const yearsToShow = 20;
    
    for (let i = 0; i < yearsToShow; i++) {
        const yearOption = document.createElement("option");
        yearOption.value = currentYear - i;
        yearOption.textContent = currentYear - i;
        yearSelect.appendChild(yearOption);
    }
});
