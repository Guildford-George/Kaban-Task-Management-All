import { useState } from "react";
import { columnIconColor } from "../utils/GeneralUtils";
import ColumnCard from "./ColumnCard";
import AddColumn from "./Modals/AddColumn";
import useBoardDetail from "../hooks/ContextHooks/useBoardDetail";
import { BoardType } from "../utils/Interface";
import ColumnLocation from "../contexts/ColumnLocation";

const Board = () => {
  const [showAddColumn, setShowAddColumn] = useState(false);

  const boardDetail = useBoardDetail().boardDetail as BoardType;
  const { columns } = boardDetail;
  console.log(boardDetail)
  return (

    <section className="board">
      {
        columns.length>0 &&
        <div className="board-columns">
          <div className="column-content">
            {boardDetail.columns.map((column, index) => {
              return (
                <ColumnLocation column={column} key={column.columnId}>
                    <ColumnCard
                      colorIcon={columnIconColor[index % columnIconColor.length]}
                    />
                </ColumnLocation>
              );
            })}

            <div className="add-new-column">
              <div>
                <button
                  onClick={() => {
                    setShowAddColumn(true);
                  }}>
                  + New Column
                </button>
              </div>
            </div>
          </div>
          {/* <div className="container">
        </div> */}
        </div>
      }
      {columns.length == 0 && (
        <div className="emptyColumn">
          <div className="container">
            <div>
              <p>This board is empty. Create a new column to get started.</p>
              <button className="btn primary-btn">+ Add New Column</button>
            </div>
          </div>
        </div>
      )}
      {showAddColumn && <AddColumn setShowModal={setShowAddColumn} />}
    </section>
  );
};

export default Board;
