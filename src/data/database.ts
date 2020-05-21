import mongoose from "mongoose";
import {MongoMemoryServer} from 'mongodb-memory-server'
import * as dotenv from 'dotenv';
dotenv.config();

export default class Database {
    static mongoServerTest: MongoMemoryServer;
    public static async connectToDatabase () {
        const {
            DATABASE_URL,
            DATABASE_NAME,
            NODE_ENV
        } = process.env;
        let url: string;
        if (NODE_ENV === 'test') {
            // use in memory database for mongo
            Database.mongoServerTest = new MongoMemoryServer();
            url = await Database.mongoServerTest.getConnectionString();
            console.log(`App running in test environment, using in memory mongo server with url: ${url}`);
        } else {
            url = DATABASE_URL || "";
            console.log(`Environment ${NODE_ENV}.`, ` Using URL ${url}`);
        }
        const mongooseOpts = {
            // options for mongoose 4.11.3 and above
            useNewUrlParser: true,
            useCreateIndex: true,
            useUnifiedTopology: true,
            dbName: DATABASE_NAME
        };

        // mongoose.connection.once('open', () => {
        //     console.log(`MongoDB successfully connected to ${url}`);
        // });
        return new Promise((resolve, reject) => {
            mongoose.connect(url, mongooseOpts).then(
                () => {
                    console.log(`MongoDB successfully connected to ${url}`);
                    resolve();
                }
            ).catch(
                (error) => {
                    reject(error);
                }
            )
        });
    }

    public static async clearDatabase() {
        const collections = mongoose.connection.collections;

        for (const key in collections) {
            const collection = collections[key];
            await collection.deleteMany({});
        }
    }

    static async disconnecFromDatabase(): Promise<string>{
        try {
            await mongoose.disconnect();
            if (Database.mongoServerTest) {
                if(await this.mongoServerTest.stop()){
                    console.log("Server is stopped");
                }
                else{
                    console.log("Error when stopping the server");
                }
            }
            return "MongoDB successfully disconnected";
        } catch (error) {
            return error;
        }
        
    }
}