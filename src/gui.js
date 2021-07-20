export function addGUI(gui, fs, params) {
  gui.add(params, "rotate");
  gui
    .add(params, "size")
    .min(0.01)
    .max(1)
    .step(0.01)
    .name("Particle Size")
    .onFinishChange(fs.createHeatBox);
  gui
    .add(params, "numberOfPoints")
    .min(500)
    .max(50000)
    .step(100)
    .name("Number of Particles")
    .onFinishChange(fs.createHeatBox);
  gui
    .add(params, "edgeMult")
    .min(0.1)
    .max(5)
    .step(0.1)
    .name("Cube Edge Multiplier")
    .onFinishChange(fs.createHeatBox);
  gui
    .addColor(params, "centerColor")
    .name("Center Color")
    .onFinishChange(fs.changeColor);
  gui
    .addColor(params, "edgeColor")
    .name("Edge Color")
    .onFinishChange(fs.changeColor);
}
