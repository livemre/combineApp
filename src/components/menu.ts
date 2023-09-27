document.addEventListener('DOMContentLoaded', (event) => {
    const profilePic = document.getElementById("profilePic") as HTMLElement;
    const sideMenu = document.getElementById("sideMenu") as HTMLElement;

    profilePic.addEventListener("click", openNav);

    document.addEventListener("click", (event: Event) => {
        const targetElement = event.target as HTMLElement;
        
        // Menü veya profil resmine tıklanmadıysa menüyü kapat
        if (targetElement !== profilePic && !sideMenu.contains(targetElement)) {
            closeNav();
        }
    });

    function openNav(): void {
        sideMenu.style.width = "70%";
    }

    function closeNav(): void {
        sideMenu.style.width = "0%";
    }
});
