const { TicketSchema } = require('./Ticket.schema')

const insertTicket = (ticketObj) => {
    return new Promise((resolve,reject)=>{
        try {
            TicketSchema.create(ticketObj)
            .then((data)=>resolve(data))
            .catch((err)=>reject(err))
        } catch (error) {
            reject(err)
        }
    })
}

const getTickets = (clientId) => {
    return new Promise((resolve,reject)=>{
        try {
            TicketSchema.find({clientId})
            .then((data)=>resolve(data))
            .catch((error)=>reject(error))
        } catch (error) {
            reject(err)
        }
    })
}

const getTicketById = (_id, clientId) =>{
    return new Promise((resolve,reject)=>{
        try {
            console.log(`${_id}, ${clientId}`)
            TicketSchema.find({ _id, clientId })
            .then((data) => resolve(data))
            .catch((error) => reject(error));
        } catch (error) {
            reject(error)
        }
    })
}

const updateClientReply = ({ _id, message, sender }) => {
return new Promise((resolve, reject) => {
    try {
        TicketSchema.findOneAndUpdate(
        { _id },
        {
            status: "Pending operator response",
            $push: {
            conversations: { message, sender },
            },
        },
        { new: true }/**returns new data document */
        )
        .then((data) => resolve(data))
        .catch((error) => reject(error));
    } catch (error) {
    reject(error);
    }
});
};

const updateStatusClose = ({ _id, clientId }) => {
    return new Promise((resolve, reject) => {
        try {
        TicketSchema.findOneAndUpdate(
            { _id, clientId },
            {
            status: "Closed",
            },
            { new: true }
        )
            .then((data) => resolve(data))
            .catch((error) => reject(error));
        } catch (error) {
        reject(error);
        }
    });
};

const deleteTicket = ({ _id, clientId }) => {
    return new Promise((resolve, reject) => {
      try {
        TicketSchema.findOneAndDelete({ _id, clientId })
          .then((data) => resolve(data))
          .catch((error) => reject(error));
      } catch (error) {
        reject(error);
      }
    });
  };

module.exports = {
    insertTicket,
    getTickets,
    getTicketById,
    updateClientReply,
    updateStatusClose,
    deleteTicket
}