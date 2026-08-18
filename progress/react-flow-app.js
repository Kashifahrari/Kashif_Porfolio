/**
 * ===================================================================
 * INDUSTRY-GRADE REACT FLOW (XYFLOW) WITH ADD/DELETE NODE ENGINE
 * ===================================================================
 */

import React, { useState, useCallback, useMemo, useEffect } from 'https://esm.sh/react@18.3.1';
import { createRoot } from 'https://esm.sh/react-dom@18.3.1/client';
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
} from 'https://esm.sh/@xyflow/react@12.4.4?deps=react@18.3.1,react-dom@18.3.1';

// Custom Milestone Node Component with Delete capability
const CustomMilestoneNode = ({ id, data, selected }) => {
  const { number, title, desc, skills, status, statusText, icon, category, onDelete } = data;

  const handleClick = (e) => {
    e.stopPropagation();
    window.dispatchEvent(
      new CustomEvent('milestoneSelected', {
        detail: { category, title },
      })
    );
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    if (onDelete) {
      onDelete(id, title);
    }
  };

  return React.createElement(
    'div',
    {
      className: `react-flow-custom-node ${status} ${selected ? 'selected' : ''}`,
      onClick: handleClick,
    },
    // Left Input Handle
    React.createElement(Handle, {
      type: 'target',
      position: Position.Left,
      className: 'custom-flow-handle',
    }),
    // Delete Button
    React.createElement(
      'button',
      {
        className: 'node-delete-btn',
        title: 'Delete this node',
        onClick: handleDelete,
      },
      React.createElement('i', { className: 'bx bx-trash' })
    ),
    // Content Header
    React.createElement(
      'div',
      { className: 'node-top-bar' },
      React.createElement('span', { className: 'node-milestone-tag' }, `Milestone ${number || '#'}`),
      React.createElement('span', { className: `node-status-badge ${status}` }, statusText)
    ),
    // Icon & Title
    React.createElement(
      'div',
      { className: 'node-main-info' },
      React.createElement('i', { className: `bx ${icon || 'bx-code-alt'} node-icon-glyph` }),
      React.createElement('h4', { className: 'node-heading' }, title)
    ),
    React.createElement('p', { className: 'node-sub' }, desc),
    // Skills Tags Cloud
    React.createElement(
      'div',
      { className: 'node-tags-row' },
      (skills || []).map((s, idx) =>
        React.createElement('span', { key: idx, className: 'node-tag-item' }, s)
      )
    ),
    // Right Output Handle
    React.createElement(Handle, {
      type: 'source',
      position: Position.Right,
      className: 'custom-flow-handle',
    })
  );
};

const DEFAULT_NODES_DATA = [
  {
    id: '1',
    type: 'customMilestone',
    position: { x: 30, y: 120 },
    data: {
      number: 1,
      title: 'Core Foundations',
      desc: 'Java, DSA & Object-Oriented Design',
      skills: ['Java', 'DSA', 'OOPs', 'Big-O'],
      status: 'completed',
      statusText: 'Completed ✅',
      icon: 'bxl-java',
      category: 'dsa',
    },
  },
  {
    id: '2',
    type: 'customMilestone',
    position: { x: 350, y: 120 },
    data: {
      number: 2,
      title: 'Web Engineering',
      desc: 'Modern ES6+, DOM & Responsive Web',
      skills: ['JavaScript ES6+', 'HTML5', 'CSS3', 'Async JS'],
      status: 'completed',
      statusText: 'Completed ✅',
      icon: 'bxl-javascript',
      category: 'fullstack',
    },
  },
  {
    id: '3',
    type: 'customMilestone',
    position: { x: 670, y: 120 },
    data: {
      number: 3,
      title: 'Backend REST APIs',
      desc: 'Node.js, Express & Database Systems',
      skills: ['Node.js', 'Express', 'MySQL', 'REST Architecture'],
      status: 'completed',
      statusText: 'Completed ✅',
      icon: 'bxl-nodejs',
      category: 'backend',
    },
  },
  {
    id: '4',
    type: 'customMilestone',
    position: { x: 990, y: 120 },
    data: {
      number: 4,
      title: 'Enterprise & React Flow',
      desc: 'CBSE Aakalan, React Flow Canvas & TanStack Query',
      skills: ['React 19', 'React Flow', 'TypeScript', 'TanStack Query', 'Vite'],
      status: 'in-progress',
      statusText: 'Active Focus ⚡',
      icon: 'bxl-react',
      category: 'fullstack',
    },
  },
  {
    id: '5',
    type: 'customMilestone',
    position: { x: 1310, y: 120 },
    data: {
      number: 5,
      title: 'AI Engineering & LLMs',
      desc: 'LLM Integrations, AI Engineering Cores & Cloud CI/CD',
      skills: ['LLMs', 'AI Cores', 'Microservices', 'Docker', 'CI/CD'],
      status: 'upcoming',
      statusText: 'Next Milestone 🎯',
      icon: 'bx-bot',
      category: 'learning',
    },
  },
];

const DEFAULT_EDGES_DATA = [
  {
    id: 'e1-2',
    source: '1',
    target: '2',
    animated: true,
    style: { stroke: '#10b981', strokeWidth: 3 },
    markerEnd: { type: MarkerType.ArrowClosed, color: '#10b981' },
  },
  {
    id: 'e2-3',
    source: '2',
    target: '3',
    animated: true,
    style: { stroke: '#00abf0', strokeWidth: 3 },
    markerEnd: { type: MarkerType.ArrowClosed, color: '#00abf0' },
  },
  {
    id: 'e3-4',
    source: '3',
    target: '4',
    animated: true,
    style: { stroke: '#00abf0', strokeWidth: 3 },
    markerEnd: { type: MarkerType.ArrowClosed, color: '#00abf0' },
  },
  {
    id: 'e4-5',
    source: '4',
    target: '5',
    animated: true,
    style: { stroke: '#ffd166', strokeWidth: 2, strokeDasharray: '6,6' },
    markerEnd: { type: MarkerType.ArrowClosed, color: '#ffd166' },
  },
];

const ReactFlowRoadmapApp = () => {
  // Load saved nodes or fallback
  const getSavedNodes = () => {
    try {
      const saved = localStorage.getItem('kashif_flow_nodes');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return DEFAULT_NODES_DATA;
  };

  const getSavedEdges = () => {
    try {
      const saved = localStorage.getItem('kashif_flow_edges');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return DEFAULT_EDGES_DATA;
  };

  const [nodes, setNodes, onNodesChange] = useNodesState(getSavedNodes());
  const [edges, setEdges, onEdgesChange] = useEdgesState(getSavedEdges());
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form State for Adding Node
  const [newNodeTitle, setNewNodeTitle] = useState('');
  const [newNodeDesc, setNewNodeDesc] = useState('');
  const [newNodeSkills, setNewNodeSkills] = useState('');
  const [newNodeStatus, setNewNodeStatus] = useState('in-progress');
  const [newNodeCategory, setNewNodeCategory] = useState('fullstack');
  const [newNodeIcon, setNewNodeIcon] = useState('bxl-react');

  // Delete node handler
  const handleDeleteNode = useCallback((nodeId, nodeTitle) => {
    setNodes((nds) => {
      const updated = nds.filter((n) => n.id !== nodeId);
      try {
        localStorage.setItem('kashif_flow_nodes', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });

    setEdges((eds) => {
      const updated = eds.filter((e) => e.source !== nodeId && e.target !== nodeId);
      try {
        localStorage.setItem('kashif_flow_edges', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });

    // Notify user
    window.dispatchEvent(
      new CustomEvent('showGlobalToast', {
        detail: `🗑️ Deleted milestone: ${nodeTitle || nodeId}`,
      })
    );
  }, [setNodes, setEdges]);

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

  // Save changes to localStorage on drag / edge connect
  useEffect(() => {
    try {
      localStorage.setItem('kashif_flow_nodes', JSON.stringify(nodes));
    } catch (e) {}
  }, [nodes]);

  useEffect(() => {
    try {
      localStorage.setItem('kashif_flow_edges', JSON.stringify(edges));
    } catch (e) {}
  }, [edges]);

  const onConnect = useCallback(
    (params) => {
      setEdges((eds) => {
        const strokeColor = '#00abf0';
        const newEdge = {
          ...params,
          animated: true,
          style: { stroke: strokeColor, strokeWidth: 3 },
          markerEnd: { type: MarkerType.ArrowClosed, color: strokeColor },
        };
        const updated = addEdge(newEdge, eds);
        try {
          localStorage.setItem('kashif_flow_edges', JSON.stringify(updated));
        } catch (e) {}
        return updated;
      });
    },
    [setEdges]
  );

  // Add Node Submission
  const handleAddNodeSubmit = (e) => {
    e.preventDefault();
    if (!newNodeTitle) return;

    const newId = 'node-' + Date.now();
    const lastNode = nodes[nodes.length - 1];
    const newX = lastNode ? lastNode.position.x + 320 : 50;
    const newY = lastNode ? lastNode.position.y : 120;

    let statusText = 'Completed ✅';
    if (newNodeStatus === 'in-progress') statusText = 'Active Focus ⚡';
    if (newNodeStatus === 'upcoming') statusText = 'Next Milestone 🎯';

    const skillsArray = newNodeSkills
      .split(',')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    const newNode = {
      id: newId,
      type: 'customMilestone',
      position: { x: newX, y: newY },
      data: {
        number: nodes.length + 1,
        title: newNodeTitle,
        desc: newNodeDesc || 'Custom milestone goal',
        skills: skillsArray.length > 0 ? skillsArray : ['Engineering', 'Architecture'],
        status: newNodeStatus,
        statusText: statusText,
        icon: newNodeIcon || 'bx-code-alt',
        category: newNodeCategory,
      },
    };

    const updatedNodes = [...nodes, newNode];
    setNodes(updatedNodes);

    // Automatically connect with previous node if exists
    if (lastNode) {
      const edgeColor = newNodeStatus === 'completed' ? '#10b981' : newNodeStatus === 'in-progress' ? '#00abf0' : '#ffd166';
      const newEdge = {
        id: `e-${lastNode.id}-${newId}`,
        source: lastNode.id,
        target: newId,
        animated: true,
        style: { stroke: edgeColor, strokeWidth: 3, strokeDasharray: newNodeStatus === 'upcoming' ? '6,6' : 'none' },
        markerEnd: { type: MarkerType.ArrowClosed, color: edgeColor },
      };
      setEdges((eds) => [...eds, newEdge]);
    }

    // Reset and close
    setNewNodeTitle('');
    setNewNodeDesc('');
    setNewNodeSkills('');
    setIsAddModalOpen(false);

    window.dispatchEvent(
      new CustomEvent('showGlobalToast', {
        detail: `✨ Added new milestone: ${newNodeTitle}!`,
      })
    );
  };

  // Reset to default roadmap
  const handleResetRoadmap = () => {
    if (window.confirm('Reset the React Flow roadmap to the default 5 milestones?')) {
      setNodes(DEFAULT_NODES_DATA);
      setEdges(DEFAULT_EDGES_DATA);
      localStorage.removeItem('kashif_flow_nodes');
      localStorage.removeItem('kashif_flow_edges');
      window.dispatchEvent(
        new CustomEvent('showGlobalToast', {
          detail: `🔄 Roadmap reset to default!`,
        })
      );
    }
  };

  const nodeTypes = useMemo(
    () => ({
      customMilestone: CustomMilestoneNode,
    }),
    []
  );

  const isLight = document.documentElement.classList.contains('light-theme');

  return React.createElement(
    'div',
    { className: 'react-flow-wrapper-outer' },
    // Canvas Top Control Strip
    React.createElement(
      'div',
      { className: 'flow-canvas-controls-strip' },
      React.createElement(
        'div',
        { className: 'flow-stats-summary' },
        React.createElement('span', { className: 'flow-counter-badge' }, `${nodes.length} Milestones`),
        React.createElement('span', { className: 'flow-tip' }, '💡 Drag nodes to rearrange • Connect handles to link')
      ),
      React.createElement(
        'div',
        { className: 'flow-actions-btns' },
        React.createElement(
          'button',
          {
            className: 'btn btn-primary flow-btn-sm',
            onClick: () => setIsAddModalOpen(true),
          },
          React.createElement('i', { className: 'bx bx-plus' }),
          ' Add Node'
        ),
        React.createElement(
          'button',
          {
            className: 'btn btn-glass flow-btn-sm',
            onClick: handleResetRoadmap,
            title: 'Reset to default roadmap',
          },
          React.createElement('i', { className: 'bx bx-reset' }),
          ' Reset'
        )
      )
    ),

    // React Flow Canvas
    React.createElement(
      'div',
      { style: { width: '100%', height: '540px', position: 'relative' } },
      React.createElement(
        ReactFlow,
        {
          nodes: nodesWithCallbacks,
          edges,
          onNodesChange,
          onEdgesChange,
          onConnect,
          nodeTypes,
          fitView: true,
          fitViewOptions: { padding: 0.15 },
          minZoom: 0.4,
          maxZoom: 1.8,
          attributionPosition: 'bottom-left',
          defaultEdgeOptions: {
            type: 'smoothstep',
          },
        },
        React.createElement(Background, {
          color: isLight ? 'rgba(2, 132, 199, 0.25)' : 'rgba(0, 171, 240, 0.25)',
          gap: 22,
          size: 1.5,
          variant: BackgroundVariant.Dots,
        }),
        React.createElement(Controls, {
          showInteractive: false,
          className: 'react-flow-controls-cyber',
        }),
        React.createElement(MiniMap, {
          nodeColor: (n) => {
            if (n.data?.status === 'completed') return '#10b981';
            if (n.data?.status === 'in-progress') return '#00abf0';
            return '#ffd166';
          },
          nodeStrokeWidth: 3,
          maskColor: isLight ? 'rgba(240, 248, 255, 0.7)' : 'rgba(8, 27, 41, 0.75)',
          className: 'react-flow-minimap-cyber',
        })
      )
    ),

    // Add Milestone Node Glass Modal
    isAddModalOpen &&
      React.createElement(
        'div',
        {
          className: 'modal-overlay active',
          onClick: (e) => {
            if (e.target.classList.contains('modal-overlay')) setIsAddModalOpen(false);
          },
        },
        React.createElement(
          'div',
          { className: 'glass-card modal-dialog' },
          React.createElement(
            'div',
            { className: 'modal-header' },
            React.createElement(
              'h2',
              { className: 'modal-title' },
              React.createElement('i', { className: 'bx bx-plus-circle' }),
              ' Add React Flow Node'
            ),
            React.createElement(
              'button',
              {
                className: 'modal-close',
                onClick: () => setIsAddModalOpen(false),
              },
              React.createElement('i', { className: 'bx bx-x' })
            )
          ),
          React.createElement(
            'form',
            { onSubmit: handleAddNodeSubmit, className: 'progress-form' },
            React.createElement(
              'div',
              { className: 'form-group' },
              React.createElement('label', null, 'Milestone Title'),
              React.createElement('input', {
                type: 'text',
                placeholder: 'e.g., GraphQL & Apollo Federation',
                value: newNodeTitle,
                onChange: (e) => setNewNodeTitle(e.target.value),
                required: true,
              })
            ),
            React.createElement(
              'div',
              { className: 'form-group' },
              React.createElement('label', null, 'Description / Focus Area'),
              React.createElement('input', {
                type: 'text',
                placeholder: 'e.g., Subgraph Architecture & Schema Design',
                value: newNodeDesc,
                onChange: (e) => setNewNodeDesc(e.target.value),
                required: true,
              })
            ),
            React.createElement(
              'div',
              { className: 'form-row' },
              React.createElement(
                'div',
                { className: 'form-group' },
                React.createElement('label', null, 'Status'),
                React.createElement(
                  'select',
                  {
                    value: newNodeStatus,
                    onChange: (e) => setNewNodeStatus(e.target.value),
                  },
                  React.createElement('option', { value: 'completed' }, 'Completed ✅'),
                  React.createElement('option', { value: 'in-progress' }, 'Active Focus ⚡'),
                  React.createElement('option', { value: 'upcoming' }, 'Next Milestone 🎯')
                )
              ),
              React.createElement(
                'div',
                { className: 'form-group' },
                React.createElement('label', null, 'Icon Symbol'),
                React.createElement(
                  'select',
                  {
                    value: newNodeIcon,
                    onChange: (e) => setNewNodeIcon(e.target.value),
                  },
                  React.createElement('option', { value: 'bxl-react' }, '⚛️ React'),
                  React.createElement('option', { value: 'bxl-nodejs' }, '🟢 Node.js'),
                  React.createElement('option', { value: 'bxl-java' }, '☕ Java / DSA'),
                  React.createElement('option', { value: 'bxl-python' }, '🐍 Python'),
                  React.createElement('option', { value: 'bxs-data' }, '🗄️ Database / SQL'),
                  React.createElement('option', { value: 'bx-cloud' }, '☁️ Cloud / Docker'),
                  React.createElement('option', { value: 'bx-code-alt' }, '💻 Code')
                )
              )
            ),
            React.createElement(
              'div',
              { className: 'form-group' },
              React.createElement('label', null, 'Skills (comma-separated tags)'),
              React.createElement('input', {
                type: 'text',
                placeholder: 'e.g., GraphQL, Apollo, Node.js, Microservices',
                value: newNodeSkills,
                onChange: (e) => setNewNodeSkills(e.target.value),
              })
            ),
            React.createElement(
              'div',
              { className: 'modal-actions' },
              React.createElement(
                'button',
                {
                  type: 'button',
                  className: 'btn btn-glass',
                  onClick: () => setIsAddModalOpen(false),
                },
                'Cancel'
              ),
              React.createElement(
                'button',
                { type: 'submit', className: 'btn btn-primary' },
                'Create Node 🚀'
              )
            )
          )
        )
      )
  );
};

// Mount React Flow App
const rootElement = document.getElementById('react-flow-root');
if (rootElement) {
  const root = createRoot(rootElement);
  root.render(React.createElement(ReactFlowRoadmapApp));
}
