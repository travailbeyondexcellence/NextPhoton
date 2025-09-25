"use client";

import React, { useCallback, useEffect, useState } from "react";
import ReactFlow, {
    Background,
    Controls,
    MiniMap,
    addEdge,
    useNodesState,
    useEdgesState,
    Node,
    Edge,
    Connection,
    Handle,
    Position,
    NodeProps,
} from "reactflow";
import "reactflow/dist/style.css";

import physicsChapters from "../PECoreSyllabus/physicsChapters";

const EditableNode = ({ data }: NodeProps) => {
    const [label, setLabel] = useState(data.label);

    return (
        <div className= "bg-white p-2 border rounded shadow text-xs min-w-[120px]" >
        <input
        className="w-full bg-transparent outline-none"
    value = { label }
    onChange = {(e) => setLabel(e.target.value)}
      />
    < Handle type = "target" position = { Position.Top } className = "w-2 h-2 bg-blue-500" />
        <Handle type="source" position = { Position.Bottom } className = "w-2 h-2 bg-green-500" />
            </div>
  );
};

const nodeTypes = {
    editable: EditableNode,
};

const generateMindMapFromChapters = (): { nodes: Node[]; edges: Edge[] } => {
    const nodes: Node[] = [];
    const edges: Edge[] = [];

    let yOffset = 0;
    physicsChapters.chapters.forEach((chapter, chapterIndex) => {
        const chapterId = chapter.chapterId;
        nodes.push({
            id: chapterId,
            position: { x: 100, y: yOffset },
            data: { label: chapter.chapterName },
            type: "editable",
        });

        chapter.topics.forEach((topic, topicIndex) => {
            const topicId = `${chapterId}-T${topicIndex + 1}`;
            nodes.push({
                id: topicId,
                position: { x: 350, y: yOffset + topicIndex * 80 },
                data: { label: topic },
                type: "editable",
            });
            edges.push({ id: `e-${chapterId}-${topicId}`, source: chapterId, target: topicId });
        });

        yOffset += Math.max(chapter.topics.length, 1) * 100;
    });

    return { nodes, edges };
};

const MindMap = () => {
    const { nodes: initialNodes, edges: initialEdges } = generateMindMapFromChapters();
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

    const onConnect = useCallback((params: Edge | Connection) => setEdges((eds) => addEdge(params, eds)), [setEdges]);

    useEffect(() => {
        const saved = localStorage.getItem("mindmap-layout");
        if (saved) {
            const parsed = JSON.parse(saved);
            setNodes(parsed.nodes || []);
            setEdges(parsed.edges || []);
        }
    }, []);

    useEffect(() => {
        localStorage.setItem("mindmap-layout", JSON.stringify({ nodes, edges }));
    }, [nodes, edges]);

    return (
        <div className= "h-screen w-full" >
        <ReactFlow
        nodes={ nodes }
    edges = { edges }
    onNodesChange = { onNodesChange }
    onEdgesChange = { onEdgesChange }
    onConnect = { onConnect }
    nodeTypes = { nodeTypes }
    fitView
        >
        <MiniMap />
        < Controls />
        <Background gap={ 12 } color = "#eee" />
            </ReactFlow>
            </div>
  );
};

export default MindMap;
