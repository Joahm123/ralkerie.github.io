/* =====================================================
   RALKERIE WAVEFORM
===================================================== */

const waveform =
    document.getElementById(
        "waveform"
    );

const BAR_COUNT = 70;


/* =====================================================
   CREATE BARS
===================================================== */

for (
    let i = 0;
    i < BAR_COUNT;
    i++
) {

    const bar =
        document.createElement(
            "div"
        );

    bar.className =
        "wave-bar";


    const center =
        Math.abs(
            i -
            BAR_COUNT / 2
        ) /
        (BAR_COUNT / 2);


    const height =
        1 -
        center * 0.65;


    bar.style.height =
        `${20 + height * 45}px`;


    bar.style.setProperty(
        "--speed",
        `${0.45 + Math.random() * 0.55}s`
    );


    bar.style.setProperty(
        "--delay",
        `${Math.random() * -1}s`
    );


    waveform.appendChild(
        bar
    );
}
