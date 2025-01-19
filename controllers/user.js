const mysql = require('mysql2/promise');
const dbconfig = require('../config/index').mysql;
const pool = mysql.createPool(dbconfig);
const utils = require('../utils');
const { param } = require('../utils/params');
const { error } = require('../utils/result');

const controller = {
    async ping(req, res, next) {
      next({
        success: 1,
        message: 'user',
      });
    },

    async createUser(req, res, next) {
        try {
          const body = req.body;
          const email = param(body, 'email');
          const name = param(body, 'name');
          const profile_picture = param(body, 'profile_picture');
          const connection = await pool.getConnection(async (conn) => conn);
          try {
            await connection.beginTransaction();
            await connection.query(
              `
                INSERT INTO
                users(email, name, profile_picture)
                VALUE
                (?, ?, ?);
              `,
              [email, name, profile_picture]
            );
            await connection.commit();
          next({ message: `Sign-up has been completed.`, status: 200 });
          } catch (e) {
            await connection.rollback();
          } finally {
            connection.release();
          }
        } catch (e) {
          next(e);
        }
      },

      async loginUser(req, res, next) {
        try {
          const body = req.body;
          const email = param(body, 'email');
    
          const [results] = await pool.query(
            `
              SELECT * 
              FROM users 
              WHERE email = ?;
            `,
            [email]
          );
    
          if (results.length < 1) {
            next({ token: "", message: "Login failed.", status: 400 });
          } else {
            const user_id = results[0].user_id;
            const email = results[0].email;
            const token = utils.sign({ user_id, email });
            next({ token, message: "You have successfully logged in.", status: 200 });
          }
        } catch (e) {
          next(e);
        }
      },

      async getUser(req, res, next) {
        try {
          const user_id = req.user.user_id;          
          const [result] = await pool.query(
            `
              SELECT user_id, email, name, profile_picture
              FROM users
              WHERE user_id = ?
              AND enable = 1 
            `,
            [user_id]
          );
    
          if (result.length < 1)
            throw error(`The account is either deactivated or does not exist.`);
    
          next({ ...result[0], message: "Success getting the account info.", status: 200 });
        } catch (e) {
          next(e);
        }
      },

      async getCategoryList(req, res, next) {
        try {
            const [result] = await pool.query(
              `
                SELECT category_id, name, color
                FROM categories
                WHERE enable = 1 
              `,
            );
    
          if (result.length < 1)
            throw error(`Fail getting the category list.`);
    
          next({ result, message: "Success getting the category list.", status: 200 });
        } catch (e) {
          next(e);
        }
      },

};  
module.exports = controller;