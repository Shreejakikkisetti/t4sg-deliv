import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { confirmAlert } from 'react-confirm-alert'; // Import
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import FormControl from '@mui/material/FormControl';
import IconButton from '@mui/material/IconButton';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import * as React from 'react';
import { useState } from 'react';
import { categories } from '../utils/categories';
import { addEntry } from '../utils/mutations';
import { updateEntry } from '../utils/mutations';
import { deleteEntry } from '../utils/mutations';
import QRCode from "qrcode.react";




// Modal component for individual entries.

/* EntryModal parameters:
entry: Data about the entry in question
type: Type of entry modal being opened. 
   T`hi`s can be "add" (for adding a new entry) or 
   "edit" (for opening or editing an existing entry from table).
user: User making query (The current logged in user). */



export default function EntryModal({ entry, type, user }) {

   const submit = () => {
        confirmAlert({
          title: 'Confirm to submit',
          message: 'Are you sure to do this.',
          buttons: [
            {
              label: 'Yes',
            },
            {
              label: 'No',
            }
          ]
        });
      };


    

   // State variables for modal status

   // TODO: For editing, you may have to add and manage another state variable to check if the entry is being edited.

   const [isedit, setEdit] = useState(false);

   const [open, setOpen] = useState(false);
   const [name, setName] = useState(entry.name);
   const [link, setLink] = useState(entry.link);
   const [description, setDescription] = useState(entry.description);
   const [category, setCategory] = React.useState(entry.category);

   // const [isedit, setEdit] = useState(false);


   
   // Modal visibility handlers

   const handleClickOpen = () => {
      setOpen(true);
      setName(entry.name);
      setLink(entry.link);
      setDescription(entry.description);
      setCategory(entry.category);
   };

   const handleClose = () => {
      setOpen(false);
   };

   const alertModal = (event) => {
      const result = submit("are you sure");
      if(result == false) {
         event.preventDefault();
      }
   }

   // Mutation handlers

   const handleAdd = () => {
      const newEntry = {
         name: name,
         link: link,
         description: description,
         user: user?.displayName ? user?.displayName : "GenericUser",
         category: category,
         userid: user?.uid,
      };

      addEntry(newEntry).catch(console.error);
      handleClose();

   };


   const handleEdit = () => {
      setEdit(true);
      
      // addEntry(newEntry).catch(console.error);
      // handleClose();

      // addEntry(newEntry).catch(console.error);
      // handleClose();
      // // handleClose();
      // // this.setName("BOB")


   };   // TODO: Add Edit Mutation Handler
   const handleConfirm = () => {
      const newEntry = {
         name: name,
         link: link,
         description: description,
         category: category,
         id: entry.id
      };

      updateEntry(newEntry).catch(console.error);
      handleClose();
      setEdit(false);

   };

   const handleDelete = () => {
      if (window.confirm("Are you sure you want to delete?")) {
         deleteEntry(entry.id).catch(console.error);
         handleClose();
         setEdit(false);
      }



   };
   

   // TODO: Add Delete Mutation Handler

   // Button handlers for modal opening and inside-modal actions.
   // These buttons are displayed conditionally based on if adding or editing/opening.
   // TODO: You may have to edit these buttons to implement editing/deleting functionality.

   const openButton =
      type === "edit" ? <IconButton onClick={handleClickOpen}>
         <OpenInNewIcon />
      </IconButton>
         : type === "add" ? <Button variant="contained" onClick={handleClickOpen}>
            Add entry
         </Button>
            : null;

   const actionButtons =
      type === "edit" ? (
         <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button onClick={handleDelete}>Delete</Button>

            {isedit? (
               <Button variant = "contained" onClick={handleConfirm}>
                  confirm
               </Button>
            ) : (
               <Button variant = "contained" onClick={handleEdit}>
                  Edit
               </Button>

            )}



         </DialogActions>

         ): type === "add" ?
            <DialogActions>
               <Button onClick={handleClose}>Cancel</Button>
               <Button variant="contained" onClick={handleAdd}>Add Entry</Button>
            </DialogActions>
            : null;

   // const editButton = 
   //    type === "edit" ?
   //       <Button onClick = {handleEdit}> Edit</Button>
   //       : null;




         

   return (
      <div>
         {openButton}
         <Dialog open={open} onClose={handleClose}>

            <DialogTitle>{type === "edit" ? name : "Add Entry"}</DialogTitle>
            
            <DialogContent>
               {/* TODO: Feel free to change the properties of these components to implement editing functionality. The InputProps props class for these MUI components allows you to change their traditional CSS properties. */}
               <TextField
                  margin="normal"
                  id="name"
                  label="Name"
                  fullWidth
                  variant="standard"
                  value={name}
                  InputProps={{
                     readOnly: type === "edit" ? !isedit : false,
                   }}
                  onChange={(event) => setName(event.target.value)}
               />
               <TextField
                  margin="normal"
                  id="link"
                  label="Links"
                  placeholder="e.g. https://google.com"
                  fullWidth
                  variant="standard"
                  value={link}
                  InputProps={{
                     readOnly:  type === "edit" ? !isedit : false,
                   }}
                  onChange={(event) => setLink(event.target.value)}
               />
               <QRCode value={link} style={{ marginRight: 50 }}
                  label="QRCode"
                  margin="normal"
                  ariant="standard"
                  fullWidth
               
               />
               <TextField
                  margin="normal"
                  id="description"
                  label="Description"
                  fullWidth
                  variant="standard"
                  multiline
                  maxRows={8}
                  value={description}
                  InputProps={{
                     readOnly: type === "edit" ? !isedit : false,
                   }}
                  onChange={(event) => setDescription(event.target.value)}
               />


              
               <FormControl fullWidth sx={{ "margin-top": 20 }}>
                  <InputLabel id="demo-simple-select-label">Category</InputLabel>
                  <Select
                     labelId="demo-simple-select-label"
                     id="demo-simple-select"
                     value={category}
                     label="Category"
                     inputProps={{
                        readOnly: type === "edit" ? !isedit : false,
                      }}
                     IconComponent={() => <FormControl style={{ display: "none" }} />}
                     onChange={(event) => setCategory(event.target.value)}
                  >
                     {categories.map((category) => (<MenuItem value={category.id}>{category.name}</MenuItem>))}
                  </Select>
                  
               </FormControl>
            </DialogContent>
            {actionButtons}

         </Dialog>
      </div>
   );
}