import React, { useCallback, useMemo, useState } from "react";
import ReactFlow, {
  Background,
  Controls,
  MarkerType,
  useNodesState,
  useEdgesState,
  addEdge,
} from "reactflow";
import "reactflow/dist/style.css";
import { FaDesktop } from "react-icons/fa";
import "./App.css";

/* ---------- INITIAL DATA ---------- */
const initialNodes = [
  {
    id: "root",
    type: "pc",
    data: {
      name: "System Admin",
      job: "Administrator",
      proficiency: 95,
      platform: "Intel",
      specs: "i9 / 64GB",
      sell: "$3000",
      maintenance: false,
    },
  },
  {
    id: "1",
    type: "pc",
    data: {
      name: "Office PC",
      job: "Employee",
      proficiency: 60,
      platform: "Intel",
      specs: "i5 / 16GB",
      sell: "$800",
      maintenance: true,
    },
  },
  {
    id: "2",
    type: "pc",
    data: {
      name: "Design PC",
      job: "Designer",
      proficiency: 80,
      platform: "AMD",
      specs: "Ryzen 7 / 32GB",
      sell: "$1500",
      maintenance: false,
    },
  },
];

/* ---------- FORCE PERFECT TREE LAYOUT ---------- */
function buildTree(nodes) {
  const spacingX = 250;
  const spacingY = 180;

  return nodes.map((node, index) => {
    let depth = Math.floor(Math.log2(index + 1));
    let posInLevel = index - (2 ** depth - 1);

    return {
      ...node,
      position: {
        x: 500 + (posInLevel - (2 ** depth - 1) / 2) * spacingX,
        y: 100 + depth * spacingY,
      },
    };
  });
}

/* ---------- EDGES ---------- */
function buildEdges(nodes) {
  let edges = [];
  for (let i = 0; i < nodes.length; i++) {
    let left = 2 * i + 1;
    let right = 2 * i + 2;

    if (nodes[left]) {
      edges.push({
        id: `${nodes[i].id}-${nodes[left].id}`,
        source: nodes[i].id,
        target: nodes[left].id,
        markerEnd: { type: MarkerType.Arrow },
        style: { stroke: "#4db8ff", strokeWidth: 2 },
      });
    }

    if (nodes[right]) {
      edges.push({
        id: `${nodes[i].id}-${nodes[right].id}`,
        source: nodes[i].id,
        target: nodes[right].id,
        markerEnd: { type: MarkerType.Arrow },
        style: { stroke: "#4db8ff", strokeWidth: 2 },
      });
    }
  }
  return edges;
}

/* ---------- NODE UI ---------- */
const PCNode = ({ data }) => {
  return (
    <div className="pc-node">
      <FaDesktop size={30} />
      {data.maintenance && <div className="alert">!</div>}
    </div>
  );
};

function App() {
  const [rawNodes, setRawNodes] = useState(initialNodes);
  const layouted = useMemo(() => buildTree(rawNodes), [rawNodes]);

  const [nodes, setNodes, onNodesChange] = useNodesState(layouted);
  const [edges, setEdges, onEdgesChange] = useEdgesState(
    buildEdges(layouted)
  );

  const [selected, setSelected] = useState(null);

  const nodeTypes = useMemo(() => ({ pc: PCNode }), []);

  /* ---------- ADD PC ---------- */
  const addPC = () => {
    const name = prompt("PC Name:");
    const cpu = prompt("CPU:");
    const ram = prompt("RAM:");

    if (!name) return;

    const newNode = {
      id: Date.now().toString(),
      type: "pc",
      data: {
        name,
        job: "New Employee",
        proficiency: Math.floor(Math.random() * 100),
        platform: cpu.includes("Ryzen") ? "AMD" : "Intel",
        specs: `${cpu} / ${ram}`,
        sell: "$" + Math.floor(Math.random() * 2000),
        maintenance: Math.random() > 0.7,
      },
    };

    setRawNodes((prev) => [...prev, newNode]);
  };

  /* ---------- REMOVE ---------- */
  const removePC = () => {
    if (!selected) return;
    setRawNodes((prev) => prev.filter((n) => n.id !== selected.id));
    setSelected(null);
  };

  /* ---------- CLICK ---------- */
  const onNodeClick = (_, node) => {
    setSelected(node);
  };

  /* ---------- AUTO UPDATE EDGES ---------- */
  React.useEffect(() => {
    const newLayout = buildTree(rawNodes);
    setNodes(newLayout);
    setEdges(buildEdges(newLayout));
  }, [rawNodes]);

  return (
    <div className="wrapper">
      <div className="toolbar">
        <button onClick={addPC}>Add PC</button>
        <button onClick={removePC}>Remove PC</button>
      </div>

      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodeClick={onNodeClick}
        fitView
      >
        <Background />
        <Controls />
      </ReactFlow>

      {selected && (
        <div className="panel">
          <h3>{selected.data.name}</h3>
          <p>Job: {selected.data.job}</p>
          <p>Proficiency: {selected.data.proficiency}%</p>
          <p>Platform: {selected.data.platform}</p>
          <p>Specs: {selected.data.specs}</p>
          <p>Sell Value: {selected.data.sell}</p>
          <p>
            Upgrade:{" "}
            {selected.data.platform === "AMD"
              ? "Upgrade to Ryzen 7"
              : "Upgrade to i7"}
          </p>
          <p>Downtime: {Math.floor(Math.random() * 20)}%</p>
          <p>Idle: {Math.floor(Math.random() * 50)}%</p>
        </div>
      )}
    </div>
  );
}

export default App;