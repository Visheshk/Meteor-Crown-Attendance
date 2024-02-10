import React, { useState } from 'react';
// import Barcode from 'react-jsbarcode';
import { QRCodeSVG } from 'qrcode.react';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
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
      <Box sx={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%', // Adjust as needed
        height: 'auto', // Adjust as needed, or use a specific value
        
        p: 2, // Padding inside the box, adjust as needed
        gap: 2, // Space between children
      }}>
        <Button variant="outline"  sx={{ color: 'white', backgroundColor: 'gray', '&:hover': { backgroundColor: 'darkgray' } }} onClick={() => /*editVisitor({"visitor": visitor._id})*/null}>Edit </Button>
        <Button variant="outline" onClick={() => makeNewBarcode({"visitor": visitor._id})}>Make new barcode</Button>
        <Button variant="outline" onClick={() => onAddVisit({"visitor": visitor._id, "room": "test"})}>Add visit</Button>

      </Box>


    </li>
  );
};
