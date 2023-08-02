import { useState } from "react";
import logo from "../assets/Logo.png";
import darklogo from "../assets/darkLogo.png"
import { HiOutlineDotsVertical } from "react-icons/hi";
import { BiChevronDown } from "react-icons/bi";
import AddTask from "./Modals/AddTask";
import DeleteBoard from "./Modals/DeleteBoard";
import EditBoard from "./Modals/EditBoard";
import useBoardDetail from "../hooks/ContextHooks/useBoardDetail";
import useTheme from "../hooks/ContextHooks/useTheme";
const Header = () => {
  const [optMenu, setOptMenu] = useState(false);
  
  const [showAddTask, setShowAddTask] = useState(false)
  const [showDeleteBoard, setShowDeleteBoard] = useState(false)
  const [showEditBoard, setShowEditBoard] = useState(false)
  const {theme}= useTheme()

  const {isLoading,boardDetail}= useBoardDetail()
  const emptyColumnsStatus= (boardDetail?.columns && boardDetail?.columns.length==0)
  return (
    <>
      <header>
          <div className="header-flex">
            <div>
              <div className="nav-logo">
                <img src={theme==="dark"? darklogo : logo} />
              </div>
            </div>
            <div>
              <div className="header-content flexSB-center">
                <div className="active-board">
                  <h1>
                    {
                      boardDetail?.boardName
                    }{" "}
                    <span className="icon mobile">
                      <BiChevronDown />
                    </span>
                  </h1>
                </div>
                <div className="active-board mobile">
                  <h1>
                    Platform Launcher{" "}
                    <span className="icon mobile">
                      <BiChevronDown />
                    </span>
                  </h1>
                </div>
                <div className="header-action">
                  {
                    !isLoading &&
                  (<>
                  <button className="btn primary-btn" onClick={()=>{!emptyColumnsStatus && setShowAddTask(!showAddTask)}} disabled= {emptyColumnsStatus}>+Add New Task</button>
                  <button
                    className="opt-menu-btn icon btn-icon"
                    onClick={() => {
                      setOptMenu(!optMenu);
                    }}>
                    <HiOutlineDotsVertical />
                  </button>
                  </>)
                  }
                  {optMenu && (
                    <div className="menu-opt-card">
                      <button className="menu-item" onClick={()=>{setShowEditBoard(true); setOptMenu(!optMenu)}}>Edit Board</button>
                      <button className="menu-item" onClick={()=>{setShowDeleteBoard(!showDeleteBoard); setOptMenu(!optMenu)}}>Delete Board</button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
      </header>
      {
        showAddTask &&(
          <AddTask setShowModal={setShowAddTask}/>
        )
      }
      {
        showDeleteBoard && (
          <DeleteBoard setShowModal={setShowDeleteBoard}/>
        )
      }
      {
        showEditBoard && (
          <EditBoard setShowModal={setShowEditBoard}/>
        )
      }
    </>
  );
};

export default Header;
