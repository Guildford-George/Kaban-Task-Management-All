import { BoardType, CustomSelectionOption } from "../utils/Interface";
import useBoardDetail from "../hooks/ContextHooks/useBoardDetail";

const CustomSelectOption = ({
  setter,
  setShowOption,
}: CustomSelectionOption) => {
  const { columns } = useBoardDetail().boardDetail as BoardType;
  return (
    <div className="custom-options">
      {columns.map((column) => {
        return (
          <div
            className="custom-opt"
            onClick={() => {
              setter({
                columnName: column.columnName,
                columnId: column.columnId,
              });
              setShowOption(false);
            }}>
            {column.columnName}
          </div>
        );
      })}
      {/* <div className="custom-opt" onClick={()=>setter("opt1")}>Option 1</div>
        <div className="custom-opt" onClick={()=>setter("opt1")}>Option 1</div>
        <div className="custom-opt" onClick={()=>setter("opt1")}>Option 1</div>
        <div className="custom-opt" onClick={()=>setter("opt1")}>Option 1</div> */}
    </div>
  );
};

export default CustomSelectOption;
