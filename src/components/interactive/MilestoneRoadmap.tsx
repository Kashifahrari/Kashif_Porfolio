import React, { useState, useCallback, useMemo, useEffect } from "react";
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Handle,
  Position,
  MarkerType,
  BackgroundVariant,
  Connection,
  Edge,
  Node,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

// Custom Milestone Node Component
const CustomMilestoneNode = ({ id, data, selected }: { id: string; data: any; selected: boolean }) => {
  const { number, title, desc, skills, status, statusText, icon, category, onDelete } = data;

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.dispatchEvent(
      new CustomEvent("milestoneSelected", {
        detail: { category, title },
      })
    );
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDelete) {
      onDelete(id, title);
    }
  };

  return (
    <div className={`react-flow-custom-node ${status} ${selected ? "selected" : ""}`} onClick={handleClick}>
      <Handle type="target" position={Position.Left} className="custom-flow-handle" />
      <button className="node-delete-btn" title="Delete this node" onClick={handleDelete}>
        <i className="bx bx-trash"></i>
      </button>
      <div className="node-top-bar">
        <span className="node-milestone-tag">Milestone {number || "#"}</span>
        <span className={`node-status-badge ${status}`}>{statusText}</span>
      </div>
      <div className="node-main-info">
        <i className={`bx ${icon || "bx-code-alt"} node-icon-glyph`}></i>
        <h4 className="node-heading">{title}</h4>
      </div>
      <p className="node-sub">{desc}</p>
      <div className="node-tags-row">
        {(skills || []).map((s: string, idx: number) => (
          <span key={idx} className="node-tag-item">{s}</span>
        ))}
      </div>
      <Handle type="source" position={Position.Right} className="custom-flow-handle" />
    </div>
  );
};

const DEFAULT_NODES: Node[] = [
  {
    id: "1",
    type: "customMilestone",
    position: { x: 30, y: 120 },
    data: {
      number: 1,
      title: "Core Foundations",
      desc: "Java, DSA & Object-Oriented Design",
      skills: ["Java", "DSA", "OOPs", "Big-O"],
      status: "completed",
      statusText: "Completed 🚀",
      icon: "bxl-java",
      category: "dsa",
    },
  },
  {
    id: "2",
    type: "customMilestone",
    position: { x: 350, y: 120 },
    data: {
      number: 2,
      title: "Web Engineering",
      desc: "Modern ES6+, DOM & Responsive Web",
      skills: ["JavaScript ES6+", "HTML5", "CSS3", "Async JS"],
      status: "completed",
      statusText: "Completed 🚀",
      icon: "bxl-javascript",
      category: "fullstack",
    },
  },
  {
    id: "3",
    type: "customMilestone",
    position: { x: 670, y: 120 },
    data: {
      number: 3,
      title: "Backend REST APIs",
      desc: "Node.js, Express & Database Systems",
      skills: ["Node.js", "Express", "MySQL", "REST Architecture"],
      status: "completed",
      statusText: "Completed 🚀",
      icon: "bxl-nodejs",
      category: "backend",
    },
  },
  {
    id: "4",
    type: "customMilestone",
    position: { x: 990, y: 120 },
    data: {
      number: 4,
      title: "Enterprise & React Flow",
      desc: "CBSE Aakalan, React Flow Canvas & TanStack Query",
      skills: ["React 19", "React Flow", "TypeScript", "Vite"],
      status: "in-progress",
      statusText: "Active Focus ⚡",
      icon: "bxl-react",
      category: "fullstack",
    },
  },
  {
    id: "5",
    type: "customMilestone",
    position: { x: 1310, y: 120 },
    data: {
      number: 5,
      title: "AI Engineering & LLMs",
      desc: "LLM Integrations, AI Engineering Cores & Cloud CI/CD",
      skills: ["LLMs", "AI Cores", "Microservices", "Docker", "CI/CD"],
      status: "upcoming",
      statusText: "Next Milestone 🎯",
      icon: "bx-bot",
      category: "learning",
    },
  },
];

const DEFAULT_EDGES: Edge[] = [
  {
    id: "e1-2",
    source: "1",
    target: "2",
    animated: true,
    style: { stroke: "#10b981", strokeWidth: 3 },
    markerEnd: { type: MarkerType.ArrowClosed, color: "#10b981" },
  },
  {
    id: "e2-3",
    source: "2",
    target: "3",
    animated: true,
    style: { stroke: "#00abf0", strokeWidth: 3 },
    markerEnd: { type: MarkerType.ArrowClosed, color: "#00abf0" },
  },
  {
    id: "e3-4",
    source: "3",
    target: "4",
    animated: true,
    style: { stroke: "#ffb900", strokeWidth: 3 },
    markerEnd: { type: MarkerType.ArrowClosed, color: "#ffb900" },
  },
  {
    id: "e4-5",
    source: "4",
    target: "5",
    animated: true,
    style: { stroke: "#4ecdc4", strokeWidth: 3 },
    markerEnd: { type: MarkerType.ArrowClosed, color: "#4ecdc4" },
  },
];

const MilestoneRoadmap = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(DEFAULT_NODES);
  const [edges, setEdges, onEdgesChange] = useEdgesState(DEFAULT_EDGES);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form states
  const [newNodeTitle, setNewNodeTitle] = useState("");
  const [newNodeDesc, setNewNodeDesc] = useState("");
  const [newNodeStatus, setNewNodeStatus] = useState("upcoming");
  const [newNodeIcon, setNewNodeIcon] = useState("bx-code-alt");
  const [newNodeSkills, setNewNodeSkills] = useState("");

  const handleResetRoadmap = () => {
    if (window.confirm("Are you sure you want to reset the roadmap canvas?")) {
      setNodes(DEFAULT_NODES);
      setEdges(DEFAULT_EDGES);
      window.dispatchEvent(
        new CustomEvent("showGlobalToast", {
          detail: "Roadmap reset to default! 🔄",
        })
      );
    }
  };

  const handleDeleteNode = useCallback(
    (nodeId: string, nodeTitle: string) => {
      if (window.confirm(`Are you sure you want to remove "${nodeTitle}" milestone node?`)) {
        setNodes((nds) => nds.filter((n) => n.id !== nodeId));
        setEdges((eds) => eds.filter((e) => e.source !== nodeId && e.target !== nodeId));
        window.dispatchEvent(
          new CustomEvent("showGlobalToast", {
            detail: `Removed node: ${nodeTitle} 🗑️`,
          })
        );
      }
    },
    [setNodes, setEdges]
  );

  const onConnect = useCallback(
    (params: Connection) => {
      const edgeColor =
        newNodeStatus === "completed"
          ? "#10b981"
          : newNodeStatus === "in-progress"
          ? "#00abf0"
          : "#ffd166";
      const newEdge: Edge = {
        ...params,
        id: `e${params.source}-${params.target}`,
        animated: true,
        style: { stroke: edgeColor, strokeWidth: 3 },
        markerEnd: { type: MarkerType.ArrowClosed, color: edgeColor },
      } as Edge;
      setEdges((eds) => addEdge(newEdge, eds));
    },
    [setEdges, newNodeStatus]
  );

  const handleAddNodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNodeTitle.trim()) return;

    const statusTexts: Record<string, string> = {
      completed: "Completed 🚀",
      "in-progress": "Active Focus ⚡",
      upcoming: "Next Milestone 🎯",
    };

    const statusCategories: Record<string, string> = {
      completed: "backend",
      "in-progress": "fullstack",
      upcoming: "learning",
    };

    const parsedSkills = newNodeSkills
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    const nextId = String(nodes.length + 1);
    
    // Position newly created nodes horizontally to the right
    const lastNode = nodes[nodes.length - 1];
    const xPos = lastNode ? lastNode.position.x + 320 : 100;
    const yPos = 120;

    const nodeData = {
      number: nodes.length + 1,
      title: newNodeTitle,
      desc: newNodeDesc,
      skills: parsedSkills,
      status: newNodeStatus,
      statusText: statusTexts[newNodeStatus] || "Upcoming",
      icon: newNodeIcon,
      category: statusCategories[newNodeStatus] || "learning",
      onDelete: handleDeleteNode,
    };

    const newNodeObj: Node = {
      id: nextId,
      type: "customMilestone",
      position: { x: xPos, y: yPos },
      data: nodeData,
    };

    setNodes((nds) => [...nds, newNodeObj]);

    // Connect previous node to new node automatically
    if (lastNode) {
      const edgeColor =
        newNodeStatus === "completed"
          ? "#10b981"
          : newNodeStatus === "in-progress"
          ? "#00abf0"
          : "#ffd166";
      const autoEdge: Edge = {
        id: `e${lastNode.id}-${nextId}`,
        source: lastNode.id,
        target: nextId,
        animated: true,
        style: { stroke: edgeColor, strokeWidth: 3 },
        markerEnd: { type: MarkerType.ArrowClosed, color: edgeColor },
      };
      setEdges((eds) => [...eds, autoEdge]);
    }

    setNewNodeTitle("");
    setNewNodeDesc("");
    setNewNodeSkills("");
    setIsAddModalOpen(false);
    
    window.dispatchEvent(
      new CustomEvent("showGlobalToast", {
        detail: "New milestone node created! 🎨",
      })
    );
  };

  // Inject onDelete callback into node data
  const nodesWithCallbacks = useMemo(() => {
    return nodes.map((node) => ({
      ...node,
      data: {
        ...node.data,
        onDelete: handleDeleteNode,
      },
    }));
  }, [nodes, handleDeleteNode]);

  const nodeTypes = useMemo(
    () => ({
      customMilestone: CustomMilestoneNode,
    }),
    []
  );

  const isLight = document.documentElement.classList.contains("light-theme");

  return (
    <div className="react-flow-wrapper-outer">
      {/* Canvas Top Control Strip */}
      <div className="flow-canvas-controls-strip">
        <div className="flow-stats-summary">
          <span className="flow-counter-badge">{nodes.length} Milestones</span>
          <span className="flow-tip">💡 Drag nodes to rearrange · Connect handles to link</span>
        </div>
        <div className="flow-actions-btns">
          <button className="btn btn-primary flow-btn-sm" onClick={() => setIsAddModalOpen(true)}>
            <i className="bx bx-plus"></i> Add Node
          </button>
          <button className="btn btn-glass flow-btn-sm" onClick={handleResetRoadmap} title="Reset to default roadmap">
            <i className="bx bx-reset"></i> Reset
          </button>
        </div>
      </div>

      {/* React Flow Canvas */}
      <div style={{ width: "100%", height: "540px", position: "relative" }}>
        <ReactFlow
          nodes={nodesWithCallbacks}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          fitView
          fitViewOptions={{ padding: 0.15 }}
          minZoom={0.4}
          maxZoom={1.8}
          attributionPosition="bottom-left"
          defaultEdgeOptions={{ type: "smoothstep" }}
        >
          <Background
            color={isLight ? "rgba(2, 132, 199, 0.25)" : "rgba(0, 171, 240, 0.25)"}
            gap={22}
            size={1.5}
            variant={BackgroundVariant.Dots}
          />
          <Controls showInteractive={false} className="react-flow-controls-cyber" />
          <MiniMap
            nodeColor={(n) => {
              if (n.data?.status === "completed") return "#10b981";
              if (n.data?.status === "in-progress") return "#00abf0";
              return "#ffd166";
            }}
            nodeStrokeWidth={3}
            maskColor={isLight ? "rgba(240, 248, 255, 0.7)" : "rgba(8, 27, 41, 0.75)"}
            className="react-flow-minimap-cyber"
          />
        </ReactFlow>
      </div>

      {/* Add Milestone Node Modal */}
      {isAddModalOpen && (
        <div className="modal-overlay active" onClick={(e) => (e.target as HTMLElement).classList.contains("modal-overlay") && setIsAddModalOpen(false)}>
          <div className="glass-card modal-dialog">
            <div className="modal-header">
              <h2 className="modal-title">
                <i className="bx bx-plus-circle"></i> Add React Flow Node
              </h2>
              <button className="modal-close" onClick={() => setIsAddModalOpen(false)}><i className="bx bx-x"></i></button>
            </div>
            
            <form onSubmit={handleAddNodeSubmit} className="progress-form">
              <div className="form-group">
                <label>Milestone Title</label>
                <input
                  type="text"
                  placeholder="e.g., GraphQL & Apollo Federation"
                  value={newNodeTitle}
                  onChange={(e) => setNewNodeTitle(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label>Description / Focus Area</label>
                <input
                  type="text"
                  placeholder="e.g., Subgraph Architecture & Schema Design"
                  value={newNodeDesc}
                  onChange={(e) => setNewNodeDesc(e.target.value)}
                  required
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Status</label>
                  <select value={newNodeStatus} onChange={(e) => setNewNodeStatus(e.target.value)}>
                    <option value="completed">Completed 🚀</option>
                    <option value="in-progress">Active Focus ⚡</option>
                    <option value="upcoming">Next Milestone 🎯</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Icon Symbol</label>
                  <select value={newNodeIcon} onChange={(e) => setNewNodeIcon(e.target.value)}>
                    <option value="bxl-react">⚛️ React</option>
                    <option value="bxl-nodejs">🚀 Node.js</option>
                    <option value="bxl-java">☕ Java / DSA</option>
                    <option value="bxl-python">🐍 Python</option>
                    <option value="bxs-data">🗄️ Database / SQL</option>
                    <option value="bx-cloud">☁️ Cloud / Docker</option>
                    <option value="bx-code-alt">💻 Code</option>
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label>Skills (comma-separated tags)</label>
                <input
                  type="text"
                  placeholder="e.g., GraphQL, Apollo, Node.js, Microservices"
                  value={newNodeSkills}
                  onChange={(e) => setNewNodeSkills(e.target.value)}
                />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-glass" onClick={() => setIsAddModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Create Node 🎨</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MilestoneRoadmap;
