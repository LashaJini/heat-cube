import * as THREE from "three";

/**
 * Creates or changes color attribute depending on usePoints.
 *
 * @param points is typoef THREE.Points || Float32Array.
 * @param params is Object.
 * @param usePoints is boolean.
 *
 * @returns Float32Array or null;
 */
export function changeColor(points, params, usePoints) {
  const numberOfPoints = params.numberOfPoints;
  const centerColor = new THREE.Color(params.centerColor);
  const edgeColor = new THREE.Color(params.edgeColor);
  const vertices = points.geometry
    ? points.geometry.attributes.position.array
    : points; // we can just pass vertices directly
  const edgeMaxLength = 2 * params.edgeMult;

  let colors;
  if (points.geometry && usePoints) {
    colors = points.geometry.attributes.color.array;
  } else {
    colors = new Float32Array(numberOfPoints * 3);
  }

  for (let i = 0; i < numberOfPoints; i++) {
    const index = i * 3;

    const vertexLength = Math.sqrt(
      Math.pow(vertices[index], 2) +
        Math.pow(vertices[index + 1], 2) +
        Math.pow(vertices[index + 2], 2)
    );
    const mixedColor = centerColor.clone();
    mixedColor.lerp(edgeColor, vertexLength / edgeMaxLength);

    colors[index] = mixedColor.r;
    colors[index + 1] = mixedColor.g;
    colors[index + 2] = mixedColor.b;
  }

  if (!usePoints) {
    return colors;
  } else {
    points.geometry.attributes.color.needsUpdate = true;
    return;
  }
}

/**
 * Creates position attribute.
 *
 * @param params is Object.
 * @returns Float32Array.
 */
export function changePosition(params) {
  const numberOfPoints = params.numberOfPoints;
  const vertices = new Float32Array(numberOfPoints * 3);

  for (let i = 0; i < numberOfPoints; i++) {
    const index = i * 3;

    vertices[index] = (Math.random() * 2 - 1) * params.edgeMult;
    vertices[index + 1] = (Math.random() * 2 - 1) * params.edgeMult;
    vertices[index + 2] = (Math.random() * 2 - 1) * params.edgeMult;
  }

  return vertices;
}
