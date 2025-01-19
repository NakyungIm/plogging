const mysql = require('mysql2/promise');
const dbconfig = require('../config/index').mysql;
const pool = mysql.createPool(dbconfig);
const { error } = require('../utils/result');
const { classifyLitter } = require('./Openai');

const controller = {

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

      async getCategoryColor(req, res, next){
        try{
            
            const litter = await classifyLitter();
            console.log("Classified litter:", litter);
            const name = litter.replace("the ", "");
            console.log("Name:", name);

            const [result] = await pool.query(
                `
                SELECT color
                FROM categories
                WHERE name = ?
                `,
                [name]
            );

            if (result.length < 1 ) {
                throw error(`The record is not existed.`)
            }

            next({... result[0], message:"Successfully retrieved the record info.", status: 200})
        } catch (e){
            next(e)
        }
    }

};  
module.exports = controller;