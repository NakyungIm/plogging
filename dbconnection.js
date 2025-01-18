import mysql from "mysql2/promise";

// create connectionpool
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '123456',
    database: 'test',
    waitForConnections: true,
    isInit: false,
    connectionLimit: 10,      // Maximum connection pool
    queueLimit: 0             
});

pool.isInit = false;

async function init(){
    let connection;
    try {
        // get connection from connectionpool
        connection = await pool.getConnection();
        // init database
        let [results] = await connection.query("SHOW TABLES Like 'users'");
        if (results.length === 0){
            const createUserTable=`
                CREATE TABLE users(
                    user_id int(11) NOT NULL,
                    email varchar(50) NULL,
                    name varchar(20) NULL,
                    profile_picture varchar(100) NULL,
                    create_datetime datetime NULL,
                    update_datetime datetime NULL,
                    delete_datetime datetime NULL,
                    enable  tinyint(1)  NULL
                )
            `;
        await connection.query(createUserTable);
        console.log("Table 'user' created.");
        }
        
        [results] = await connection.query("SHOW TABLES Like 'records'");
        if (results.length === 0){
            const createRecordsTable=`
                CREATE TABLE records (
                    record_id int(11) NOT NULL,
                    user_id int(11) NULL,
                    start_time datetime NULL,
                    end_time datetime NULL,
                    distance float NULL,
                    blue_no int(11) NULL,
                    green_no int(11) NULL,
                    black_no int(11) NULL,
                    create_datetime datetime NULL,
                    update_datetime datetime NULL,
                    delete_datetime datetime NULL,
                    enable tinyint(1) NULL
                )
            `;
            await connection.query(createRecordsTable);
            console.log("Table 'records' created.");
        }
        
        [results] = await connection.query("SHOW TABLES Like 'categories'");
        if (results.length === 0){
            const createCategoroyTable =`
                CREATE TABLE categories (
                    category_id int(11) NOT NULL,
                    name varchar(50) NULL,
                    color varchar(20) NULL,
                    create_datetime datetime NULL,
                    update_datetime datetime NULL,
                    delete_datetime datetime NULL,
                    enable tinyint(1) NULL
                );
            `;
            await connection.query(createCategoroyTable);
            console.log("Table 'Categories' created.");
        }
        let addConstraint = `ALTER TABLE users ADD CONSTRAINT PK_USERS PRIMARY KEY (user_id);`
        await connection.query(addConstraint);
        addConstraint = `ALTER TABLE records ADD CONSTRAINT PK_RECORDS PRIMARY KEY (record_id);`
        await connection.query(addConstraint);
        addConstraint = `ALTER TABLE categories ADD CONSTRAINT PK_CATEGORIES PRIMARY KEY (category_id);`
        await connection.query(addConstraint);
        console.log("Constraint created successfully.")
        console.log(pool.isInit);
        pool.isInit = true;
        console.log(pool.isInit); 
    } catch (err) {
        console.error('Error querying MySQL:', err);
    } finally {
        // release connection
        if (connection) connection.release();
    }
}

// Use connection for query
export async function query() {
    if (pool.isInit){
        init()
    }
    let connection;
    try {
        // get connection from connectionpool
        connection = await pool.getConnection();
        
        let [result] = await connection.query("SHOW TABLES LIKE 'users'");
        console.log('The database is connected successfully');  // return query results
        console.log(result);  // return query results
    } catch (err) {
        console.error('Error querying MySQL:', err);
    } finally {
        // release connection
        if (connection) connection.release();
    }
}

// using querying
query();

