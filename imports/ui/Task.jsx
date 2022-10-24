import React from 'react';
import Barcode from 'react-jsbarcode';

export const Task = ({ visitor, onAddVisit, makeNewBarcode }) => {
  // console.log(visitor);
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

      <span>Name: {visitor.name}, Age: {visitor.age}, Gender: {visitor.gender}, Dob: {visitor.dob}, current room: {visitor.currentRoom}, notes: {visitor.notes}, barcode: {visitor.barcodeId}</span>
      <button onClick={() => makeNewBarcode({"visitor": visitor._id})}>Make new barcode</button>

      <button onClick={() => onAddVisit({"visitor": visitor._id, "room": "test"})}>Add visit</button>
    </li>
  );
};
