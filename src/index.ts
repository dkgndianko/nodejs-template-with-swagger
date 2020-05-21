import server from "./server";
server.initAppComponents()
    .then(async () => {
    console.log("Starting the app...");
    await server.start();
    console.log("App started!")
    })
    .catch((error) => {
        console.log("App not started.");
        console.log(error);
    });
