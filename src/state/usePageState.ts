import type { Page, NodeData, NodeType } from "../utils/types";
import { arrayMove } from "@dnd-kit/sortable";
import { useSyncedState } from "./useSyncedState";
import { updatePage } from "../utils/updatePage";
import { createPage } from "../utils/createPage";

export const usePageState = (initialState: Page) => {
  const [page, setPage] = useSyncedState(initialState, updatePage);

  // All functions now use standard React immutable updates
  const addNode = (node: NodeData, index: number) => {
    setPage((prev) => ({
      ...prev,
      nodes: [...prev.nodes.slice(0, index), node, ...prev.nodes.slice(index)],
    }));
  };

  const removeNodeByIndex = (nodeIndex: number) => {
    setPage((prev) => ({
      ...prev,
      nodes: prev.nodes.filter((_, index) => index !== nodeIndex),
    }));
  };

  const changeNodeValue = (nodeIndex: number, value: string) => {
    setPage((prev) => {
      const newNodes = [...prev.nodes];
      newNodes[nodeIndex] = { ...newNodes[nodeIndex], value };
      return { ...prev, nodes: newNodes };
    });
  };

  const changeNodeType = async (nodeIndex: number, type: NodeType) => {
    if (type === "page") {
      const newPage = await createPage();
      if (newPage) {
        setPage((prev) => {
          const newNodes = [...prev.nodes];
          newNodes[nodeIndex] = {
            ...newNodes[nodeIndex],
            type,
            value: newPage.slug,
          };
          return { ...prev, nodes: newNodes };
        });
      }
    } else {
      setPage((prev) => {
        const newNodes = [...prev.nodes];
        newNodes[nodeIndex] = {
          ...newNodes[nodeIndex],
          type,
          value: "",
        };
        return { ...prev, nodes: newNodes };
      });
    }
  };

  const setNodes = (nodes: NodeData[]) => {
    setPage((prev) => ({ ...prev, nodes }));
  };

  const setTitle = (title: string) => {
    setPage((prev) => ({ ...prev, title }));
  };

  const setCoverImage = (coverImage: string) => {
    setPage((prev) => ({ ...prev, cover: coverImage }));
  };

  const reorderNodes = (id1: string, id2: string) => {
    setPage((prev) => {
      const index1 = prev.nodes.findIndex((node) => node.id === id1);
      const index2 = prev.nodes.findIndex((node) => node.id === id2);
      return {
        ...prev,
        nodes: arrayMove([...prev.nodes], index1, index2),
      };
    });
  };

  return {
    nodes: page.nodes,
    title: page.title,
    cover: page.cover,
    changeNodeType,
    changeNodeValue,
    addNode,
    removeNodeByIndex,
    setTitle,
    setCoverImage,
    setNodes,
    reorderNodes,
  };
};
