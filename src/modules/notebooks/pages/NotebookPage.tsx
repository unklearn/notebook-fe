import React from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import {
  DISCONNECT_WEBSOCKET,
  startWebsocketConnectionAction,
} from "../../connection/WebsocketActions";
import { Notebook } from "../components/Notebook";
import { NotebookModel } from "../NotebookTypes";
import { getNotebookByIdAction } from "../redux/NotebookActions";
import { selectNotebookByIdFactory } from "../redux/NotebookSelectors";

type NotebookIdParams = {
  notebookId: string;
};

export const NotebookPage: React.FC = () => {
  const { notebookId } = useParams<NotebookIdParams>();
  const dispatch = useDispatch();
  const notebookData = useSelector(selectNotebookByIdFactory(notebookId)) || {};
  let data: NotebookModel | undefined;
  if (notebookData.status === "done") {
    data = notebookData.data;
  }
  useEffect(() => {
    dispatch(
      startWebsocketConnectionAction(
        `ws://localhost:8080/websocket/${notebookId}`
      )
    );
    return () => {
      dispatch({
        type: DISCONNECT_WEBSOCKET,
      });
    };
  }, []);
  useEffect(() => {
    // Fire off a request to fetch notebook
    dispatch(getNotebookByIdAction(notebookId));
  }, [notebookId]);
  return (
    <div className="unk-page container">
      {data && <Notebook notebook={data} />}
    </div>
  );
};
