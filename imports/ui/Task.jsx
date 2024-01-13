import React from 'react';
import Barcode from 'react-jsbarcode';

export const Task = ({ visitor, onAddVisit, makeNewBarcode }) => {
  console.log(visitor);
  // JsBarcode("#barcode", "Hi world!");

  return (
    <li>
      <input
        type="checkbox"
        // checked={!!task.isChecked}
        // onClick={() => onCheckboxClick(task)}
        readOnly
      />
      <Barcode value={visitor.barcodeId} options={{height:20}} />
      <p> {}</p>

      <span>Name: {visitor.name}, info: {JSON.stringify(visitor)}</span>

      <button onClick={() => editVisitor({"visitor": visitor._id})}>Edit </button>
      <button onClick={() => makeNewBarcode({"visitor": visitor._id})}>Make new barcode</button>

      <button onClick={() => onAddVisit({"visitor": visitor._id, "room": "test"})}>Add visit</button>
    </li>
  );
};
