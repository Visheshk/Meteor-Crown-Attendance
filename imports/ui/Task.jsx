import React from 'react';
import Barcode from 'react-jsbarcode';
import {QRCodeSVG} from 'qrcode.react';

export const Task = ({ visitor, onAddVisit, makeNewBarcode }) => {
  // console.log(visitor.barcodeId.length);
  // JsBarcode("#barcode", "Hi world!");

  const codeZoom = function () {
    // console.log("code click");
    console.log(visitor.barcodeId);
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
      <div  onClick={codeZoom}>
      {
        visitor.barcodeId.length > 0 &&
          // <Barcode value={visitor.barcodeId} options={{height:50, width: 3}} />    
          <QRCodeSVG value={visitor.barcodeId} />
      }
      </div>
       
      <span>Name: {visitor.name}, dob: {visitor.dob}</span>

      <button onClick={() => editVisitor({"visitor": visitor._id})}>Edit </button>
      <button onClick={() => makeNewBarcode({"visitor": visitor._id})}>Make new barcode</button>

      <button onClick={() => onAddVisit({"visitor": visitor._id, "room": "test"})}>Add visit</button>
    </li>
  );
};
