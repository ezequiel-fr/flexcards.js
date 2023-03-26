window.addEventListener('load', function () {
    const { document } = this;

    // Light mode
    var lightmode = false;

    if (this.matchMedia) {
        lightmode = !this.matchMedia("(prefers-color-scheme: dark)").matches;

        this.matchMedia("(prefers-color-scheme: dark)").addEventListener('change', e => (
            lightmode = !e.matches
        ));
    }

    const lightmodeBtn = document.getElementById('lightmode');
    lightmodeBtn.onclick = e => {
        lightmode = !lightmode;
        e.currentTarget.blur();
    };

    const setLightMode = () => {
        document.body.classList[lightmode ? 'add' : 'remove']('light');
        lightmodeBtn.children[0].name = (lightmode ? "sunny" : "moon").concat("-outline");
    };

    let _lightmode = lightmode;
    setLightMode();

    this.setInterval(() => {
        if (_lightmode !== lightmode) {
            setLightMode();
            _lightmode = lightmode;
        }
    }, 100);

    // Carousel demo
    const carouselDemo = new FlexCards(".carousel .carousel-demo");
    carouselDemo.carousel({ indexType: "numbers", theme: "#1ce", timer: false });
});
