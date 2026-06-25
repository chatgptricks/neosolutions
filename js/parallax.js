(() => {
  const root = document.documentElement;
  const move = (x, y) => {
    root.style.setProperty("--mx", `${x}px`);
    root.style.setProperty("--my", `${y}px`);
  };

  let frame = 0;
  window.addEventListener("pointermove", (event) => {
    if (frame) {
      cancelAnimationFrame(frame);
    }

    frame = requestAnimationFrame(() => {
      const x = (event.clientX / window.innerWidth - 0.5) * 24;
      const y = (event.clientY / window.innerHeight - 0.5) * 18;
      move(x, y);
    });
  });
})();
