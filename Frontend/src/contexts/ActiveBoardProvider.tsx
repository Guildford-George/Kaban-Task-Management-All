import { useState, useEffect, createContext } from "react";
import { API_Instance, HTTPClientService } from "../config/backendConfig";
import {
  ActiveBoardContext,
  BoardType,
  NullUndefined,
} from "../utils/Interface";
import { useParams } from "react-router-dom";
import useBoardsData from "../hooks/ContextHooks/useBoardsData";

export const activeBoardInitial = createContext({} as ActiveBoardContext);
const ActiveBoardProvider = ({ children }: { children: React.ReactNode }) => {
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [boardDetail, setBoardDetail] = useState<BoardType | NullUndefined>();
  const { userBoards } = useBoardsData();
  useEffect(() => {
    (async () => {
      try {
        setIsLoading(true);
        if (userBoards.some((bd: BoardType) => bd.boardId === id)) {
          const response = await HTTPClientService(
            API_Instance,
            `boards/${id}`,
            "GET"
          );
          const serverResponse = response?.data.data.item;
          setBoardDetail(serverResponse);
        } else {
          setBoardDetail(null);
        }

        setIsLoading(false);
      } catch (error: any) {
        setBoardDetail(null);
      }
    })();
  }, [id, useBoardsData]);
  return (
    <activeBoardInitial.Provider
      value={{ isLoading, setIsLoading, boardDetail, setBoardDetail }}>
      {boardDetail === undefined ? (
        <h1>Fetch board details</h1>
      ) : boardDetail == null ? (
        <h1>No such board found</h1>
      ) : (
        children
      )}
    </activeBoardInitial.Provider>
  );
};

export default ActiveBoardProvider;
