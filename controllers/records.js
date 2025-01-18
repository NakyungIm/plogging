const mysql = require('mysql2/promise');
const dbconfig = require('../config/index').mysql;
const pool = mysql.createPool(dbconfig);
const { param } = require('../utils/params');
const { error } = require('../utils/result');

const controller = {
    async createRecord(req, res, next){
        try{
            const body= req.body;
            const user_id = param(body, 'user_id');
            const start_time = param(body, 'start_time');
            const end_time = param(body, 'end_time');
            const distance = param(body, 'distance');
            const blue_no = param(body, 'blue_no');
            const green_no = param(body, 'green_no');
            const black_no = param(body, 'black_no');
            
            const connection = await pool.getConnection(async (conn) => conn);
            try{
                await connection.beginTransaction();
                // 查询时间差
                const [durationResult] = await connection.query(`
                SELECT TIMESTAMPDIFF(MINUTES, ?, ?) AS time_difference;
                `, [start_time, end_time]
                );
                const duration = durationResult[0].time_difference;
                console.log(`Time difference: ${duration} minutes`);
                await connection.query(
                    `
                    INSERT INTO
                    records(user_id, start_time, end_time, duration, distance, blue_no, green_no, black_no)
                    VALUES
                    (?,?,?,?,?,?,?,?,?);
                    `,
                    [user_id, start_time, end_time, duration, distance, blue_no, green_no, black_no]
                );
                await connection.commit()
                const [result] = await pool.query (
                    `
                    SELECT *
                    FROM records
                    WHERE user_id = ?
                    AND start_time = ?
                    AND end_time = ?
                    `,
                    [user_id, start_time, end_time]
                );
                delete result[0].enable;
                next({...result[0], message:"Record created successfully", status: 200});
            } catch (e) {
                await connection.rollback();
            } finally {
                connection.release();
            } 
        }catch (e) {
            next(e);
        }
    },

    async getRecordList(req, res, next){
        console.log(req);
        try{
            const user_id = req.params.user_id;
            
            const[result] = await pool.query(
                `
                SELECT record_id, user_id, start_time, end_time, distance, blue_no, green_no, black_no
                FROM records
                WHERE user_id = ?
                `,
                [user_id]
            );

            if(result.length < 1){
                next({...[], message: "This user didn't have any records before.", status: 400});
            }else{
                next({data: result, message:"Success getting all the records of this user.", status:200})
            }
        }catch (e) {
            next(e);
        }
    },

    async getRecord(req, res, next){
        try{
            const record_id = req.params.record_id;

            const [result] = await pool.query(
                `
                SELECT record_id, user_id, start_time, end_time, distance, blue_no, green_no, black_no
                FROM records
                WHERE record_id = ?
                `,
                [record_id]
            );

            if (result.length < 1 ) {
                throw error(`The record is not existed.`)
            }

            next({... result[0], message:"Successfully retrieved the record info.", status: 200})
        } catch (e){
            next(e)
        }
    }
}
module.exports = controller;