import { Modal } from "../utils/Interface"

const ModalSetup = ({setShowModal, children}:Modal) => {
  return (
    <section className="modal" onClick={()=>setShowModal(false)}>
        <div className="modal-content" onClick={(e)=>e.stopPropagation()}>
            {children}
        </div>
    </section>
  )
}

export default ModalSetup