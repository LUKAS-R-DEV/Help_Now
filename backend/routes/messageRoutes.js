const express=require('express');
const router=express.Router();
const auth=require('../middleware/auth');
const{
    sendMessage,
    getMessagesByTicket
}=require('../controllers/messageController');

router.post('/:ticketId',auth,sendMessage);
router.get('/:ticketId',auth,getMessagesByTicket);

module.exports=router;