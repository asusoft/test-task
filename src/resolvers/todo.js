const { db } = require('../firebase/admin');
const TokenService = require('../services/tokenService');

module.exports = {
    Todo: {
        createdBy: async (parent) => {
          const userId = parent.createdBy;
          const userDoc = await db.collection('users').doc(userId).get();
          if (!userDoc.exists) {
            throw new Error('User not found');
          }
          return { id: userDoc.id, ...userDoc.data() };
        },
      },
    Query: {
        getMyTodos: async (_, __, { req }) => {
            const token = req.headers.authorization;
            if (!token) {
              throw new Error('Authorization token missing');
            }
          
            const userId = await TokenService.get_id_from_access_token(token);
            if (!userId) {
              throw new Error('Invalid or expired token');
            }
          
            const snapshot = await db.collection('todos').where('createdBy', '==', userId).get();
            if (snapshot.empty) {
              return [];
            }

            return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        },
    },
    Mutation: {
        createTodo: async (_, { input }, { req }) => {
            const token = req.headers.authorization;
            if (!token) {
                throw new Error('Authorization token missing');
            }
            const userId = await TokenService.get_id_from_access_token(token);
            const newTodo = { ...input, createdBy: userId, status: 'PENDING', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
            const docRef = await db.collection('todos').add(newTodo);
            return { id: docRef.id, ...newTodo };
        },
        updateTodo: async (_, { input }, { req }) => {
            const token = req.headers.authorization;
            if (!token) {
              throw new Error('Authorization token missing');
            }
            
            const userId = await TokenService.get_id_from_access_token(token);
            if (!userId) {
              throw new Error('Invalid or expired token');
            }
          
            const { id, ...updates } = input;
          
            const todoDoc = await db.collection('todos').doc(id).get();
            if (!todoDoc.exists) {
              throw new Error('Todo not found');
            }
          
            const todoData = todoDoc.data();
            if (todoData.createdBy !== userId) {
              throw new Error('You are not authorized to update this todo');
            }
        
            await db.collection('todos').doc(id).update({ ...updates, updatedAt: new Date().toISOString() });
          
            const updatedTodo = await db.collection('todos').doc(id).get();
            return { id, ...updatedTodo.data() };
          },
        deleteTodo: async (_, { id }, { req }) => {
            const token = req.headers.authorization;
            if (!token) {
              throw new Error('Authorization token missing');
            }
        
            const userId = await TokenService.get_id_from_access_token(token);
            if (!userId) {
              throw new Error('Invalid or expired token');
            }
  
            const todoDoc = await db.collection('todos').doc(id).get();
            if (!todoDoc.exists) {
              throw new Error('Todo not found');
            }
          
            const todoData = todoDoc.data();
            if (todoData.createdBy !== userId) {
              throw new Error('You are not authorized to delete this todo');
            }
          
            await db.collection('todos').doc(id).delete();
            return true;
        },
    },
};
