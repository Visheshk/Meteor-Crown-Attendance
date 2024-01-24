import React, { useState } from 'react';
// import Barcode from 'react-jsbarcode';
import { QRCodeSVG } from 'qrcode.react';
// import Lightbox from 'react-image-lightbox';
// import 'react-image-lightbox/style.css';
// import { renderToString } from 'react-dom/server';

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        {children}
      </div>
      <button onClick={onClose} className="modal-close-button">x</button>
    </div>
  );
};

export const Task = ({ visitor, onAddVisit, makeNewBarcode }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const codeZoom = function () {
    // console.log("code click");
    console.log(visitor.barcodeId);
    setIsModalOpen(true);
  }

  return (
    <li>
      <input
        type="checkbox"
        // checked={!!task.isChecked}
        // onClick={() => onCheckboxClick(task)}
        readOnly
      />
      {/*TODO: add an error boundary or check so this baarcode component doesn't crash everything*/}
      <div onClick={codeZoom}>
        {
          visitor.barcodeId.length > 0 &&
            // <Barcode value={visitor.barcodeId} options={{height:50, width: 3}} />
            <QRCodeSVG value={visitor.barcodeId} />
        }
      </div>

      {/* Modal component */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <QRCodeSVG value={visitor.barcodeId} size={256} />
      </Modal>
       
      <span>Name: {visitor.name}, dob: {visitor.dob}, {JSON.stringify(visitor)}</span>

      <button onClick={() => /*editVisitor({"visitor": visitor._id})*/null}>Edit </button>
      <button onClick={() => makeNewBarcode({"visitor": visitor._id})}>Make new barcode</button>

      <button onClick={() => onAddVisit({"visitor": visitor._id, "room": "test"})}>Add visit</button>
    </li>
  );
};
