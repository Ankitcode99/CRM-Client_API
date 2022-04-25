const express = require('express');
const { insertTicket, getTickets, getTicketById, deleteTicket, updateClientReply, updateStatusClose } = require('../models/ticket/Ticket.model');
const router = express.Router();
const {userAuthorization} = require('../middlewares/authorization.middleware')

router.get('/',userAuthorization, async (req,res)=>{
    try {
        const userId = req.userID;
        const result = await getTickets(userId);

        return res.json({
            status: "success",
            result,
        });
    } catch (error) {
        res.json({ status: "error", message: error.message });
    }
})

router.get('/:_id',userAuthorization, async(req,res)=>{
    try{
        const { _id } = req.params;

        const clientId = req.userID;
        const result = await getTicketById(_id, clientId);

        return res.json({
        status: "success",
        result,
        });
    } catch (error) {
    res.json({ status: "error", message: error.message });
    }
})

router.post('/',userAuthorization ,async (req,res)=>{
    try {
        const {subject,sender,message} = req.body
        const clientId = req.userID

        const ticketObj = {
            clientId: clientId,
            subject,
            conversations: [
                {
                    sender,
                    message                
                }
            ]
        }
    
        const result = await insertTicket(ticketObj);
    
        if (result._id) {
            return res.json({
              status: "success",
              message: "New ticket has been created!",
            });
        }
    
        res.json({
        status: "error",
        message: "Unable to create the ticket , please try again later",
        });
    } catch (error) {
        res.json({
            status: "error",
            message: error.message
        })
    }
})

router.put('/:_id',userAuthorization, async(req,res)=>{
    try {
        const { message, sender } = req.body;
        const { _id } = req.params;
        
        const result = await updateClientReply({ _id, message, sender });
  
        if (result._id) {
          return res.json({
            status: "success",
            message: "your message updated",
          });
        }
        res.json({
          status: "error",
          message: "Unable to update your message please try again later",
        });
    } catch (error) {
        res.json({ status: "error", message: error.message });
    }
})

router.patch('/close-ticker/:_id', userAuthorization, async(req,res)=>{
    try {
        const { _id } = req.params;
        const clientId = req.userID;

        const result = await updateStatusClose({ _id, clientId });

        if (result._id) {
            return res.json({
                status: "success",
                message: "The ticket has been closed",
            });
        }
        res.json({
            status: "error",
            message: "Unable to update the ticket",
        });
        } catch (error) {
        res.json({ status: "error", message: error.message });
    }
})

router.delete("/:_id", userAuthorization, async (req, res) => {
    try {
        const { _id } = req.params;
        const clientId = req.userId;

        const result = await deleteTicket({ _id, clientId });

        return res.json({
        status: "success",
        message: "The ticket has been deleted",
        });
    } catch (error) {
        res.json({ status: "error", message: error.message });
    }
});

module.exports = router;