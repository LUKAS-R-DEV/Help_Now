const express=require('express');
const router=express.Router();
const auth=require('../middleware/auth');
const {addComment,getCommentsByTicket}=require('../controllers/commentController');
router.post('/:ticketId',auth,addComment);
router.get('/:ticketId',auth,getCommentsByTicket);

module.exports=router;