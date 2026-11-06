import React from "react";
import Tree from "react-d3-tree";

const data = {
  name: "System Admin (Root)",
  attributes: { specs: "Ryzen 7 3700X / 32GB RAM / RTX 4070" },
  children: [
    {
      name: "Intel Platform",
      attributes: { specs: "i7 12700K / 16GB RAM / RTX 3060" },
      children: [
        {
          name: "PC-A",
          attributes: { specs: "i5 10400 / 8GB RAM / GTX 1660" },
        },
        {
          name: "PC-B",
          attributes: { specs: "i3 10100 / 8GB RAM / GTX 1050 Ti" },
        },
      ],
    },
    {
      name: "AMD Platform",
      attributes: { specs: "Ryzen 5 5600 / 16GB RAM / RX 6700 XT" },
      children: [
        {
          name: "PC-C",
          attributes: { specs: "Ryzen 3 3200G / 8GB RAM / Vega 8" },
        },
        {
          name: "PC-D",
          attributes: { specs: "Ryzen 7 2700X / 16GB RAM / RX 580" },
        },
      ],
    },
  ],
};

const containerStyles = {
  width: "100vw",
  height: "100vh",
  background: "radial-gradient(circle at center, #0a0a0a, #000000 80%)",
  color: "white",
};

function App() {
  return (
    <div style={containerStyles}>
      <Tree
        data={data}
        translate={{ x: 600, y: 400 }}
        orientation="vertical"
        pathFunc="step"
        zoomable
        collapsible
        styles={{
          nodes: {
            node: { circle: { fill: "#00ccff" }, name: { fill: "#ffffff" } },
            leafNode: {
              circle: { fill: "#ff66cc" },
              name: { fill: "#ffffff" },
            },
          },
          links: { stroke: "#888", strokeWidth: 2 },
        }}
      />
    </div>
  );
}

export default App;
